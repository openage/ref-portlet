import { Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { NavService } from './nav.service';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private _title = environment.title;

  constructor(
    private meta: Meta,
    private titleService: Title
  ) { }

  setTitle(title: string): void {
    this.titleService.setTitle(title || this._title);
  }

  getTitle(): string {
    return this.titleService.getTitle();
  }

  setMetaTag(tag: MetaDefinition): void {
    this.meta.updateTag(tag);
  }

  setMetaTags(tags: Array<MetaDefinition | null>): void {
    tags.forEach((tag) => {
      tag && this.meta.updateTag(tag);
    });
  }

  removeMetaTag(str: string): void { //"name='description'", 'og:url'
    this.meta.removeTag(str);
  }
}
