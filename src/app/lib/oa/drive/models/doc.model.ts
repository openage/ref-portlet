import { IUser } from '../../core/models';
import { Entity } from '../../core/models/entity.model';
import { ModelBase } from '../../core/models/model-base.model';
import { Member } from './member';

export class Doc extends ModelBase {
  name: string;
  description: string;
  size: number;
  version: number;
  type: string;
  url: string;
  mimeType: string;
  thumbnail: string;
  identifier: string;
  from: Date;
  till: Date;
  timeStamp: Date;
  creator: IUser;
  owner: IUser;
  folder: any;
  entity: Entity;
  visibility: number;
  content: any;
  isPlaceholder: boolean;
  view: {
    views: number;
  };
  members: Member[] = [];
  tags: string[] = [];
  category: string;

  constructor(obj?: any) {
    super(obj);

    if (!obj) {
      return;
    }

    this.description = obj.description;
    this.size = obj.size;
    this.version = obj.version;
    this.type = obj.type;
    this.url = obj.url;
    this.mimeType = obj.mimeType;
    this.timeStamp = obj.timeStamp;
    this.visibility = obj.visibility;
    this.thumbnail = obj.thumbnail;
    this.creator = obj.creator;
    this.owner = obj.owner;
    this.folder = obj.folder;
    this.identifier = obj.identifier;
    this.from = obj.from;
    this.till = obj.till;
    this.isPlaceholder = obj.isPlaceholder;
    this.view = obj.view;
    this.tags = obj.tags;
    this.category = obj.category;
    if (obj.entity) {
      this.entity = new Entity(obj.entity);
    }

    this.members = obj.members ? obj.members.map((i) => new Member(i)) : [];

    if (obj.content) {
      this.content = obj.content;
    }
  }
}
