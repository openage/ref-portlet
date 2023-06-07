import { Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModelBase } from '../../models';

export class Link extends ModelBase {
  index = 0;
  parent: any;
  code: string;
  name: string;
  src: string;
  url: string;
  activeUrl: string;
  routerLink: string[];
  path: string;
  params: {
    path?: Params,
    query?: Params,
    fragment?: string
  };

  // target: string;
  title: string;
  icon: any;
  handles: string[];
  class: any;
  meta: any;
  options: any;
  isActive = false;
  view = 'link';

  // queryParams: Params;
  current: Link;
  items: Link[];
  permissions: string[];
  layout: string;
  subscription?: Subscription;
  event: (any) => void;
  pullDown?: boolean;

  constructor(obj?: any) {
    super(obj);

    if (!obj) {
      return;
    }
    this.index = obj.index;
    this.src = obj.src;
    this.title = obj.title;
    this.handles = obj.handles;
    this.event = obj.event;

    this.icon = {};
    if (obj.parent) {
      this.parent = obj.parent;

      // if (obj.parent instanceof Link) {
      //   this.parent = obj.parent;
      // } else {
      //   this.parent = new Link(obj.parent);
      // }
    }
    if (typeof obj.icon === 'string') {
      if (obj.icon.startsWith('http')) {
        this.icon.url = obj.icon;
      } else if (obj.icon.startsWith('fa-')) {
        this.icon.fa = obj.icon.substring(3);
      } else if (obj.icon.startsWith('oa-')) {
        this.icon.oa = obj.icon.substring(3);
      } else if (obj.icon.startsWith('mat-')) {
        this.icon.mat = obj.icon.substring(4);
      } else {
        this.icon.mat = obj.icon;
      }
    } else {
      this.icon = obj.icon;
    }

    this.isActive = obj.isActive;

    this.meta = obj.meta || {};
    this.class = obj.class || "";
    this.view = obj.view || 'link';
    this.params = obj.params || {};

    this.params.path = this.params.path || obj.pathParams;
    this.params.query = this.params.query || obj.queryParams;
    this.params.fragment = this.params.fragment || obj.fragment;

    if (obj.url) {
      this.url = obj.url;
      if (!obj.url.startsWith('http')) {
        obj.path = Link.toPath(obj.url)

        this.params.path = this.params.path || Link.toPathParams(this.url);
        this.params.query = this.params.query || Link.toQueryParams(this.url);
        this.params.fragment = this.params.fragment || Link.toFragment(this.url);
      }
    }
    this.path = obj.path;

    if (this.path) {
      this.routerLink = this.path.split('/');
    }

    // if (obj.routerLink && obj.routerLink.length) {
    //   this.routerLink = [];
    //   let path = '';
    //   for (let index = 0; index < obj.routerLink.length; index++) {

    //     let item = obj.routerLink[index];
    //     if (index === (obj.routerLink.length - 1) && item.indexOf('?') !== -1) {
    //       this.params.query = this.params.query || {};

    //       const parts = item.split('?');

    //       item = parts[0];

    //       parts[1].split('&').forEach((p) => {
    //         const query = p.split('=');
    //         this.params.query[query[0]] = query[1];
    //       });
    //     }
    //     path = item.startsWith('/') ? `${path}${item}` : `${path}/${item}`;
    //     this.routerLink.push(item);
    //   }
    //   this.path = path;

    // }

    this.options = obj.options || {};
    if (obj.target && obj.target === '_blank') {
      this.options.newTab = true;
    }


    this.activeUrl = obj.activeUrl;
    this.layout = obj.layout;


    this.items = [];

    if (obj.items && obj.items.length) {
      this.items = obj.items.map((i) => {
        const item = new Link(i);
        i.parent = this;
        return item;
      });
    }
    this.permissions = obj.permissions || [];
    this.pullDown = obj.pullDown
  }

  static toPath(url) {
    let path = url.split('#')[0].split('?')[0];

    if (path.startsWith('/')) {
      path = path.substring(1);
    }

    return path;
  }

  static toQueryParams(url) {
    let query = ''

    let params = {}

    if (url.indexOf('?') !== -1) {
      query = url.substring(url.indexOf('?') + 1);
    }

    if (query && query.indexOf('#') !== -1) {
      query = query.split('#')[0];
    }

    if (query) {
      query.split('&').forEach(i => {
        let parts = i.split('=');
        params[parts[0]] = parts[1]
      });
    }

    return params;
  }

  static toPathParams(url) {
    let parts = this.toPath(url).split('/');

    let params = {}

    for (const part of parts) {
      if (part.startsWith(':'))
        params[part.substring(1)] = null
    }
    return params;
  }

  static toFragment(url) {
    if (url.indexOf('#') !== -1) {
      let fragment = url.substring(url.indexOf('#') + 1);

      if (fragment.indexOf('?') === -1) {
        fragment = fragment.split('?')[0];
      }

      return fragment;
    }
  }

  static toParams(url) {
    let params = [];
    const fragment = this.toFragment(url);



    if (fragment) {
      params.push({ key: 'fragment', value: fragment });
    }


    let query = this.toQueryParams(url);

    for (const key in query) {
      params.push({
        key: key,
        value: query[key]
      })
    }

    let path = this.toPathParams(url);

    for (const key in path) {
      params.push({
        key: key,
        value: path[key]
      })
    }

    return params;
  }
}
