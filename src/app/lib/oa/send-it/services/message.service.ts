import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UxService } from 'src/app/core/services';
import { Entity } from '../../core/models/entity.model';
import { RoleService } from '../../core/services';
import { Message } from '../models';
import { SendItApiBase } from './sendit-api.base';

@Injectable()
export class MessageService extends SendItApiBase<Message> {

  constructor(http: HttpClient, roleService: RoleService, uxService: UxService) {
    super('messages', http, roleService, uxService);
  }

  getModes(): Observable<string[]> {
    const subject = new Subject<string[]>();

    setTimeout(() => {
      subject.next(['email', 'sms', 'push']);
    });

    return subject.asObservable();
  }
}
