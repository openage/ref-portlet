import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Tag } from '../models/tag.model';
import { InsightApiBase } from './insight-api.base';

@Injectable()

export class TagService extends InsightApiBase<Tag> {

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService
  ) {
    super('tags', http, roleService, uxService);
  }
}
