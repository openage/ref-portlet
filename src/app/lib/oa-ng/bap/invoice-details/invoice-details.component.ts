import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { NavService, UxService } from 'src/app/core/services';
import { Invoice } from 'src/app/lib/oa/bap/models/invoice.model';
import { InvoiceService } from 'src/app/lib/oa/bap/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { DetailBase } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'bap-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent extends DetailBase<Invoice> implements OnInit {

  @Input()
  code: string;

  @Input()
  readonly = true;

  @Output()
  currencyChange: EventEmitter<any> = new EventEmitter();

  isCodeSelected: boolean = false;

  currencies: {
    currency: string,
    ratio: number,
    isSelected: boolean
  }[] = [];


  isProcessing = false;

  constructor(
    api: InvoiceService,
    public auth: RoleService,
    uxService: UxService,
    public navService: NavService
  ) {
    super({ api, errorHandler: uxService });
  }

  ngOnInit() {
    if (this.code) {
      this.get(this.code).subscribe((item) => {
        this.set(new Invoice(item));
        this.setCurrencies();
      });
    }
  }

  setCurrencies(): void {
    this.currencies = Object.keys(this.properties.currency.ratio || {}).map((c) => {
      return {
        currency: c,
        ratio: this.properties.currency.ratio[c],
        isSelected: false
      };
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes && changes.hasOwnProperty('code')) {
    //   this.ngOnInit();
    // }
  }

  onOrder() { }

  onChange($event, from) {
    if (from === 'customerEntity') {
      if (this.properties.buyerBillingEntity?.code === $event.code) {
        return;
      }
      this.properties.buyerBillingEntity = $event;
    }
    if (from === 'supplierEntity') {
      if (this.properties.sellerBillingEntity?.code === $event.code) {
        return;
      }
      this.properties.sellerBillingEntity = $event;
    }
    if (from === 'customerUser') {
      if (this.properties.buyer?.email === $event.email) {
        return;
      }
      this.properties.buyer = $event.email;
    }
    if (from === 'supplierUser') {
      if (this.properties.seller?.email === $event.email) {
        return;
      }
      this.properties.seller = $event.email;
    }
    this.update(this.properties);
  }

  setCurrencyRatio($event, currency): void {
    this.properties.currency.ratio[currency] = Number.parseFloat($event.target.value);
    this.currencyChange.emit(this.properties.currency);
  }

  setCode($event): void {
    let code = $event.target.value;
    this.isCodeSelected = false;
    if (code && this.properties.code !== code) {
      this.update({ code });
    }
  }

  onDateChange($event) {
    this.properties.date = $event;
  }

  onRecievedDateChange($event) {
    this.properties.receivedDate = $event;
  }

  onDueDateChange($event) {
    this.properties.dueDate = $event;
  }

  onSelectJob(code: string) {
    this.navService.goto(`/freight/orders/${code}`, {}, { newTab: true });
  }
}
