import { Injectable, Injector } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Link } from '../structures/nav/link.model';

class InProcessStorage implements Storage {
  store: any = {};

  [name: string]: any;
  length: number;

  clear(): void {
    this.store = {};
  }
  getItem(key: string): string {
    return this.store[key] as string;
  }
  key(index: number): string {
    const keys = Object.getOwnPropertyNames(this.store);

    if (!keys || !keys.length) {
      return;
    }
    return this.store[keys[0]];
  }
  removeItem(key: string): void {
    this.store[key] = undefined;
  }
  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

// eslint-disable-next-line max-classes-per-file
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  store: Storage;
  currentPage: Link;

  constructor() {
    switch (environment.session.cache.storage) {
      case 'session':
      case 'temporary':
        this.store = window.sessionStorage;
        break;
      case 'local':
      case 'permanent':
        this.store = window.localStorage;
        break;
      case 'none':
        this.store = new InProcessStorage();
        break;
      default:
        this.store = window.localStorage;
        break;
    }
  }

  getItem(key: string): any {
    return this.store.getItem(key);
  }

  setItem(key: string, value: string): void {
    this.store.setItem(key, value);
  }

  clear(): void {
    return this.store.clear();
  }

  get(id: string, builder?: () => any): any {
    const item = this.store.getItem(id);
    try {
      if (item) {
        return JSON.parse(item);
      }
      if (builder) {
        const value = builder();
        this.set(id, value);
        return value;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  set(id: string, value: any): any {
    if (!value) {
      this.store.removeItem(id);
    } else {
      if (typeof value === 'object') {
        this.store.setItem(id, JSON.stringify(value));
      } else {
        this.store.setItem(id, value);
      }
    }
    return value;
  }

  update(id: string, value: any): any {
    return this.set(id, value);
  }

  remove(id: string) {
    this.store.removeItem(id);
  }

  components(name) {
    return {
      set: (key: string | number, value: any): any => {
        const components = this.get('components') || {};
        if (this.currentPage && this.currentPage.code) {
          const code = this.currentPage.code.split('.').join('-');
          name = `${name}|${code}`;
        }
        components[name] = components[name] || {};
        components[name][key] = value;
        this.set('components', components);
        return value;
      },
      get: (key: string | number, defaultValue?: any): any => {
        const components = this.get('components') || {};
        if (this.currentPage && this.currentPage.code) {
          const code = this.currentPage.code.split('.').join('-');
          name = `${name}|${code}`;
        }
        components[name] = components[name] || {};

        const value = components[name][key];
        return value === undefined ? defaultValue : components[name][key];
      }
    };
  }

  public saveLink(link) {
    this.currentPage = link;
  }

}
