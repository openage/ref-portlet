import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { UxService } from 'src/app/core/services';
import { Invoice } from 'src/app/lib/oa/bap/models/invoice.model';
import { LineItem } from 'src/app/lib/oa/bap/models/line-items.model';
import { Tax } from 'src/app/lib/oa/bap/models/tax.model';
import { InvoiceService } from 'src/app/lib/oa/bap/services';
import { LineItemTypeService } from 'src/app/lib/oa/bap/services/line-item-type.service';
import { RoleService } from 'src/app/lib/oa/core/services';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { CurrencyExchangeDialogComponent } from 'src/app/lib/oa-ng/shared/dialogs/currency-exchange-dialog/currency-exchange-dialog.component';

@Component({
  selector: 'bap-line-items-editor',
  templateUrl: './line-items-editor.component.html',
  styleUrls: ['./line-items-editor.component.css']
})
export class LineItemsEditorComponent extends DetailBase<Invoice> implements OnInit, OnChanges, OnDestroy {
  isProcessing = false;

  @Input()
  view: 'finance' | 'vendor' | 'customer' | 'actionItems' = 'finance'

  @Input()
  invoice: Invoice;

  @Input()
  type: string;

  @Input()
  taxLimit: number = 18.5;

  @Input()
  readonly = true;

  @Input()
  currency: any;

  @Input()
  options: {
    addLineItem?: boolean;
    editTax?: boolean;
    editUnit?: boolean;
  }

  @Output()
  editorChange: EventEmitter<any> = new EventEmitter();

  searchParams: any = { name: '' };

  maxTaxPercentage: number = 18.5;
  applicableTaxes: string[] = ['cgst', 'sgst', 'igst', 'ugst'];

  total: TotalAmount = new TotalAmount();

  updatedSubscription: Subscription;

  constructor(
    api: InvoiceService,
    public chargeService: LineItemTypeService,
    public auth: RoleService,
    public uxService: UxService,
    private dialog: MatDialog,
    // public chargeService: ChargeService
  ) {
    super({ api, errorHandler: uxService });
    this.updatedSubscription = this.updated.subscribe(() => this.init());
  }

  ngOnInit() {
    if (this.invoice) {
      this.set(this.invoice);
      this.init();
    } else if (this.code) {
      this.get(this.code).subscribe((item) => {
        this.set(new Invoice(item));
        this.init();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty('currency') && !changes['currency'].firstChange) {
      this.properties.currency = changes.currency.currentValue;
      this.init();
    }
  }

  init(): void {
    this.properties.lineItems.forEach((lineItem) => this._mapLineItem(lineItem));
    this.properties.lineItems.forEach((lineItem) => this._calculateLineItemAmount(lineItem));
    this._calculateTotal();
  }

  onReset(): void {
    // TODO:
  }

  onChange(lineItem: any): void {
    this._calculateLineItemAmount(lineItem);
  }

  validate(): string[] {
    const errors: string[] = [];

    if (this.properties.isPayable) { // Validate for Maximum Tax Percentage
      for (const lineItem of this.properties.lineItems) {
        const taxPercentage = (lineItem.taxAmount / lineItem.taxableAmount) * 100;
        if (taxPercentage > this.maxTaxPercentage) {
          errors.push(`Tax Amount ${lineItem.taxAmount} can not be greater than ${this.maxTaxPercentage}% of taxable amount ${lineItem.taxableAmount}`);
        }
      }
    }

    return errors;
  }

  onSave(properties: Invoice): void {
    const errors = this.validate();

    if (errors.length) {
      this.uxService.showError(errors);
      return;
    }

    if (this.properties.id) {
      this.update(properties);
    } else {
      this.create(properties);
    }
  }

  onSaveRemarks(remarks: string): void {
    this.properties.remarks = remarks;
  }

  onGstChange($event, tax, lineItem): void {
    tax.value = $event.code;
    tax.amount = Number.parseFloat(((lineItem.taxableAmount * tax.value) / 100).toFixed(2));
    this._calculateLineItemAmount(lineItem);
  }

  private _mapLineItem(lineItem: LineItem): LineItem {
    lineItem.taxes ||= [];
    for (const taxCode of this.applicableTaxes) {
      const tax = lineItem.taxes.find(t => t.type?.code === taxCode);
      if (!tax) {
        const type = this.properties.isPayable ? 'value' : '%';
        lineItem.taxes.push({ amount: 0, type: new Tax({ code: taxCode, type: type }), value: null });
      }
    }
    return lineItem;
  }

  addLineItem(): void {
    const lineItem = this._mapLineItem(new LineItem({
      units: 1,
      rate: {
        amount: 0,
        conversion: 1,
        currency: 'INR'
      },
      taxes: []
    }));
    this._calculateLineItemAmount(lineItem);
    this.properties.lineItems.push(lineItem);
  }

  removeLineItem(index): void {
    this.properties.lineItems.splice(index, 1);
    this._calculateTotal();
  }

  public onChargeSelect(charge: any, lineItem: LineItem): void {
    lineItem.code = charge.code;
    lineItem.name = charge.name;
    lineItem.description = charge.description;
  }

  /**
    * Method to calculate tax amount
    * @param taxableAmount: tax amount
    * @param tax
    * @returns : tax amount
    */
  private _calculateTaxAmount(taxableAmount: number, tax): number {
    if (tax.amount !== undefined) {
      return Number.parseFloat(tax.amount)
    }

    let taxAmount = 0

    if (tax.value === null || tax.value === undefined) {
      return taxAmount;
    }

    switch (tax.type.type) {
      case 'value':
      case 'units':
        taxAmount = tax.amount || tax.value;
        break
      case '%':
      default:
        taxAmount = (taxableAmount / 100) * tax.value;
    }

    return Number.parseFloat(Number(taxAmount).toFixed(2));
  }

  /**
   * Calculate line item amount
   * @param lineItem
   * @returns
   */
  private _calculateLineItemAmount(lineItem: any): void {
    let conversionRatio = 1;

    // if (lineItem.rate.conversion) {
    //   conversionRatio = lineItem.rate.conversion;
    //   this.properties.currency.ratio[lineItem.rate.currency] = conversionRatio;
    // } else
    if (this.properties.currency.ratio[lineItem.rate.currency]) {
      conversionRatio = this.properties.currency.ratio[lineItem.rate.currency];
    } else if (this.properties.currency.name !== lineItem.rate.currency) {
      this.properties.currency.ratio[lineItem.rate.currency] = 1;
    }

    lineItem.taxableAmount = Number.parseFloat((lineItem.units * lineItem.rate.amount * conversionRatio).toFixed(2));

    if (lineItem.taxes?.length) {
      for (let tax of lineItem.taxes) {
        tax.amount = this._calculateTaxAmount(lineItem.taxableAmount, tax);
      }
    }

    lineItem.taxAmount = (lineItem.taxes ||= []).reduce((pre, curr) => pre + curr.amount, 0);
    lineItem.amount = Number.parseFloat((lineItem.taxableAmount + lineItem.taxAmount).toFixed(2));
    this._calculateTotal();
  }

  private _calculateTotal(): void {
    this.total.cgst = this.properties.lineItems.reduce((acc, lineItem) => {
      let tax = lineItem.taxes.find(tax => tax.type.code === 'cgst');
      if (tax) { acc += (tax.amount || 0); }
      return acc;
    }, 0);

    this.total.sgst = this.properties.lineItems.reduce((acc, lineItem) => {
      let tax = lineItem.taxes.find(tax => tax.type.code === 'sgst');
      if (tax) { acc += (tax.amount || 0); }
      return acc;
    }, 0);

    this.total.igst = this.properties.lineItems.reduce((acc, lineItem) => {
      let tax = lineItem.taxes.find(tax => tax.type.code === 'igst');
      if (tax) { acc += (tax.amount || 0); }
      return acc;
    }, 0);

    this.total.ugst = this.properties.lineItems.reduce((acc, lineItem) => {
      let tax = lineItem.taxes.find(tax => tax.type.code === 'ugst');
      if (tax) { acc += (tax.amount || 0); }
      return acc;
    }, 0);

    this.total.taxable = this.properties.lineItems.reduce((acc, lineItem) => acc + (lineItem.taxableAmount || 0), 0);
    this.total.tax = this.properties.lineItems.reduce((acc, lineItem) => acc + (lineItem.taxAmount || 0), 0);

    this.properties.amount = Number.parseFloat((this.total.taxable + this.total.tax).toFixed(2));
    this.properties.taxAmount = this.total.tax;

    this.editorChange.emit(this.properties);
  }

  openCurrencyEditorDialog(): void {
    const dialogRef = this.dialog.open(CurrencyExchangeDialogComponent);
    const component = dialogRef.componentInstance;
    component.currency = JSON.parse(JSON.stringify(this.properties.currency));

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.properties.currency = result
      }
    })
  }

  ngOnDestroy(): void {
    if (!!this.updatedSubscription) this.updatedSubscription.unsubscribe();
  }
}


class TotalAmount {
  tax: number;
  cgst: number;
  sgst: number;
  ugst: number;
  igst: number;
  taxable: number;

  constructor(obj?: any) {
    this.tax = obj?.tax || 0;
    this.cgst = obj?.cgst || 0;
    this.sgst = obj?.sgst || 0;
    this.ugst = obj?.ugst || 0;
    this.igst = obj?.igst || 0;
    this.taxable = obj?.taxable || 0;
  }
}
