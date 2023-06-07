import { HttpClient } from '@angular/common/http';
import { UxService } from 'src/app/core/services';
import { GenericApi } from 'src/app/lib/oa/core/services';
import { RoleService } from '../../core/services';

export class BapApi<TModel> extends GenericApi<TModel> {
  constructor(
    collection: string,
    http: HttpClient,
    auth: RoleService,
    uxService: UxService
  ) {
    super(http, 'bap', { collection, auth, errorHandler: uxService });
  }
}
