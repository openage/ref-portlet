import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Folder } from '../models/folder.model';
import { DriveApiBase } from './drive-api.base';

@Injectable()
export class FolderService extends DriveApiBase<Folder> {

  constructor(http: HttpClient, roleService: RoleService, uxService: UxService) {
    super('folders', http, roleService, uxService);
  }

}
