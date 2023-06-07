import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { UxService } from 'src/app/core/services';
import { IUser } from '../../core/models';
import { RoleService } from '../../core/services';
import { Project } from '../models/project.model';
import { GatewayApi } from './gateway.api';

@Injectable()
export class ProjectService extends GatewayApi<Project> {
  constructor(
    http: HttpClient,
    private auth: RoleService,
    private uxService: UxService
  ) {
    super('projects', http, auth, uxService);
  }

  public getMemberByRole(projectId, role): Observable<IUser> {
    const updateSubject = new Subject<IUser>();
    this.get(`${projectId}/member/${role}`).subscribe((item) => {
      updateSubject.next(item as any);
    }, (err) => {
      this.uxService.handleError(err);
      updateSubject.next(err);
    });

    return updateSubject;
  }

  getView(code) {
    let view = 'tasks'

    switch (code) {
      case 'task':
        view = 'tasks';
        break;

      case 'story':
        view = 'stories';
        break;

      case 'technical-story':
        view = 'technicalStories';
        break;

      case 'defect':
        view = 'defects';
        break;

      case 'epic':
        view = 'epics';
        break;

      case 'risk':
        view = 'risks';
        break;

      case 'test-case':
        view = 'testCases';
        break;

      case 'test-plan':
        view = 'testPlans';
        break;

      case 'bau':
        view = 'baus';
        break;

      case 'release':
        view = 'releases';
        break;
    }
    return view;
  }

}
