import { Location } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { Subject, findIndex } from 'rxjs';
import { IBreadcrumbHandler } from 'src/app/lib/oa/core/services/breadcrumb-handler.interface';
import { LocalStorageService } from 'src/app/lib/oa/core/services/local-storage.service';
import { ITitleHandler } from 'src/app/lib/oa/core/services/title-handler.interface';
import { Link } from 'src/app/lib/oa/core/structures';
import { environment } from 'src/environments/environment';
import { Entity } from 'src/app/lib/oa/core/models/entity.model';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { MetaService } from './meta.service';

@Injectable({
  providedIn: 'root'
})
export class NavService implements
  ITitleHandler,
  IBreadcrumbHandler {

  private _nav = new Subject<{
    page: Link,
    is: (path: string) => boolean,
    get: (key: string, route: ActivatedRoute) => string
  }>();
  private _title = new Subject<string>();
  private _navsSubject = new Subject<Link[]>();
  private _breadcrumb = new Subject<Link[]>();
  private _currentPageSubject = new Subject<Link>();

  private _navs: Link[];
  private _currentPage: Link;
  private _breadcrumbLinks: Link[] = [];
  private _breadcrumbCodes: {
    code: string,
    path: string,
    params: any,
    item: Link,
    parent: Link
  }[] = [];
  private _entityHandler: any = {};

  titleChanges = this._title.asObservable();
  navChanges = this._nav.asObservable();
  navsChanges = this._navsSubject.asObservable();
  breadcrumbChanges = this._breadcrumb.asObservable();
  currentPageChanges = this._currentPageSubject.asObservable();

  currentUrl: string;

  constructor(
    private router: Router,
    private location: Location,
    private auth: RoleService,
    private metaService: MetaService,
    private storageService: LocalStorageService,
    private httpClient: HttpClient
  ) {
    // this.router.events.subscribe((event): void => {
    //   if (event instanceof NavigationEnd) {
    //     const url = (event as NavigationEnd).url.toLowerCase();

    //     if (this.currentUrl && this.currentUrl === url) {
    //       return;
    //     }

    //     const nav = this._breadcrumbCodes.find((i) => this.isCurrent(i.path));

    //     const link = nav ? nav.item : null;

    //     if (link) {
    //       this.setPage(link);
    //     }

    //     if ((link && this._currentPage && this._currentPage.code !== link.code) ||
    //       (!this._currentPage && link) ||
    //       (this._currentPage && !link)) {
    //       this._currentPage = link;
    //       this._nav.next(this.getNav(this._currentPage, this.router));
    //     }
    //   }
    // });
  }

  public getEntityHandler(type) {
    return this._entityHandler[type];
  }

  private createBreadcrumbs(links: any[], parent?: Link): Link[] {
    if (!links || !links.length) {
      return [];
    }

    for (const linkItem of links) {

      if (parent) {
        linkItem.parent = parent;
      }

      if (linkItem.items && linkItem.items.length) {
        this.createBreadcrumbs(linkItem.items, linkItem);
      }

      const item = new Link(linkItem);

      if (item.handles && item.handles.length) {
        item.handles.forEach((handle) => {
          this._entityHandler[handle.toLowerCase()] = item;
        });
      }

      this._breadcrumbCodes.push({
        code: linkItem.code,
        path: this.extractPath(item.url),
        params: this.extractParams(item.url),
        item,
        parent
      });
    }

    this._breadcrumbCodes = this._breadcrumbCodes.sort((a, b) => {
      return (a.path === b.path && a.params.length > b.params.length) ? -1 : 1
    });
  }

  private extractPath(url) {
    if (!url) {
      return '';
    }

    return url.split('#')[0].split('?')[0]
  }

  private extractParams(url) {
    let params = {};

    if (!url) {
      return params;
    }

    if (url.indexOf('#') !== -1) {
      let fragment = url.substring(url.indexOf('#') + 1);

      if (fragment.indexOf('?') === -1) {
        fragment = fragment.split('?')[0];
      }

      if (fragment) {
        params['fragment'] = fragment;
      }
    }

    let query = ''

    if (url.indexOf('?') !== -1) {
      query = url.substring(url.indexOf('?') + 1);
    }

    if (query && query.indexOf('#') !== -1) {
      query = query.split('#')[0];
    }

    if (query) {
      query.split('&').forEach(i => {
        let parts = i.split('=');
        params[parts[0]] = parts[1];
      });
    }

    return params;
  }

  private getNav(page: Link, router: Router) {
    return {
      page,
      is: (key: string, params?: any) => {

        if (key.startsWith('/')) {
          return this.isCurrent(key);
        }

        const item = this._breadcrumbCodes.find((n) => n.code.toLowerCase() === key.toLowerCase());

        if (!item) {
          return false;
        }
        params = params || {};
        const path = item.item.path.split('/').map((p) => {
          if (p.startsWith(':')) {
            return params[p.substring(1)];
          }
        }).join('/');

        return this.isCurrent(path);
      },
      get: (key: string, route: ActivatedRoute) => {
        const snapshot = route.snapshot;

        if (snapshot.paramMap.has(key)) {
          return snapshot.paramMap.get(key);
        }

        if (snapshot.queryParamMap.has(key)) {
          return snapshot.queryParamMap.get(key);
        }

        return null;
      }
    };
  }

  private hasAccess(link: Link) {
    if (this.auth.hasPermission(link.permissions)) {
      return true;
    }

    if (link.items) {
      for (const item of link.items) {
        if (this.auth.hasPermission(item.permissions)) {
          return true;
        }
      }
    }
    return false;
  }

  public setNav(navs: Link[]) {
    this._navs = navs.filter((n) => this.hasAccess(n));
    // this.createEntityHandlers(this._navs);
    this.createBreadcrumbs(this._navs);
    this._navsSubject.next(this._navs);

    this.router.events.subscribe((i) => {
      if (i instanceof NavigationEnd) {
        let url = (i as NavigationEnd).url.toLowerCase();

        if (this.currentUrl && this.currentUrl === url) {
          return;
        }
        this.currentUrl = url;

        let actualPath = this.extractPath(url);
        let actualParams = this.extractParams(url);
        // if (url.indexOf('?') !== -1) {
        //   url = url.split('?')[0];
        // }

        const actualPathParts = actualPath.split('/');

        const nav = this._breadcrumbCodes.find((l) => {

          if (!l.path)
            return false;

          // const linkPath = this.toUrl(l.path, route);
          const linkPathParts = l.path.split('/');

          if (actualPathParts.length !== linkPathParts.length) {
            return false;
          }

          for (let index = 0; index < linkPathParts.length; index++) {
            const linkValue = linkPathParts[index];
            const actualValue = actualPathParts[index];
            if (!linkValue.startsWith(':') && linkValue !== actualValue) {
              return false;
            }
          }

          if (actualPathParts.length !== linkPathParts.length) {
            return false;
          }

          if (l.params) {
            for (const key in l.params) {
              if (Object.prototype.hasOwnProperty.call(l.params, key)) {
                const actualValue = actualParams[key];
                if (!actualValue) {
                  return false;
                }
                const linkValue = l.params[key];
                if (!linkValue.startsWith(':') && linkValue !== actualValue) {
                  return false;
                }

              }
            }
          }

          return true;
        });
        // const nav = this._breadcrumbCodes.find((b) => (b.path || '').toLowerCase() === url);
        let item = nav?.item?.code ? nav.item : null;
        this._nav.next(this.getNav(item, this.router));
      }
    });
  }

  getNavs(): Link[] {
    return this._navs;
  }

  async setPage(code: string | Link) {
    if (!code) {
      return;
    }
    const obj: Link[] = [];

    const linkCode = typeof code === 'string' ? code : code.code;

    const link = this._breadcrumbCodes.find((l) => l.code && linkCode.toLowerCase() === l.code.toLowerCase());

    if (!link) {
      return;
    }

    const createLink = (item: { code: string, item: Link, parent: Link }) => {
      if (item.parent) {
        const parent = this._breadcrumbCodes.find((l) =>
          l.code && item.parent.code &&
          item.parent.code.toLowerCase() === l.code.toLowerCase());
        createLink(parent);
      }
      obj.push(item.item);
    };

    createLink(link);
    await this.setPageMeta(link.item);
    this.setBreadcrumb(obj);
    this.setTitle(link.item.title);
    this.metaService.setMetaTag({ property: 'og:url', content: window.location.href });

    this._currentPageSubject.next(link.item);
    this.storageService.saveLink(link.item);

    return link;
  }

  async setPageMeta(link) {
    if (!link.meta || !link.meta.ref) { return }

    let url = link.meta.ref

    if (!(url.startsWith('http') || url.startsWith('/'))) {
      let parts = url.split(':')
      url = `${this.getUrl(parts[0])}${parts[1]}`
      // this.saveTenantNavs(link.code, link.meta)
    }

    const res: any = await this.httpClient.get(url).toPromise();

    let content = res.data ? res.data.content : res;

    if (typeof content === 'string') {
      content = JSON.parse(content);
    }

    link.meta = content;
  }

  getUrl(code) {
    let services = []
    let url

    const application = this.auth.currentApplication();
    if (application && application.services && application.services.length) {
      services = application.services
    } else {
      services = environment.services
    }

    const service = services.find((s) => s.code === code);
    if (service) {
      url = service.url;
    }

    return url;
  }

  private saveNavs(code, meta) {
    let application = this.auth.currentApplication()

    function saveNav(items, code, count) {
      let c = code.split('.')
      let currentCode = c[count]
      let nav = items.find(item => item.code.includes(currentCode));

      if (nav && nav.code === code) {
        nav.meta = meta
        return
      } else if (nav && nav.items.length) {
        count++
        saveNav(nav.items, code, count)
      } else {
        return
      }
    }

    saveNav(application.navs, code, 0)
    // this.auth.setTenant(tenant)
  }

  private getParam(key, route: ActivatedRoute) {

    const _getValue = (snapshot) => {
      if (snapshot.paramMap.has(key)) {
        return snapshot.paramMap.get(key);
      }

      if (snapshot.queryParamMap.has(key)) {
        return snapshot.queryParamMap.get(key);
      }

      if (snapshot.parent) {
        return _getValue(snapshot.parent);
      }

      return;
    };

    return _getValue(route.snapshot);
  }

  private toUrl(path: string, route: ActivatedRoute) {
    const url = path.split('/').map((p) => {
      if (p.startsWith(':')) {
        const key = p.substring(1);
        const value = this.getParam(key, route);
        if (value) {
          p = value;
        }
      }
      return p;
    }).join('/');
    return url;
  }

  public getLink(path: string, route: ActivatedRoute): Link {
    if (!path) {
      return;
    }
    const actualPath = this.toUrl(path, route);

    const queryMap = route.snapshot.queryParamMap;
    const fragment = route.snapshot.fragment;
    const actualPathParts = actualPath.split('/');

    const item = this._breadcrumbCodes.find((l) => {

      if (!l.path)
        return false;

      // const linkPath = this.toUrl(l.path, route);
      const linkPathParts = l.path.split('/');

      if (actualPathParts.length !== linkPathParts.length) {
        return false;
      }

      for (let index = 0; index < linkPathParts.length; index++) {
        const linkValue = linkPathParts[index];
        const actualValue = actualPathParts[index];
        if (!linkValue.startsWith(':') && linkValue !== actualValue) {
          return false;
        }
      }

      if (actualPathParts.length !== linkPathParts.length) {
        return false;
      }

      if (l.params) {
        for (const key in l.params) {
          if (Object.prototype.hasOwnProperty.call(l.params, key)) {
            const linkValue = l.params[key];
            const actualValue = key === 'fragment' ? fragment : queryMap.get(key);
            if (!actualValue) {
              return false;
            }

            if (!linkValue.startsWith(':') && linkValue !== actualValue) {
              return false;
            }

          }
        }
      }

      return true;
    });

    if (item && item.item) {
      item.item.path = actualPath;
      item.item.routerLink = [actualPath];
      return item.item;
    }

    const parts = path.split('/');

    const parentParts = [];

    for (let index = 0; index < parts.length - 1; index++) {
      parentParts.push(parts[index]);
    }

    return this.getLink(parentParts.join('/'), route);
  }

  async register(path: string, route: ActivatedRoute, change: (isCurrent: boolean, params: { get: (key) => string }, page: Link) => void): Promise<Link> {
    if (!path) {
      return;
    }

    const getParam = (key) => {
      const snapshot = route.snapshot;
      const _getValue = (snapshot) => {
        if (key === 'section') {
          return snapshot.fragment;
        }

        if (snapshot.paramMap.has(key)) {
          return snapshot.paramMap.get(key);
        }

        if (snapshot.queryParamMap.has(key)) {
          return snapshot.queryParamMap.get(key);
        }

        if (snapshot.parent) {
          return _getValue(snapshot.parent);
        }

        return null;
      };

      return _getValue(snapshot);
    }

    let item = this.getLink(path, route);

    if (item) {
      // TODO: disabled for demo
      if (item.permissions && item.permissions.length && !this.auth.hasPermission(item.permissions)) {
        this.router.navigate([`/home/errors/access-denied`], { queryParams: { path } });
        return;
      }

      await this.setPage(item);

      const subscription = this.navChanges.subscribe((n) => {
        let page = n.page;
        if (page.code === item.code) {
          change(this.isCurrent(this.toUrl(path, route)), { get: getParam }, null);
        } else {
          item = n.page;
          this.setPage(item).then(() => {
            change(this.isCurrent(this.toUrl(path, route)), { get: getParam }, item);
          })
        }
      });
      setTimeout(() => change(this.isCurrent(this.toUrl(path, route)), { get: getParam }, item));

      item.subscription = subscription;
      return item;
    }

    this.router.navigate([`/home/dashboard/default`], { queryParams: { path } });
  }

  isCurrent(url: string): boolean {
    let link = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
    let currentUrl = decodeURIComponent(this.router.url.split('?')[0].split('#')[0]).toLowerCase();
    return link.toLowerCase() === currentUrl.toLowerCase();
  }

  get(key: string): Link {
    const nav = key.startsWith('/')
      ? this._breadcrumbCodes.find((l) => l.path && key.toLowerCase() === l.path.toLowerCase())
      : this._breadcrumbCodes.find((l) => l.code && key.toLowerCase() === l.code.toLowerCase());

    return nav ? nav.item : null;
  }

  // get(key: string, onMatch?: () => void) {
  //   if (!key) {
  //     return;
  //   }

  //   if (key.startsWith('/')) {
  //     const navByPath = this._breadcrumbCodes.find((l) => l.path && key.toLowerCase() === l.path.toLowerCase());

  //     return {
  //       page: navByPath ? navByPath.item : null,
  //       is: (path: string) => this.router.isActive(path, true),
  //       get: this.getParam,
  //       change: this.navChanges
  //     };
  //   }

  //   const navByCode = this._breadcrumbCodes.find((l) => l.code && key.toLowerCase() === l.code.toLowerCase());

  //   return {
  //     page: navByCode ? navByCode.item : null,
  //     is: (path: string) => this.router.isActive(path, true),
  //     get: this.getParam,
  //     change: this.navChanges
  //   };

  // }

  // isCurrentPage(code: string | Link): boolean {

  //   if (this._currentPage) {
  //     if (typeof code === 'string') {
  //       return this._currentPage.code === code;
  //     } else {
  //       return this._currentPage.code === code.code;
  //     }
  //   }
  //   const item = typeof code === 'string' ? this.get(code) : code;

  //   return this.router.isActive(item.path, true);

  //   // let url = this.router.url;

  //   // if (url.indexOf('?') !== -1) {
  //   //   url = url.split('?')[0];
  //   // }

  //   // return item.path === url;
  // }

  goto(key: string | Link | string[] | any, params?: any, options?: any) {
    if (!key) {
      return;
    }

    params = params || {};
    // const extras: any = {
    // };

    const pathParams = params.path || {};
    const queryParams = params.query;
    const fragment = params.fragment;

    const newTab = options?.newTab || key.options?.newTab;


    // if (params.query) {
    //   extras.queryParams = params.query
    // }

    // if (params.fragment) {
    //   extras.fragment = params.fragment
    // }

    let nav: Link;
    if (typeof key === 'string') {
      if (key.startsWith('#')) {
        const el = document.getElementById(key.split('#')[1]);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      } else if (key.startsWith('http')) {

        if (newTab) {
          window.open(key, '_blank');
        } else {
          window.location.href = key
        }
      } else if (key.startsWith('/')) {
        return newTab ? window.open(key, '_blank') : this.router.navigate([key], {
          queryParams: queryParams
        });
      } else {
        const item = this._breadcrumbCodes.find((l) => l.code && key.toLowerCase() === l.code.toLowerCase());
        if (item) {
          nav = item.item;
        } else {
          this.gotoParent(key, params);
        }
      }
    } else if (Array.isArray(key)) {
      this.router.navigate(key, {
        queryParams: queryParams
      });

      if (fragment) {
        setTimeout(() => {
          const el = document.getElementById(fragment);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
      return;
    } else if (!(key instanceof Link)) {
      nav = this._entityHandler[key.type];
      pathParams['id'] = key.id || key.code;
      pathParams['code'] = key.code || key.id;
      for (const item in key) {
        if (!pathParams.hasOwnProperty(item)) { pathParams[item] = key[item] }
      }

      // return this.goto(handler.routerLink.map((p) => p.startsWith(':') ? entity[p.substring(1)] : p).join('/'), params, options);
    } else {
      nav = key;
    }

    if (nav.routerLink && nav.routerLink.length) {
      const parts = nav.routerLink.map((p) => {
        if (!p.startsWith(':')) {
          return p;
        }
        const param = pathParams[p.substring(1)];
        // if (param) {
        //   delete params[p.substring(1)];
        // }
        return param;
      });

      this.router.navigate(parts, {
        queryParams: queryParams || nav.params.query,
        fragment: fragment || nav.params.fragment
      });
    } else if (nav.url) {
      let url = nav.url;
      if (params.query) {
        url = `${url}${url.indexOf('?') < 0 ? '?' : '&'}${(new HttpParams({ fromObject: params.query })).toString()}`;
      }
      window.open(url, newTab ? '_blank' : '_self');
    } else {
      this.back();
    }
  }

  gotoParent(code: string | Link, params?: any, options?: any) {
    if (!code) {
      return;
    }
    const linkCode = typeof code === 'string' ? code : code.code;
    const link = this._breadcrumbCodes.find((l) => l.code && linkCode.toLowerCase() === l.code.toLowerCase());

    if (!link || !link.parent) {
      this.back();
    }

    this.goto(link.parent, params, options);
  }

  setLabel(page: Link, label: string) {
    page.title = label;
    const links = this._breadcrumbLinks.map((l) => {
      const link = new Link(l);
      if (l.code === page.code) {
        link.title = label;
      }
      return link;
    });

    this.setBreadcrumb(links);

    if (!this._currentPage || this._currentPage.code === page.code) {
      this.setTitle(label);
    }
  }

  setBreadcrumb(links: any[]) {
    const items: Link[] = [];
    links.forEach((link) => {
      const item = new Link(link);
      item.isActive = false;
      items.push(item);
    });
    if (items.length > 0) {
      items[items.length - 1].isActive = true;
    }

    this._breadcrumbLinks = items;
    this._breadcrumb.next(this._breadcrumbLinks);
  }

  pushBreadcrumb(obj: any) {
    const link = new Link(obj);
    link.isActive = true;

    this._breadcrumbLinks.forEach((i) => i.isActive = false);
    this._breadcrumbLinks.push(link);
    this._breadcrumb.next(this._breadcrumbLinks);
  }

  popBreadcrumb() {
    if (this._breadcrumbLinks.length) {
      this._breadcrumbLinks.pop();
    }

    this._breadcrumb.next(this._breadcrumbLinks);
  }

  replaceBreadcrumb(obj: any) {
    const link = new Link(obj);
    if (this._breadcrumbLinks.length) {
      this._breadcrumbLinks.pop();
    }

    this._breadcrumbLinks.push(link);

    this._breadcrumb.next(this._breadcrumbLinks);
  }

  resetBreadcrumb() {
    this._breadcrumbLinks = [];
    this._breadcrumb.next(this._breadcrumbLinks);
  }

  back(key?: string | Link | string[] | Entity, params?: any) {
    if (key) {
      this.goto(key, params);
    } else {
      this.location.back();
    }
  }

  reset() {
    this.resetTitle();
    this.resetBreadcrumb();
  }

  setTitle(title: string) {
    this.metaService.setTitle(title);
    this._title.next(title);
  }

  resetTitle() {
    this.metaService.setTitle('');
    this._title.next('');

  }

  setDescription(description: string) {
    this.metaService.setMetaTag({ name: 'description', content: description });
  }

  resetDescription() {
    this.metaService.removeMetaTag("name='description'");
  }

  changeQueryParams(params: Params, route: ActivatedRoute, handler?: 'merge' | 'preserve' | '') {
    this.router.navigate([], {
      relativeTo: route,
      queryParams: params,
      queryParamsHandling: handler || 'merge'
    });
  }
}
