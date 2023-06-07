import { IUser } from '../../core/models';
import { Entity } from '../../core/models/entity.model';
import { ModelBase } from '../../core/models/model-base.model';
import { Doc } from './doc.model';

export class Folder extends ModelBase {
  name: string;
  description: string;
  type: string;
  url: string;
  thumbnail: string;
  folders: Folder[];
  files: Doc[];
  entity: Entity;
  owner: IUser;
  parent: Folder;
  visibility: number;

  constructor(obj?: any) {
    super();

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.code = obj.code;
    this.name = obj.name;
    this.description = obj.description;
    this.type = obj.type;
    this.url = obj.url;
    this.parent = obj.parent;
    this.visibility = obj.visibility;
    this.thumbnail = obj.thumbnail;
    if (obj.owner) {
      this.owner = obj.owner;
    }

    if (obj.folders && obj.folders.length) {
      this.folders = [];
      obj.folders.forEach((folder) => {
        this.folders.push(new Folder(folder));
      });
    }

    if (obj.files && obj.files.length) {
      this.files = [];
      obj.files.forEach((file) => {
        this.files.push(new Doc(file));
      });
    }

    if (obj.entity) {
      this.entity = new Entity(obj.entity);
    }
  }
}
