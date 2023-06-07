import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GenericApi } from 'src/app/lib/oa/core/services/generic-api';
import { environment } from 'src/environments/environment';
// import { environment } from 'src/environments/environment';
import {
  Employee,
  Organization,
  Role,
  RoleType,
  Service,
  Session,
  Tenant,
  User
} from '../../directory/models';
import { Profile } from '../../directory/models/profile.model';
import { IUser } from '../models';
import { IAuth } from './auth.interface';
import { LocalStorageService } from './local-storage.service';
import { Application } from '../models/application.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService implements IAuth {

  private _redirectUrl = '/home/dashboard';

  private _organization: Organization;
  private _tenant: Tenant;
  private _application: Application;
  private _role: Role;
  private _lastSession: Session;
  private _isImpersonateSession: Boolean;
  private _myRoles: Role[];
  private _user: User;
  private _session: Session;
  private _authApi: GenericApi<any>;
  private _rolesApi: GenericApi<Role>;
  private _sessionsApi: GenericApi<Session>;

  private _organizationSubject = new Subject<Organization>();
  private _tenantSubject = new Subject<Tenant>();
  private _applicationSubject = new Subject<Application>();
  private _roleSubject = new Subject<Role>();
  private _userSubject = new Subject<User>();
  private _sessionSubject = new Subject<Session>();
  private _impersonateSubject = new BehaviorSubject<Boolean>(false);

  organizationChanges = this._organizationSubject.asObservable();
  applicationChanges = this._applicationSubject.asObservable();
  tenantChanges = this._tenantSubject.asObservable();
  roleChanges = this._roleSubject.asObservable();
  userChanges = this._userSubject.asObservable();
  impersonateChanges = this._impersonateSubject.asObservable();

  newUser(user: any) {
    this._userSubject.next(user);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private localDb: LocalStorageService
  ) {

    this._authApi = new GenericApi(this.http, 'directory', {
      collection: 'users',
      auth: this
    });
    this._rolesApi = new GenericApi(this.http, 'directory', {
      collection: 'roles',
      auth: this
    });
    this._sessionsApi = new GenericApi(this.http, 'directory', {
      collection: 'sessions',
      auth: this
    });
  }


  private _getDirectoryUrl() {
    const tenant = this.currentTenant();

    if (!tenant) {
      return;
    }
  }

  private _defaultRole(user: User): Role {
    // user.roles.length
    return user.roles.find((item) => !item.organization);
  }
  // user:any;
  private _extractRole(user: User): Observable<Role> {
    const subject = new Subject<Role>();
    const defaultRole = this._defaultRole(user);
    const roleKey = (this.localDb.get('role') || {}).key;

    // if (this._user && this._user.roles && this._user.roles.length >= 2) {
    //   let role: Role = this._user.roles.find((item) => item.key === roleKey)
    //   if (!role) {
    //     role = this._user.roles.find((r) => !!r.organization) || this._user.roles[0];
    //   }
    //   subject.next(role)
    // }

    this._getMyRolesByApi(defaultRole.key).subscribe((roles) => {
      this._myRoles = roles;
      let role;
      if (roles.length > 1) {
        if (roleKey) {
          role = roles.find((item) => item.key === roleKey);
        } else if (defaultRole && defaultRole.type.code !== 'user') {
          role = defaultRole;
        } else if (roles.length) {
          role = roles.find((r) => !!r.organization) || roles[0];
        }
      } else {
        role = roles[0];
      }

      this._user = user;
      this._user.roles = roles;
      subject.next(role);
    });

    return subject.asObservable();
  }

  private _getMyRolesByApi(defaultRoleKey): Observable<Role[]> {
    const params = { 'role-key': defaultRoleKey, 'user': 'my' };
    const roleApi = new GenericApi(this.http, 'directory', { collection: 'roles', auth: this });
    return roleApi.search(params).pipe(map((page) => {
      return page.items.map((item) => new Role(item));
    }));
  }

  /*private _getMyRolesByApi(defaultRoleKey): Observable<Role[]> {
    let params = { 'role-key': defaultRoleKey, "user": 'my' }
    const roleApi = new GenericApi(this.http, 'directory', { collection: 'roles', auth: this });
    return roleApi.search(params).pipe(map((page) => {
      return page.items.map((item) => new Role(item))
    }));
  } */

  private _setRole(role: Role) {
    this._role = role;

    if (role) {

      if (!role.email && this._user) {
        role.email = this._user.email;
      }

      if (!role.phone && this._user) {
        role.phone = this._user.phone;
      }

      role.permissions.push('user');
      role.permissions.push(`role:${role.type.code}`);
      role.permissions.push(`email:${role.email}`);
      role.permissions.push(`phone:${role.phone}`);

      (role.type.permissions || []).map((p) => {
        if (!role.permissions.includes(p)) { role.permissions.push(p); }
      });
      if (role.employee) {
        role.permissions.push('organization.employee');
      }
      this.localDb.update('role', role);
      this._setOrganization(role.organization);
    } else {
      this.localDb.remove('role');
    }
    this._roleSubject.next(this._role);
    return role;
  }

  private _setUser(user: User) {
    this._user = user;

    if (user) {
      user.meta = user.meta || {};
    }
    this.localDb.update('user', this._user);
    this._userSubject.next(this._user);
    return user;
  }

  private _setTenant(tenant: Tenant) {
    this._tenant = tenant;
    if (tenant) {
      tenant.meta = tenant.meta || {};
    }

    this.localDb.update('tenant', tenant);
    // this._setOrganization(null);
    this._tenantSubject.next(this._tenant);
    return tenant;
  }

  private _setApplication(item: Application) {
    this._application = item;
    if (item) {
      item.meta = item.meta || {};
    }

    this.localDb.update('application', item);
    this._applicationSubject.next(this._application);
    return item;
  }

  private _setSession(item: Session) {
    this.localDb.update('session', new Session(item));
    this._session = item
    this._sessionSubject.next(this._session);
    return item;
  }

  private _setOrganization(item: Organization) {
    if (item && !item.code) {
      item = null;
    }
    this._organization = item;

    if (item) {
      item.meta = item.meta || {};
    }

    this.localDb.update('organization', item);
    this._organizationSubject.next(this._organization);
    return item;
  }

  getService(code: string): Service {
    return this._application.services.find((s) => s.code === code);
  }

  getHeaders(): { key: string, value: string }[] {
    let headers = [];
    if (this._application && this._application.code) {
      headers.push({ key: 'x-application-code', value: this._application.code });
    }

    if (this._session && this._session.id) {
      headers.push({ key: 'x-session-id', value: this._session.id });
    }

    if (this._session && this._session.token) {
      headers.push({ key: 'x-access-token', value: this._session.token });
    }

    if (this._role && this._role.key) {
      headers.push({ key: 'x-role-key', value: this._role.key });
    }

    if (this._organization && this._organization.code) {
      headers.push({ key: 'x-organization-code', value: this._organization.code });
    }

    if (this._tenant && this._tenant.code) {
      headers.push({ key: 'x-tenant-code', value: this._tenant.code });
    }
    return headers;
  }


  signup(user: User, organization?: Organization, roleType?: string, source?: any, app?: string): Observable<Session> {
    const email = user.email;
    const phone = user.phone;

    // eslint-disable-next-line max-len
    if (email.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|glass|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i)) {
      user.email = email;
    } else if (phone.match(/^\d{10}$/)) {
      user.phone = phone;
    } else if (phone.match(/^(\+\d{1,3}[- ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
      user.phone = phone;
    } else if (phone.match(/^(\+\d{1,3}[- ]?)?\(?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/)) {
      user.phone = phone;
    } else {
      throw new Error('mobile or email is required');
    }

    const model: any = {
      purpose: 'signup',
      app: 'www',
      user,
      meta: {
        organization,
        roleType,
        source
      }
    };

    const subject = new Subject<Session>();
    this._authApi.post(model, 'signUp').subscribe((data) => {
      subject.next(data);
    }, (err) => {
      subject.error(err);
    });

    return subject.asObservable();
  }

  sendOtp(email: string, mobile: string, code: string, templateCode?: string): Observable<any> {
    return this._authApi.post({ email, mobile, code, templateCode }, 'resend');
  }

  exists(identity: string, type?: string): Observable<any> {

    if (!type) {
      // eslint-disable-next-line max-len
      if (identity.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|glass|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i)) {
        type = 'email';
      } else if (
        identity.match(/^\d{10}$/) ||
        identity.match(/^(\+\d{1,3}[- ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
        type = 'mobile';
      } else {
        type = 'code';
      }
    }

    return this._authApi.get(`exists?${type}=${identity}`);
  }

  verifyPassword(email: string, mobile: string, code: string, employeeCode, password: string,
    app?: string, device?: string): Observable<Role> {
    const subject = new Subject<Role>();
    const model = {
      purpose: 'login',
      app: app || 'chrome',
      device,
      user: {
        email,
        mobile,
        code,
        employee: { code: employeeCode },
        password
      }
    };

    this._authApi.post(model, 'signIn').subscribe((data) => {
      this._setSession(new Session(data));
      this._setUser(new User(data.user));
      const role = this._setRole(new Role(data.role));
      subject.next(role);
    }, (err) => {
      subject.error(err);
    });

    return subject.asObservable();
  }

  authSuccess(token: string, provider: string, applicaton?: string, device?: string): Observable<Role> {
    const subject = new Subject<Role>();
    this._authApi.get(`auth/${provider}/success?app=${applicaton || 'chrome'}&code=${token}`).subscribe((data) => {
      this._setSession(new Session(data));
      this._setUser(new User(data.user));
      const role = this._setRole(new Role(data.role));
      subject.next(role);
    });
    return subject.asObservable();
  }

  setPassword(password): Observable<any> {
    return this._authApi.post({ password }, `resetPassword`);
  }

  initPassword(model: any, otp: string, password: string): Observable<any> {
    const subject = new Subject<any>();
    this._authApi.post({
      id: model.id || model,
      profile: model.profile,
      otp,
      password
    }, `setPassword`).subscribe((data) => {
      const user = this._setUser(new User(data));
      this._extractRole(user).subscribe((role) => {
        this._setRole(role);
        subject.next(role);
      });
    });
    return subject.asObservable();
  }

  forgotPassword(model: any, otp: string, password: string): Observable<any> {
    const subject = new Subject<any>();
    this._authApi.post({
      id: model.id || model,
      profile: model.profile,
      otp,
      password
    }, `setPassword`).subscribe((data) => {
      const user = new User(data);
      subject.next(user);
    }, (error) => {
      subject.error(error)
    });
    return subject.asObservable();
  }

  verifyOtp(id: string, otp: string): Observable<Role> {
    const subject = new Subject<any>();
    this._authApi.post({ id, otp }, 'confirm').subscribe((data) => {
      const user = this._setUser(new User(data));
      this._extractRole(user).subscribe((role) => {
        this._setRole(role);
        subject.next(role);
      });
    });
    return subject.asObservable();
  }

  refreshUser() {
    const currentUser = this.currentUser();
    if (currentUser) {

      const defaultRole = this._defaultRole(currentUser);
      const headers = [{
        key: 'x-role-key',
        value: defaultRole.key,
      }];
      const api = new GenericApi(this.http, 'directory', { auth: this, collection: 'users', headers });

      api.get('my').subscribe((data) => {
        const user = this._setUser(new User(data));
        this._extractRole(user).subscribe((role) => { this._setRole(role); });
      });
    }
  }

  currentRole(): Role {
    if (this._role) { return this._role; }

    if (this.getRole()) { return this.getRole(); }

    return undefined;
  }

  currentUser(): User {

    this._isImpersonateSession = this.localDb.get('isImpersonateSession')
    this._impersonateSubject.next(this._isImpersonateSession || false)

    if (this._user) {
      return this._user;
    }

    const savedUser = this.localDb.get('user');

    let user: User = null;

    if (savedUser) {
      user = this._setUser(new User(savedUser));
    }

    return user;
  }

  currentSession(): Session {
    if (this._session) {
      return this._session;
    }

    let session = this.localDb.get('session');

    if (!session && environment.code) {
      session = new Session(environment.code);
    }

    return this._setSession(session);
  }

  currentApplication(): Application {
    if (this._application) {
      return this._application;
    }

    let application = this.localDb.get('application');

    // if (!item && environment.code) {
    //   item = new Application(environment.code);
    // }

    if (!this._application && !application) {
      return;
    }

    return this._setApplication(application);
  }

  currentTenant(): Tenant {
    if (this._tenant) {
      return this._tenant;
    }

    let tenant = this.localDb.get('tenant');

    // if (!tenant && environment.code) {
    //   tenant = new Tenant(environment.code);
    // }

    if (!this._tenant && !tenant) {
      return;
    }

    return this._setTenant(tenant);
  }

  currentOrganization(): Organization {
    if (this._organization && this._organization.code) {
      return this._organization;
    }

    let item = this.localDb.get('organization');

    // TODO
    // const orgCode = route.snapshot.queryParams['organization-code'];
    if (!item && environment.organization && environment.organization.code) {
      item = new Organization(environment.organization);
    }

    if (item) {
      return this._setOrganization(item);
    }

    return null;
  }

  addRole(role: Role) {
    const user = this.currentUser();
    if (!user) { return null; }
    let newRole = user.roles.find((item) => item.key === role.key);
    if (!newRole) {
      user.roles.push(role);
      newRole = role;
      this.localDb.update('user', user);
    }
    return newRole;
  }

  getMyRoles() {
    return this._myRoles;
  }

  getRole() {
    return this.localDb.get('role');
  }

  getRoleKey() {
    return (this.localDb.get('role') || {}).key;
  }

  setRole(role?: Role) {
    const user = this.currentUser();
    if (!user) { return; }

    if (!role) {
      role = this._defaultRole(user);
    }

    const newRole = user.roles.find((item) => item.key === role.key);
    if (newRole) {
      this._setRole(newRole);
    }

    return newRole;
  }

  setRoleKey(roleKey: string): Observable<Role> {
    const api = new GenericApi(this.http, 'directory', {
      collection: 'users',
      auth: this,
      headers: [{
        key: 'x-role-key',
        value: roleKey,
      }],
    });
    return api.get('my').pipe(map((data) => {
      const user = this._setUser(new User(data));
      const newRole = user.roles.find((item) => item.key === roleKey);
      if (newRole) {
        this._setRole(newRole);
      }
      return newRole;
    }));
  }

  setSessionToken(token: string): Observable<Role> {
    const api = new GenericApi(this.http, 'directory', {
      collection: 'sessions',
      auth: this,
      headers: [{
        key: 'x-access-token',
        value: token,
      }],
    });
    return api.get('my').pipe(map(((data: Session) => {
      this._setSession(new Session(data));
      this._setUser(new User(data.user));
      const role = this._setRole(new Role(data.role));
      return role;
    })));
  }

  setApplication(item: Application): Application {
    return this._setApplication(item);
  }

  setTenant(item: Tenant): Tenant {
    return this._setTenant(item);
  }

  setOrganization(item: Organization): Organization {
    return this._setOrganization(item);
  }

  setUser(item: User): User {
    return this._setUser(item);
  }

  impersonateSession(session: Session) {

    this._lastSession = this._session
    this.localDb.update('lastSession', this._lastSession);

    this._setSession(new Session(session));
    this._setUser(new User(session.user));
    this._setRole(new Role(session.role));

    this._isImpersonateSession = true
    this.localDb.update('isImpersonateSession', this._isImpersonateSession);
    this._impersonateSubject.next(true)
  }

  endImpersonateSession() {

    if (!this._lastSession) {
      this._lastSession = this.localDb.get('lastSession')
    }

    this._setSession(new Session(this._lastSession));
    this._setUser(new User(this._lastSession.user));
    this._setRole(new Role(this._lastSession.role));

    this._lastSession = null
    this.localDb.update('lastSession', null);

    this._isImpersonateSession = false
    this.localDb.update('isImpersonateSession', this._isImpersonateSession);
    this._impersonateSubject.next(false)
  }

  newRole(profile: Profile, type: 'individual' | 'employee', organization?: Organization, typeCode?: string): Observable<Role> {
    const role = new Role();
    role.organization = this.currentOrganization() || organization;
    role.type = new RoleType({ code: typeCode });

    switch (type) {
      case 'individual':
        role.profile = profile;
        break;

      case 'employee':
        role.employee = new Employee();
        role.employee.profile = profile;
        role.user = new User({
          profile: {
            firstName: organization.meta.contactPerson
          },
          email: organization.email
        });
        break;

    }

    return this._rolesApi.create(role).pipe(map((newRole) => {
      const user = this.currentUser();
      user.roles.push(newRole);
      this._setUser(user);
      // this._setRole(newRole);
      return newRole;
    }));
  }

  joinAsEmployee(employee: Employee, organization?: Organization): Observable<Role> {
    const role = new Role();
    role.organization = this.currentOrganization() || organization;
    role.employee = employee;

    return this._rolesApi.create(role).pipe(map((newRole) => {
      this.currentUser().roles.push(newRole);
      return newRole;
    }));
  }

  createSession(): Observable<Session> {
    const session = new Session();
    session.app = 'browser';
    return this._sessionsApi.create(session);
  }

  getSession(id: string): Observable<Session> {
    return this._sessionsApi.get(id).pipe(map((data: Session) => {
      if (data.user) {
        this._setSession(new Session(data));
        this._setUser(new User(data.user));
        this._setRole(new Role(data.role));
      }
      return data;
    }));
  }

  activateSession(id: string, otp?: string, token?: string): Observable<Session> {
    const model = {
      otp,
      token,
      status: 'active'
    };
    return this._sessionsApi.update(id, model).pipe(map((data: Session) => {
      return data;
    }));
  }

  logout(): Observable<string> {

    const isAgent = !this.hasPermission(['customer.normal']);

    const subject = new Subject<string>();
    const session = this.currentSession();
    const role = this.currentRole();
    if (!session || !session.id) { return; }

    session.token = '';
    role.key = '';

    this.localDb.update('session', session);
    this.localDb.update('role', role);

    const removeAll = () => {
      const tenant = this.localDb.get('tenant');
      // const organization = this.localDb.get('organization');

      this.localDb.clear();
      // Preserve this
      this.localDb.update('tenant', tenant);
      // this.localDb.update('organization', organization);

      this.router.navigate(['/landing/login']);

      this._role = null;
      this._user = null;
      this._session = null;

      this._roleSubject.next(null);
      this._userSubject.next(null);
      this._sessionSubject.next(null);
    };

    this._authApi.post({}, `signOut/${session.id}`).subscribe((data) => {
      removeAll();
      subject.next(data);
    }, (err) => {
      if (err && err.message === 'DISAEXP') {
        removeAll();
      }
      subject.error(err);
    });

    return subject.asObservable();
  }

  setRedirectUrl(url: string) {
    this._redirectUrl = url;
  }

  getRedirectUrl(url?: string) {
    if (!url) {
      url = this._redirectUrl;
    }

    let session = this.currentSession();
    if (url.startsWith('http') && session) {
      if (url.indexOf('?') === -1) {
        url = `${url}?access-token=${session.token}`;
      } else {
        url = `${url}&access-token=${session.token}`;
      }
    }
    return decodeURI(url);
  }

  hasPermission(permissions: string | string[]): boolean {
    if (!permissions || Array.isArray(permissions) && !permissions.length) {
      return true; // every role has blank permission
    }

    const currentRole = this.currentRole();
    if (!currentRole) { return false; }

    if (!currentRole.permissions.length) { return false; }

    if (typeof permissions === 'string') {
      return this._hasPermission(permissions, currentRole.permissions);
    }

    for (const permission of permissions) {
      if (this._hasPermission(permission, currentRole.permissions)) {
        return true;
      }
    }
    return false;
  }

  private _hasPermission(permission, permissions): boolean {
    if (!permission) { return true; }
    let authorized = false;
    for (let item of permission.split('&&').map((p) => p.trim())) {

      const shouldNotHave = item.startsWith('!');
      if (shouldNotHave) {
        item = item.replace('!', '') as any;
      }

      const value = permissions.find((i) => item.toLowerCase() === i.toLowerCase());

      if (value) {
        if (shouldNotHave) {
          return false;
        } else {
          authorized = true;
        }
      } else {
        if (shouldNotHave) {
          authorized = true;
        }
      }
    }

    return authorized;
  }

  isCurrent(user: IUser) {
    if (!user || !this._role) {
      return false;
    }

    if (user.role && user.role.id && user.role.id === this._role.id) {
      return true;
    }

    if (user.code === this._role.code) {
      return true;
    }

    return false;
  }
}
