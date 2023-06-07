import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UxService } from 'src/app/core/services';
import { Entity } from '../../core/models';
import { RoleService } from '../../core/services';
import { Conversation } from '../models';
import { SendItApiBase } from './sendit-api.base';

@Injectable()
export class ConversationService extends SendItApiBase<Conversation> {

  constructor(http: HttpClient, roleService: RoleService, uxService: UxService) {
    super('conversations', http, roleService, uxService);
  }

  getByEntity(entity: Entity): Observable<Conversation> {
    return this.get(`entity?entity-id=${entity.id}&entity-type=${entity.type}&entity-name=${entity.name}`);
  }
  getModes(): Observable<string[]> {
    const subject = new Subject<string[]>();

    setTimeout(() => {
      subject.next(['email', 'sms', 'push']);
    });

    return subject.asObservable();
  }
}
