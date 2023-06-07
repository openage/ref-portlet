import { HttpClient } from '@angular/common/http';
import { UxService } from 'src/app/core/services';
import { GenericApi } from 'src/app/lib/oa/core/services';
import { environment } from 'src/environments/environment';
import { RoleService } from '../../core/services';

export class GatewayApi<TModel> extends GenericApi<TModel> {
  constructor(
    collection: string,
    http: HttpClient,
    auth: RoleService,
    uxService: UxService,
    map?: (obj: any) => TModel
  ) {
    super(http, 'gateway', { collection, auth, map, errorHandler: uxService });
  }
}
