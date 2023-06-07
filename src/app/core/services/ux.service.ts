import { ComponentType } from '@angular/cdk/portal';
import { ErrorHandler, EventEmitter, Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';
import { Application, ErrorModel, Pic, Slide, Theme } from 'src/app/lib/oa/core/models';
import { IContextMenuHandler } from 'src/app/lib/oa/core/services/context-menu-handler.interface';
import { IEntityHandler } from 'src/app/lib/oa/core/services/entity-handler.interface';
import { Action, Link, Menu } from 'src/app/lib/oa/core/structures';
import { Organization, Role, Tenant } from 'src/app/lib/oa/directory/models';
import { CodeDialogComponent } from 'src/app/lib/oa-ng/shared/dialogs/code-dialog/code-dialog.component';
import { Entity } from 'src/app/lib/oa/core/models/entity.model';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { NavService } from './nav.service';
import { ConfirmDialogComponent } from 'src/app/lib/oa-ng/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { SearchOptions } from 'src/app/lib/oa-ng/shared/models/search-options.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UxService implements ErrorHandler,
  IContextMenuHandler,
  IEntityHandler {

  private _errors = new Subject<string>();
  private _warnings = new Subject<string[]>();
  private _progressItem = new Subject<any>();
  private _entitySubject = new Subject<Entity>();
  private _navBar = new Subject<Link>();
  private _contextMenu = new Subject<any[]>();
  private _deviceSubject = new Subject<string>();
  private _searchSubject = new Subject<SearchOptions[]>();

  private _sideNavShowSubject = new Subject<boolean>();
  private _isBlockedSubject = new Subject<boolean>();
  private _logoSubject = new Subject<Pic>();
  private _themeSubject = new Subject<Theme>();
  private _isShowSearchBarSubject = new BehaviorSubject<boolean>(false);

  private _device = 'desktop';
  private _theme: Theme;
  private _entity: Entity;

  private _currentTenant: Tenant;
  private _currentApplication: Application;
  private _currentOrganization: Organization;
  private _currentRole: Role;
  private _logo: Pic;

  private _sideNavShow = false;
  private _isBlocked = false;

  navBarChanges = this._navBar.asObservable();
  contextMenuChanges = this._contextMenu.asObservable();
  errors = this._errors.asObservable();
  warnings = this._warnings.asObservable();
  progressItem = this._progressItem.asObservable();

  entityChanges = this._entitySubject.asObservable();
  deviceChanges = this._deviceSubject.asObservable();

  sideNavShowChanges = this._sideNavShowSubject.asObservable();
  isBlockedChanges = this._isBlockedSubject.asObservable();
  isShowSearchBar = this._isShowSearchBarSubject.asObservable();

  logoChanges = this._logoSubject.asObservable();
  themeChanges = this._themeSubject.asObservable();
  searchChanges = this._searchSubject.asObservable();

  onSearch: EventEmitter<object> = new EventEmitter<object>();
  onTabSelect: EventEmitter<object> = new EventEmitter<object>();

  constructor(
    private roleService: RoleService,
    private navService: NavService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  public init = async () => {
    this._currentRole = this.roleService.currentRole();
    this._currentTenant = this.roleService.currentTenant();
    this._currentApplication = this.roleService.currentApplication();
    this._currentOrganization = this.roleService.currentOrganization();
    this.setTheme();
    this.setLogo();
    this.setNav();

    this.roleService.tenantChanges.subscribe((t) => {
      this._currentTenant = t;
      this.setTheme();
      this.setLogo();
      this.setNav();
    });

    this.roleService.applicationChanges.subscribe((t) => {
      this._currentApplication = t;
      this.setTheme();
      this.setLogo();
      this.setNav();
    });


    this.roleService.organizationChanges.subscribe((t) => {
      this._currentOrganization = t;
      this.setTheme();
      this.setLogo();
      this.setNav();
    });
    this.roleService.roleChanges.subscribe((r) => {
      this._currentRole = r;
      this.setTheme();
      this.setLogo();
      this.setNav();
    });

    this.navService.navChanges.subscribe((n) => {
      this.resetContextMenu();
    });
  }

  private setNav() {
    let navs = this._currentApplication.navs;

    // if (this._currentOrganization && this._currentOrganization.navs && this._currentOrganization.navs.length) {
    //   navs = this._currentOrganization.navs.map((n) => new Link(n));
    // } else if (this._currentTenant && this._currentTenant.navs && this._currentTenant.navs.length) {
    //   navs = this._currentTenant.navs.map((n) => new Link(n));
    // } else {
    //   navs = environment.navs.map((n) => new Link(n));
    // }

    if (!this._currentRole) {
      navs = navs.find(l => l.code === 'auth').items;
    }

    this.navService.setNav(navs);
  }

  private setLogo() {
    if (this._currentRole && this._currentRole.organization && this._currentRole.organization.logo) {
      this._logo = this._currentRole.organization.logo;
    } else if (this._currentTenant && this._currentTenant.logo) {
      this._logo = this._currentTenant.logo;
    } else {
      this._logo = new Pic({
        url: '/asset/images/logo.png'
      });
    }

    this._logoSubject.next(this._logo);
  }

  getLogo(): Pic {
    return this._logo;
  }

  private setTheme() {
    this._theme = this._currentApplication.theme;
    // if (this._currentRole && this._currentRole.organization && this._currentRole.organization.theme) {
    //   this._theme = this._currentRole.organization.theme;
    // } else if (this._currentTenant && this._currentTenant.theme) {
    //   this._theme = this._currentTenant.theme;
    // } else {
    //   this._theme = new Theme(environment.theme);
    // }


    if (this._theme?.style) {
      this.addStyle('theme', this._theme.style);
    }

    if (this._theme?.icon) {
      this.addStyle('icon', this._theme.icon);
    }

    let styleCount = 0

    for (const style of this._currentApplication.styles) {
      this.addStyle(`style-${styleCount++}`, style);
    }

    this._themeSubject.next(this._theme);
  }

  getTheme(): Theme {
    return this._theme;
  }

  // getNavs(): Link[] {
  //   return this.navService.getNavs();
  // }

  public getIcon(type) {
    switch (type) {
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'file-doc';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel':
        return 'file-excel';
      case 'application/pdf':
        return 'file-pdf';
      case 'image/jpeg':
      case 'image/png':
      case 'image/svg':
      case 'image/jpg':
        return 'file-img';
      case 'text/html':
      case 'html':
      case 'text':
        return 'file-html';
      case 'json':
      case 'text/json':
      case 'application/json':
        return 'file-json';

      case 'link':
        return 'file-link';

      default:
        return 'file-upload';
    }
  }

  handleError(error: any): void {
    let message = error.message || error.code || error;

    const errorKey = error.code || error.message || error;
    const userError = environment.errors.find((e) => e.key === errorKey);
    if (userError) {
      message = userError.message;
    }

    if (message && this) { // TODO: temp hack as this not behaving consistently here
      if (this._errors) this._errors.next(message);
      if (this.snackBar) {
        this.snackBar.open(message, 'Error', {
          duration: 6000,
        });
      }
    }
  }

  handleItemProgress(item: any) {
    const url = this.roleService.currentApplication().services.find(s => s.code === item.api.code).url
    item.url = `${url}/${item.api.service}/${item.id}`
    item.code = item.id

    return this._progressItem.next(item);
  }

  showInfo(message: string, title?: string): void {
    this.snackBar.open(message, title || 'Info', {
      duration: 3000,
    });
  }

  showError(errors: Error | ErrorModel | string | string[] | ErrorModel[], options?: {
    title?: string,
    message?: string,
    retryTitle?: string,
    cancelTitle?: string,
    show?: {
      retry?: boolean
    },
    view?: string
  }) {

    options = options || {};
    options.view = options.view || 'dialog';

    if (options && options.view === 'banner') {
      this._warnings.next(errors as string[]);
      return;
    }

    const subject = new Subject<boolean>();
    const dialog = this.dialog.open(ConfirmDialogComponent, { width: '350px' });
    const instance = dialog.componentInstance;

    options.show = options.show || {};
    instance.title = options.title || 'Errors';
    instance.message = options.message || '';
    instance.errors = errors;
    instance.confirmTitle = options.retryTitle || 'Retry';
    instance.cancelTitle = options.cancelTitle || 'Cancel';

    instance.options = {
      hide: {
        confirm: !options.show.retry,
        cancel: false
      }
    };

    dialog.afterClosed().subscribe((r) => {
      if (r) {
        subject.next(true);
      } else {
        subject.next(false);
      }
    });

    return subject.asObservable();
  }

  showSuccess(
    title?: string,
    message?: string,
    options?: {
      confirmTitle?: string,
      cancelTitle?: string,
      hide?: {
        confirm?: boolean,
        cancel?: boolean
      },
      timer?: number,
      actions?: Action[]
    }
  ) {
    const subject = new Subject<boolean>();
    const dialog = this.dialog.open(ConfirmDialogComponent, { width: '350px' });
    const instance = dialog.componentInstance;

    options = options || {
      hide: {
        confirm: false,
        cancel: false,
      }
    };

    instance.title = title || instance.title || 'Success';
    instance.message = message || instance.message || '';
    instance.confirmTitle = options.confirmTitle || instance.confirmTitle || 'OK';
    instance.cancelTitle = options.cancelTitle || instance.cancelTitle;

    instance.options = options;

    dialog.afterClosed().subscribe((r) => {
      if (r !== undefined) {
        subject.next(r);
      }
    });

    return subject.asObservable();
  }

  block(status?: boolean): boolean {
    this._isBlocked = !!status;
    this._isBlockedSubject.next(this._isBlocked);
    return this._isBlocked;
  }

  isBlocked() {
    return this._isBlocked;
  }

  extractSlides(content: string): Slide[] {
    const slides: Slide[] = [];
    const sections = (content && content !== '<div>---</div>')
      ? content.split('<div>---</div>') : [''];

    const storySections = [];
    sections.forEach((i) => {
      i.split('---').forEach((subItem) => storySections.push(subItem));
    });
    let index = 0;
    storySections.forEach((section) => {
      const attachments = this.extractUrls(section);
      const slide = new Slide({
        id: index,
        description: section
      });

      index++;

      slides.push(slide);
      if (attachments && attachments.length) {
        attachments.forEach((attachment) => {
          let url = attachment.url;
          url = url.replace('</span>', '');
          url = url.replace('<span>', '');
          url = url.replace('/blob/', '/raw/');
          if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.gif')) {
            slide.imageUrl = url;
          }
        });
      }
    });

    return slides;
  }

  extractUrls = (text: string): Pic[] => {
    const attachments: Pic[] = [];

    if (!text) {
      return attachments;
    }
    const urls = text.match(/\b(https?:\/\/\S+(?:png|jpe?g|gif)\s*)\b/g);
    if (!urls) {
      return attachments;
    }
    urls.forEach((url) => {
      const attachment = new Pic();
      attachment.url = url;
      attachment.thumbnail = url;
      if (url.endsWith('.jpg') || url.endsWith('.jpeg')) {
        attachment.type = 'image/jpg';
      } else if (url.endsWith('.png')) {
        attachment.type = 'image/png';
      } else if (url.endsWith('.gif')) {
        attachment.type = 'image/gif';
      }
      attachments.push(attachment);
    });

    return attachments;
  }

  getTextFromEvent($event: any, options?: { placeholder?: string }): string {
    options = options || {};
    if ($event.type && $event.type === 'keypress') {
      if ($event.key !== 'Enter') {
        return;
      } else {
        $event.preventDefault();
        $event.target.blur();
        return;
      }
    }

    let subject: string;

    if (typeof $event === 'string') {
      subject = $event
    } else {
      subject = $event.target.tagName === 'INPUT' ? $event.target.value : $event.target.innerText;
    }
    if (!subject) {
      return;
    }
    subject = subject.replace(/\r?\n/g, '').trim();

    if (subject === options.placeholder) {
      if ($event.target.tagName === 'INPUT') {
        $event.target.value = options.placeholder;
      } else {
        $event.target.innerText = options.placeholder;
      }
      return;
    }

    return subject;
  }

  setTextFromEvent($event: any, newPlaceholder: string) {
    if ($event.type && $event.type === 'keyup') {
      return;
    }
    if ($event.target.tagName === 'INPUT') {
      $event.target.value = newPlaceholder;
    } else {
      $event.target.innerText = newPlaceholder;
    }
  }

  setNavBar(nav: Link) {
    this._navBar.next(nav);
  }

  resetNavBar() {
    this._navBar.next(null);
  }

  setContextMenu(obj: Menu | any[]) {
    if (obj instanceof Menu) {
      this._contextMenu.next(obj.items);
    } else {
      const items: Action[] = [];
      obj.forEach((item) => {

        if (typeof item === 'string') {
          item = {
            code: item
          };
        }

        if (item.hasOwnProperty('helpCode')) {
          if (item.helpCode) {
            item.code = 'help';
            item.value = item.helpCode;
          } else {
            return;
          }
        }

        if (item.views) {
          item.code = 'view';
          item.options = item.views;
        }

        if (item.add) {
          item.code = 'add';
        }

        if (item.refresh) {
          item.code = 'refresh';
          item.event = item.refresh;
        }

        if (item.search) {
          item.code = 'search';
          item.options = item.search.params;
        }

        if (item.filters) {
          item.code = 'filters';
          item.event = item.filters;
        }

        items.push(new Action(item));
      });
      this._contextMenu.next(items);
    }
  }

  resetContextMenu() {
    this._contextMenu.next(null);
  }

  setEntity(entity: Entity | any) {
    if (!this._entity && !entity) {
      return;
    }

    if (this._entity && entity) {
      if (this._entity.id === entity.id && this._entity.type === entity.type) {
        return;
      }
    }

    this._entity = new Entity(entity);
    this._entitySubject.next(entity);
  }

  resetEntity() {
    this._entity = null;
    this._entitySubject.next(null);
  }

  currentEntity() {
    return this._entity;
  }
  reset() {
    this.navService.resetTitle();
    this.navService.resetBreadcrumb();
    this.resetContextMenu();
    this.resetEntity();
    this.resetSearchParams();
    this.showError([], { view: 'banner' });

  }

  showSideNav(show: boolean) {
    this._sideNavShow = show;
    this._sideNavShowSubject.next(this._sideNavShow);
  }

  getShowSideNav() {
    return this._sideNavShow;
  }

  getDevice() {
    return this._device;
  }

  setDevice(device: 'mobile' | 'desktop') {
    this._device = device;
    this._deviceSubject.next(this._device);
  }

  addStyle(id: string, style: string) {
    let element = document.getElementById(id) as any;
    const isLink = (style.startsWith('http') || style.startsWith('/'));
    if (!element) {
      if (isLink) {
        element = document.createElement('link');
        element.rel = 'stylesheet';
      } else {
        element = document.createElement('style');
      }
      element.id = id;
      document.head.appendChild(element);
    }

    if (isLink) {
      element.href = style;
    } else {
      element.appendChild(document.createTextNode(style));
    }
  }

  removeStyle(id) {
    const element = document.getElementById(id);
    if (element) { element.remove(); }
  }

  removeScript(id) {
    const element = document.getElementById(id);
    if (element) { element.remove(); }
  }

  addScript(id: string, script: string) {
    let element = document.getElementById(id) as any;
    const isLink = (script.startsWith('http') || script.startsWith('/'));
    if (!element) {
      if (isLink) {
        element = document.createElement('link');
        element.rel = 'stylesheet';
      } else {
        element = document.createElement('script');
      }
      element.id = id;
      document.head.appendChild(element);
    }
    if (isLink) {
      element.href = script;
    } else {
      element.text = script;
    }
  }

  openDialog<T>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, config?: MatDialogConfig<any>) {
    config = config || {};
    config.width = config.width || '550px';
    return this.dialog.open(componentOrTemplateRef, config);
  }

  askCode(matDialog: MatDialog, options?: {
    title?: string,
    hint?: string,
    type?: 'text' | 'otp'
  }) {
    const subject = new Subject<string>();

    const config: any = {};

    if (options.type === 'otp') {
      config.width = '350px';
    }

    const dialog = matDialog.open(CodeDialogComponent, config);
    const instance = dialog.componentInstance;

    options = options || {};
    instance.title = options.title || instance.title;
    instance.hint = options.hint || instance.hint;
    instance.type = options.type || instance.type;
    instance.uxService = this;

    dialog.afterClosed().subscribe((code) => {
      if (!code) {
        return;
      }
      subject.next(code);
    });

    return subject.asObservable();
  }

  onConfirm(options?: {
    title?: string,
    message?: string,
    confirmTitle?: string,
    cancelTitle?: string
  }) {
    const subject = new Subject<boolean>();
    const dialog = this.dialog.open(ConfirmDialogComponent, { width: '350px' });
    const instance = dialog.componentInstance;

    options = options || {};
    instance.title = options.title || instance.title;
    instance.message = options.message || instance.message;
    instance.confirmTitle = options.confirmTitle || instance.confirmTitle;
    instance.cancelTitle = options.cancelTitle || instance.cancelTitle;

    dialog.afterClosed().subscribe((r) => {
      if (r) {
        subject.next(true);
      } else {
        subject.next(false);
      }
    });

    return subject.asObservable();
  }

  notAvaliable(message?: string) {
    const subject = new Subject<boolean>();
    const dialog = this.dialog.open(ConfirmDialogComponent, { width: '350px' });
    const instance = dialog.componentInstance;

    instance.title = 'Not Avalilable';
    instance.message = message || 'Feature is not available';
    instance.confirmTitle = 'Ok';
    instance.options = {
      hide: {
        cancel: true
      }
    };

    dialog.afterClosed().subscribe((r) => {
      subject.next(true);
    });

    return subject.asObservable();
  }

  showSearch(flag: boolean) {
    this._isShowSearchBarSubject.next(flag);
  }

  setSearchParams(params: SearchOptions[]) {
    this._searchSubject.next(params);
    // this._isShowSearchBarSubject.next(true);
  }

  resetSearchParams() {
    this._searchSubject.next(null);
    // this._isShowSearchBarSubject.next(false);
  }
}
