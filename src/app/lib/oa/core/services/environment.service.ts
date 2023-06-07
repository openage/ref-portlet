import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Organization, Service, Tenant } from '../../directory/models';
import { Link } from '../structures';
import { RoleService } from './role.service';
import { Application } from '../models/application.model';
import { UxService } from 'src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor(
    private http: HttpClient,
    private auth: RoleService,
    private uxService: UxService
  ) {
  }

  public init = async () => {

    let application = this.auth.currentApplication();

    if (application && application.timeStamp &&
      moment(application.timeStamp).add(environment.session.cache.duration, 'm').isAfter(new Date())) {
      return application;
    }

    let host = window.location.host;

    if (host.includes('netlify.app')) {
      host = host.split('.')[0].replace('-', '.');
    }

    if (host === environment.debug.host) { // Hack to handle multiple hosts
      host = environment.host;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.has('host')) {
      host = params.get('host');
    }

    // check if code can be extracted from the url
    // if (!code && host && environment.host.startsWith('*')) {
    //   if (host.startsWith('console')) {
    //     host = `app.${host.substring(8)}`;
    //   } else {
    //     code = host.substring(0, host.length - (environment.host.length - 1))
    //   }

    //   if (code === '*') {
    //     code = environment.code;
    //   }
    // }

    const applicationUrl = environment.ref.replace('{{host}}', host);
    let applicationData = await this.getData(applicationUrl);

    applicationData = this.overrides(applicationData);
    applicationData.code = applicationData.code || environment.code;
    applicationData.name = applicationData.name || environment.name;
    applicationData.env = applicationData.env || environment.env;
    applicationData.timeStamp = applicationData.timeStamp || new Date();
    applicationData.navs = await this.polulatedNav(applicationData.navs);
    application = new Application(applicationData);
    this.auth.setApplication(application);

    let tenantUrl = `${this.auth.getService('directory').url}/tenants/${application.tenant.code}`;
    let tenantData = await this.getData(tenantUrl);
    let tenant = new Tenant(tenantData);
    this.auth.setTenant(tenant);

    if (application.organization) {
      let organizationUrl = `${this.auth.getService('directory').url}/organizations/${application.organization.code}`;
      let organizationData = await this.getData(organizationUrl);
      let organization = new Organization(organizationData);
      this.auth.setOrganization(organization);
    }

    this.uxService.init();
  }

  private getData = async (url) => {
    this.auth.currentTenant();

    let headers: any = {
      'Content-Type': 'application/json'
    }

    for (const item of this.auth.getHeaders()) {
      headers[item.key] = item.value;
    }

    let dataModel = await firstValueFrom(this.http.get<any>(url, {
      headers: new HttpHeaders(headers)
    }));

    if (dataModel.isSuccess === undefined) {
      dataModel = {
        isSuccess: true,
        data: dataModel
      }
    }

    const isSuccess = dataModel.isSuccess !== undefined ? dataModel.isSuccess : (dataModel as any).IsSuccess;
    if (!isSuccess) {
      const errorCode = dataModel.error || dataModel.code || dataModel.message || 'failed';
      throw new Error(errorCode === 'RESOURCE_NOT_FOUND' ? 'Application does not exist' : errorCode);
    }

    return dataModel.data;
  }

  private overrides(data: Application): Application {
    if (environment.navs && environment.navs.length) {
      const navs = [];
      const appNavs = (data.navs || []).map((n) => typeof n === 'string' ? new Link({ code: n }) : new Link(n));
      const envNavs = environment.navs.map((n) => typeof n === 'string' ? new Link({ code: n }) : new Link(n));
      // overrides
      appNavs.forEach(n => {
        let overrideNav = envNavs.find(i => i.code && n.code && i.code.toLowerCase() === n.code.toLowerCase());
        navs.push(overrideNav || n);
      });

      // additionals
      navs.push(...envNavs.filter(o => !appNavs.find(n => n.code && n.code === o.code)))

      data.navs = navs;
    }

    if (environment.services && environment.services.length) {
      const services = environment.services.map((s) => new Service(s));

      if (data.services && data.services.length) {

        data.services.forEach((service) => {
          if (!services.find((s) => s.code === service.code)) {
            services.push(service);
          }
        });
      }

      data.services = services;
    }

    data.theme = data.theme || environment.theme;
    data.meta = data.meta || {};

    return data;
  }

  private polulatedNav = async (navs: Link[]) => {

    const items = [];
    for (const nav of navs) {
      items.push(await this.getNav(nav));
    }
    return items;
  }

  private getNav = async (link: any) => {
    const src = typeof link === 'string' ? link : (link.src || link.code);
    let l = link;
    if (src.startsWith('http') || src.startsWith('/')) {
      l = await this.http.get(src).toPromise();
    }

    const meta = l.meta || l.layout;

    if (meta && typeof meta === 'string' && (meta.startsWith('http') || meta.startsWith('/'))) {
      l.meta = await this.http.get(meta).toPromise();
    }

    if (l.items && l.items.length) {
      l.items = await this.polulatedNav(l.items);
    }
    return new Link(l);
  }
}
