import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceHelperService {
  private _maxTaxPercentage = 18.5;

  private _invoiceType = [
    { name: 'Tax Invoice', code: 'tax' },
    { name: 'Debit Invoice', code: 'debit' },
    { name: 'Credit Invoice', code: 'credit' },
    { name: 'Proforma Invoice', code: 'proforma' },
    { name: 'Bill Of Supply', code: 'billOfSupply' }
  ];

  private _reasonTypes = [
    { code: 'lbc', text: 'Late Documentation charges (LBC)' },
    { code: 'detention', text: 'Detention in case of Telex Release Delay on Import Shipment' },
    { code: 'opsfailure', text: 'Operational Failure', },
    { code: 'transport', text: 'Transport', },
  ];

  private _customerCreditReasons = [
    { code: 'operation', text: 'Operation' },
    { code: 'pricing', text: 'Pricing' },
    { code: 'sales', text: 'Self (Sales)' }
  ]

  constructor(
    private uxService: UxService,
  ) { }

  public get invoiceType() {
    return this._invoiceType;
  }

  public get reasonTypes() {
    return this._reasonTypes;
  }

  public get customerCreditReasons() {
    return this._customerCreditReasons;
  }

  public validate(invoice): boolean {
    let isValid = true;
    const errors = []

    if (!invoice.date) {
      errors.push(`Invoice date is required`);
    }

    if (!invoice.receivedDate && invoice.isPayable) {
      errors.push(`Invoice received Date is required`);
    }

    if (invoice.isPayable) {
      if (!invoice.code && invoice.type !== 'proforma') {
        errors.push(`Invoice number is required`);
      }

      if (invoice.amountOnInvoice) {
        const diff = invoice.amountOnInvoice - invoice.amount;
        if (diff > 1 || diff < -1) {
          errors.push(`The amount of the line item's must match the amount of the invoice`);
        }
      } else {
        errors.push(`Amount On Invoice is required`);
      }

      if (invoice.billToCustomer == null || invoice.billToCustomer == undefined) {
        errors.push(`Payment request type is required`);
      }

      if (invoice.billToCustomer == false && !invoice.meta?.reasonType) {
        errors.push(`Reason is required`);
      }

      if (invoice.meta?.reasonType && !invoice.meta?.reason) {
        errors.push(`Please explain reason`);
      }
    }

    if (!invoice.isPayable) {
      if (invoice.type == 'credit' && !invoice.meta?.reasonType) {
        errors.push(`Reason is required`);
      }

      if (invoice.meta?.reasonType && !invoice.meta?.reason) {
        errors.push(`Please explain reason`);
      }
    }

    if (invoice.lineItems.length) {
      for (let lineItem of invoice.lineItems) {
        const taxPercentage = (lineItem.taxAmount / lineItem.taxableAmount) * 100;
        if (taxPercentage > this._maxTaxPercentage) {
          errors.push(`Tax amount ${lineItem.taxAmount} can not be greater than ${this._maxTaxPercentage
            }% of taxable amount ${lineItem.taxableAmount}`);
        }
      }
    } else {
      errors.push(`At least one line item must be specified`);
    }

    if (errors.length) {
      isValid = false;
    }

    if (!isValid) {
      this.uxService.showError(errors);
    }

    return isValid;
  }
}
