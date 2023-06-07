
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Payment } from '../models/payment.model';
import { BapApi } from './bap-api.base';

@Injectable({
    providedIn: 'root'
})
export class PaymentService extends BapApi<Payment> {

    constructor(
        http: HttpClient,
        roleService: RoleService,
        uxService: UxService
    ) {
        super('payments', http, roleService, uxService);
    }
}
