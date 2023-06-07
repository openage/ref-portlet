import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { GenericApi, IApi, LocalStorageService, RoleService, StringService } from 'src/app/lib/oa/core/services';

@Component({
  selector: 'oa-input-with-http',
  templateUrl: './input-with-http.component.html',
  styleUrls: ['./input-with-http.component.css']
})
export class InputWithHttpComponent implements OnInit {
  @Input()
  id: string;

  @Input()
  optionsId: string;

  @Input()
  readonly = false;

  @Input()
  disabled = false;

  @Input()
  value: any = "";

  @Input()
  placeholder: string;

  create: boolean = false;
  editPermissions: any = [];

  @Input()
  api: IApi<any>;

  @Input()
  url: {
    code?: string;
    addOn?: string;
  } = { code: "", addOn: "" };

  @Input()
  displayValue: () => string;

  @Input()
  options: any;

  @Input()
  target: any = { key: "", code: "" }

  @Input()
  params: any = {};


  constructor(
    public uxService: UxService,
    private httpClient: HttpClient,
    private auth: RoleService,
    private cache: LocalStorageService,
    private stringService: StringService) {

  }

  ngOnInit(): void {
    // TODO
    if (this.params) {
      this.url.code = this.params.urlCode;
      this.url.addOn = this.params.addOn || "";
      this.target.code = this.params.targetCode;
      this.target.key = this.params.targetKey;
      this.value = this.params.value || "0";
      this.editPermissions = this.params.permissions || ["system.manage"]
      this.disabled = !this.auth.hasPermission(this.editPermissions)
      this.create = this.params.create || false;
    }

    if (!this.api && this.url) {
      this.api = new GenericApi(this.httpClient, this.url.code, {
        collection: this.url.addOn,
        auth: this.auth,
        errorHandler: this.uxService
      });
    }
    if (this.target.code) {
      this.api.get(this.target.code).subscribe(
        (data) => {
          if (this.target.key)
            this.value = data[this.target.key] || "0";
        });
    }
  }

  onBlur($event) {
    let value = $event.target.value;
    if (this.target.key && this.target.code) {
      const model = {};
      model[this.target.key] = value
      this.api.update(this.target.code, model).subscribe(() => {
        this.uxService.showInfo("Updatd Successfully")

      });

    }
    else if (!this.target.code || this.create) {
      if (this.params.createVoucher) {
        this.api.search({ 'entity-type': 'order', 'entity-id': this.params.order, 'isPayable': false }).subscribe(
          (data) => {
            let vouchers = data.items.filter(item => !item.isPayable)
            if (vouchers.length < 5) {
              this.createNewVoucher(value);
            }
            else
              this.uxService.showInfo("Exceeded Customer Voucher Creation Limit of 5")
          });
      }
    }
  }


  createNewVoucher(value) {
    const model = {
      isPayable: false,
      entity: {
        id: this.params.order,
        type: 'order'
      },
      amount: value || 0,
      buyerOrganization: {
        code: this.params.customerCode
      }
    };
    this.api.create(model).subscribe((data) => {
      this.uxService.showInfo(`Created Voucher ${data.code} with Amount ${data.amount}`)
    })
  }

}
