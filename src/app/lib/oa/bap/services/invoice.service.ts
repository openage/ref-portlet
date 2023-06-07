import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Invoice } from '../models/invoice.model';
import { BapApi } from './bap-api.base';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService extends BapApi<Invoice> {

    constructor(
        http: HttpClient,
        roleService: RoleService,
        uxService: UxService
    ) {
        super('invoices', http, roleService, uxService);
    }
}
