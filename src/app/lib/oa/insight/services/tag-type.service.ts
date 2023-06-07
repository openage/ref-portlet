import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { TagType } from '../models/tag-type.model';
import { InsightApiBase } from './insight-api.base';

@Injectable()

export class TagTypeService extends InsightApiBase<TagType> {

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService
  ) {
    super('tagTypes', http, roleService, uxService);
  }
}
