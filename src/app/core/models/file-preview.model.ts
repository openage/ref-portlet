import { Entity } from 'src/app/lib/oa/core/models';
import { Doc, Folder } from 'src/app/lib/oa/drive/models';

export class FilePreview {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  doc?: Doc;
  category?: string;
  entity?: Entity;
  params?: any;
  generateByUrls?: [] = []; // [{name: string, url: string}]
  folder?: Folder = new Folder();
  options?: any;

  constructor(obj?: any) {

    if (!obj) {
      return;
    }

    this.panelClass = obj.panelClass;
    this.hasBackdrop = obj.hasBackdrop;
    this.backdropClass = obj.backdropClass;
    this.doc = new Doc(obj.doc);
    this.category = obj.category;
    this.entity = obj.entity;
    this.params = obj.params;
    this.generateByUrls = obj.generateByUrls;
    this.folder = obj.folder;
    this.options = obj.options;
  }
}
