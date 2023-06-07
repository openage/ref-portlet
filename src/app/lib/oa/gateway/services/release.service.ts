import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { State } from '../models';
import { Release } from '../models/release.model';
import { GatewayApi } from './gateway.api';

@Injectable()
export class ReleaseService extends GatewayApi<Release> {
  constructor(
    http: HttpClient,
    private auth: RoleService,
    private uxService: UxService
  ) {
    super('releases', http, auth, uxService);
  }


  updateStatus(issue: Release, status: State): Observable<Release> {

    const subject = new Subject<Release>();
    const oldStatus = issue.currentStatus;
    // const oldBurnt = issue.burnt;

    const model: any = {
      status: { code: status.code }
    };

    if (status.isFinal) {
      if (status.isCancelled) {
        model.burnt = 0;
        model.points = 0;
      } else {
        model.burnt = issue.points;
      }
    }

    issue.isProcessing = true;
    this.update(issue.id, model).subscribe((i) => {
      issue.isProcessing = false;
      issue.currentStatus = new State(i.status);
      subject.next(i);
    }, (err) => {
      issue.currentStatus = oldStatus;
      // issue.burnt = oldBurnt;
      issue.isProcessing = false;
      this.uxService.handleError(err);
      subject.next(issue);
    });
    return subject;
  }
}
