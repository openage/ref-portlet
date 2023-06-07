import { Directive, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { NavService, UxService } from 'src/app/core/services';
import { Entity } from '../models';
import { LocalStorageService, RoleService } from '../services';
import { Link } from '../structures';

@Directive()
export abstract class PageBaseComponent implements OnDestroy {

  @ViewChild('main')
  pageContainer: ElementRef;

  isProcessing = false;

  isInitialized = false;
  isCurrent = true;
  page: Link;
  sections: any = {};
  path: string;
  entity: Entity;
  showFilters: boolean;
  view: any;

  private _selected: any = {};

  isShow: boolean;
  topPosToStartShowing = 100;

  private _entity: any;

  abstract setContext(items: any[]): any[] | void;
  private changeSubject = new Subject<{
    get: (key: string) => any
  }>();
  params = this.changeSubject.asObservable();

  constructor(
    private _nav: NavService,
    private _ux: UxService,
    private _auth: RoleService,
    private _route: ActivatedRoute,
    private _cache: LocalStorageService

  ) {
    this.path = this._getPath(_route);
    this.isProcessing = true; // _ux.block(true);
    _nav.register(this.path, _route, (isCurrent, params, page) => {
      this.isCurrent = isCurrent;
      if (page) {
        this.page = page;
      }
      this._selected = this.page?.meta?.params || this.page?.meta?.selected || {};
      this.sections = {};

      let sections = [];
      if (!Array.isArray(this.page?.meta?.sections)) {
        for (const code in this.page?.meta?.sections) {
          if (Object.prototype.hasOwnProperty.call(this.page?.meta?.sections, code)) {
            const section = this.page?.meta?.sections[code];
            section.code = code
            sections.push(section);
          }
        }
      } else {
        sections = this.page?.meta?.sections;
      }

      sections.filter(s => _auth.hasPermission(s.permissions)).forEach(s => this.sections[s.code] = s);

      this._entity = this._selected.entity || this.page?.meta?.entity;
      if (!this._entity && _route.snapshot.data && (_route.snapshot.data.for || _route.snapshot.data.entity)) {
        this._entity = _route.snapshot.data.for || _route.snapshot.data.entity
      }

      if (this._entity) {
        if (this._entity.code && this._entity.code.startsWith(':')) {
          this._entity.code = params.get(this._entity.code.substring(1));
        }
      }

      this.view = params.get('view') || this.getCache('view') || this._selected.view;
      this.showFilters = params.get('showFilters') || this.getCache('showFilters') || this._selected.showFilters;

      this._ux.showSearch(this.showFilters);

      setTimeout(() => {


        this.changeSubject.next({
          get: (key) => {
            let value = this._selected[key] || params.get(key);

            if (key === 'sort' && typeof value === 'string') {
              let sort: any = {};
              sort[value] = 'asc';
              return sort;
            }

            return value;
          }
        });

        if (this.isCurrent) {
          if (this.page.meta.search) {
            this._ux.setSearchParams(this.page.meta.search);
          } else {
            this._ux.resetSearchParams();
          }
        }

        this.isProcessing = _ux.block(false);
      });
    }).then((link) => {
      this.page = link;
      if (this.page) { this.page.meta = this.page.meta || {}; }
    });
  }

  beforeInit() {
    if (this.isCurrent) {
      this.setEntity({})
    }
  }

  afterInit() {
    if (this.isCurrent) {
      this._setContext();
    }

    this.isInitialized = true;
  }

  private _getPath(route: ActivatedRoute) {
    let path = '';
    if (route.parent) {
      path += this._getPath(route.parent);
    }

    if (route.routeConfig && route.routeConfig.path) {
      path = `${path}/${route.routeConfig.path}`;
    }


    return path;
  }

  /**
   * fetches context from meta and tries to render it. It takes array of one of the following type
   * array of string
   * ["add", "close"]
   *
   * or full object meta
   * [{
   *    "code": "reset",
   *    "label": "Reset"
   *    "permissions": [
   *      "system.manage"
   *    ]
   * }]
   *
   */

  private _setContext() {
    const mapToObject = (i) => {
      return typeof i === 'string' ? {
        code: i
      } : i;
    };

    let items = (this.page?.meta?.context || []).map(i => {
      i = mapToObject(i);

      let children = (i.config?.items || i.items || i.options || []).map(c => mapToObject(c));
      if (children.length) {
        i.options = children;
      }

      return i;
    });

    if (this.setContext) {
      const value = this.setContext(items);
      if (value) {
        items = value;
      }
    }

    items.forEach((item) => {
      switch (item.code) {
        case 'filters':
          item.event = () => {
            this.showFilters = !this.showFilters;
            this._ux.showSearch(this.showFilters);
            this.setCache('showFilters', this.showFilters);
          }
          break;

        case 'help':
          item.value = item.value || item.helpCode || `root|help|${this.page.code.replace('.', '|')}`;
          break;

        case 'list':
          item.event = () => { this.setView('list') };
          break;

        case 'grid':
          item.event = () => { this.setView('grid') };
          break;

        case 'table':
          item.event = () => { this.setView('table') };
          break;
      }
    });

    items = items.filter(i => this._auth.hasPermission(i.permissions));

    this._ux.setContextMenu(items);
  }

  ngOnDestroy(): void {
    this.page?.subscription?.unsubscribe();
    this._ux.reset();
  }

  @HostListener('window:scroll')
  checkScroll() {
    if (this.pageContainer) {
      return;
    }
    const scrollPosition = this.pageContainer.nativeElement.scrollTop || 0;

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }
  gotoTop() {
    if (this.pageContainer) {
      return;
    }
    this.pageContainer.nativeElement.scrollTop = 0;
  }


  setEntity(entity: any) {
    this.entity = new Entity(this._entity);

    if (typeof entity === 'string') {
      this.entity.code = entity;
      this.entity.id = entity;
    } else {
      this.entity.id = entity.id || this.entity.id;
      this.entity.code = entity.code || this.entity.code;
      this.entity.code = this.entity.code || `${this.entity.id}`;
      this.entity.id = this.entity.id || this.entity.code;
      this.entity.type = entity.type || this.entity.type;
      this.entity.name = entity.name || this.entity.name;
    }

    this._ux.setEntity(this.entity);

  }

  setTitle(title: string) {
    this._nav.setLabel(this.page, title);
  }

  setView(view: string) {
    this.view = view;
    this.setCache('view', view);
  }

  setCache(key, value) {
    return this.page ? this._cache.components(this.page.code).set(key, value) : null;
  }

  getCache(key) {
    return this.page ? this._cache.components(this.page.code).get(key) : null;
  }

  getQuery($event: any) {

    const query: any = {};
    Object.getOwnPropertyNames($event || {}).forEach((k) => {
      query[k] = $event[k];
      if (this._selected[k] && this._selected[k].unmuteable) {
        query[k] = this._selected[k].value;
      }
    });

    query.get = (key: string, unmuteable?: boolean) => {
      if (unmuteable) {
        return this._selected[key] || query[key];
      } else {
        return query[key] || this._selected[key];
      }
    }

    return query
  }
}
