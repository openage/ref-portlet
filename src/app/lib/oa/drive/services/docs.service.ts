import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UxService } from 'src/app/core/services';
import { Entity, Page } from '../../core/models';
import { DateService, RoleService } from '../../core/services';
import { Folder } from '../models';
import { Doc } from '../models/doc.model';
import { DriveApiBase } from './drive-api.base';

@Injectable()
export class DocsService extends DriveApiBase<any> {
  constructor(
    private httpClient: HttpClient,
    private dateService: DateService,
    auth: RoleService,
    uxService: UxService) {

    super('files', httpClient, auth, uxService);
  }

  public searchByEntity(entity: Entity, folder?: Folder | string, fileName?: string, options?: any): Observable<Page<Doc>> {
    const query = {
      'entity-type': entity.type,
      'entity-id': entity.id
    };
    if (folder) {
      if (typeof folder === 'string') {
        query['folder-name'] = folder;
      } else if (folder.id) {
        query['folder-id'] = folder.id;
      } else if (folder.name) {
        query['folder-name'] = folder.name;
      }
    }

    if (fileName) {
      query['name'] = fileName;
    }

    return this.search(query, options);
  }

  public getByEntity(entity: Entity | any, name: string, options?: {
    handleError?: boolean,
    createDefault?: boolean
    name?: string,
    folder?: Folder | string,
    meta?: any,
    isPlaceholder?: any
  }): Observable<Doc> {
    const subject = new Subject<any>();
    this.get(`${name}?entity-type=${entity.type}&entity-id=${entity.id}&entity-name=${entity.name}`, {
      handleError: (err) => {
        if (err.message === 'UNKNOWN' && options && (options.handleError === true) && options.createDefault) {
          subject.next(new Doc({
            entity: entity,
            code: name,
            name: options.name,
            folder: options.folder,
            meta: options.meta,
            isPlaceholder: options.isPlaceholder
          }));
        } else {
          subject.error(err);
        }
      }
    }).subscribe((doc) => {
      subject.next(doc);
    });
    return subject.asObservable();
  }

  public getLayout(path: string): Observable<any> {
    const subject = new Subject<any>();
    if (path.startsWith('http') || path.startsWith('/')) {
      this.httpClient.get(path).subscribe((f) => {
        subject.next(f);
      });
    } else {
      this.get(path).subscribe((f) => {
        if (typeof f.content === 'string') {
          subject.next(JSON.parse(f.content));
        } else {
          subject.next(f.content);
        }
      });
    }
    return subject.asObservable();
  }

  public createByEntity(entity: Entity, file: File, folder?: Folder | string): Observable<Doc> {
    const queryParams = {
      'entity-type': entity.type,
      'entity-id': entity.id
    };

    if (folder) {
      if (typeof folder === 'string') {
        queryParams['folder-code'] = folder;
      } else {
        if (folder.id) {
          queryParams['folder-id'] = folder.id;
        } else if (folder.name) {
          queryParams['folder-name'] = folder.name;
        }
      }
    }
    return this.upload(file, null, queryParams);
  }



  private setMeta(obj, queryParams, parentKey) {
    Object.keys(obj).forEach((key) => {
      let parent = parentKey

      if (typeof obj[key] !== 'object') {
        queryParams[`meta-${parentKey}-${key}`] = obj[key];
      } else {
        parent = parent + `-${key}`;
        this.setMeta(obj[key], queryParams, parent);
      }
    });
    return queryParams
  }

  public simpleCreate(file: File, model: any): Observable<Doc> {
    const queryParams = {};

    if (model.id) {
      queryParams['id'] = model.id;
    } else {
      if (model.code) { queryParams['code'] = model.code; }
    }
    if (model.status) { queryParams['status'] = model.status; }
    if (model.name) { queryParams['name'] = model.name; }
    if (model.identifier) { queryParams['identifier'] = model.identifier; }
    if (model.from) { queryParams['from'] = this.dateService.date(model.from).serialize(); }
    if (model.till) { queryParams['till'] = this.dateService.date(model.till).serialize(); }
    if (model.meta) {
      Object.keys(model.meta).forEach((key) => {
        if (typeof model.meta[key] !== 'object') {
          queryParams[`meta-${key}`] = model.meta[key];
        } else {
          this.setMeta(model.meta[key], queryParams, key)
        }
      });
    }

    if (model.folder) {
      if (typeof model.folder === 'string') {
        queryParams['folder-name'] = model.folder;
      } else {
        if (model.folder.id) { queryParams['folder-id'] = model.folder.id; }
        if (model.folder.name) { queryParams['folder-name'] = model.folder.name; }
        if (model.folder.code) { queryParams['folder-code'] = model.folder.code; }
        if (model.folder.entity && model.folder.entity.type) { queryParams['folder-entity-type'] = model.folder.entity.type; }
        if (model.folder.entity && model.folder.entity.id) { queryParams['folder-entity-id'] = model.folder.entity.id; }
      }
    }

    if (model.entity) {
      if (model.entity.id) { queryParams['entity-id'] = model.entity.id; }
      if (model.entity.type) { queryParams['entity-type'] = model.entity.type; }
      if (model.entity.name) { queryParams['entity-name'] = model.entity.name; }
    }

    if (model.visibility) {
      queryParams['visibility'] = model.visibility;
    }

    if (model && model.members) {
      queryParams['members[][role]'] = model.members[0].role;
      queryParams['members[][user]'] = model.members[0].user;
    }

    if (model.tags) {
      queryParams['tags'] = model.tags;
    }

    if (model.creator) {
      queryParams['creator'] = model.creator;
    }

    return this.upload(file, null, queryParams);
  }

  public getContent(doc: Doc) {
    if (!doc || (!doc.content && !doc.url)) { return null; }

    let content: any = {};

    if (typeof doc.content === 'string') {
      content.body = doc.content.trim();
      if (!content.body) {
        return null;
      }
    } else {
      content = doc.content;
    }

    if (doc.thumbnail) {
      content.thumbnail = doc.thumbnail;
    }

    return content;
  }

  public getIcon(doc: Doc) {
    switch (doc.mimeType) {
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

  public getViewer(doc: Doc) {

    switch (doc.mimeType) {
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel':
        return 'not-supported';
      case 'application/pdf':
        return 'pdf';
      case 'image/jpeg':
      case 'image/png':
      case 'image/svg':
      case 'image/jpg':
        return 'img';
      case 'text/html':
      case 'html':
      case 'text':
        return 'html';
      case 'json':
      case 'text/json':
      case 'application/json':
        return 'json';

      case 'link':
        return 'frame';

      default:
        return 'not-supported';
    }
  }

  public download(doc: Doc) {
    if (doc.url) {
      window.open(doc.url, '_blank');
    } else if (doc.content && doc.content.url) {
      window.open(doc.content.url, '_blank');
    }
  }
}
