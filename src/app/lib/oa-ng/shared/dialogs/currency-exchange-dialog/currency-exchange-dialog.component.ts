import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-currency-exchange-dialog',
  templateUrl: './currency-exchange-dialog.component.html',
  styleUrls: ['./currency-exchange-dialog.component.css']
})
export class CurrencyExchangeDialogComponent implements OnInit {

  list = [
    { code: 'INR', name: 'INR' },
    { code: 'USD', name: 'USD' },
    { code: 'EUR', name: 'EUR' },
    { code: 'GBP', name: 'GBP' },
    { code: 'AED', name: 'AED' },
    { code: 'BHD', name: 'BHD' },
    { code: 'CHF', name: 'CHF' },
    { code: 'CNY', name: 'CNY' },
    { code: 'XOF', name: 'XOF' },
    { code: 'JPY', name: 'JPY' },
    { code: 'HKD', name: 'HKD' },
    { code: 'IDR', name: 'IDR' },
    { code: 'AUD', name: 'AUD' }
  ]

  @Input()
  currency: any;

  @Output()
  currencyChange: EventEmitter<any> = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.currency.ratio ||= {};
  }

  onCancel() {
    this.dialogRef.close();
  }

  onCurrencyCodeChange(value): void {
    this.currency.name = value;
    this.currency.code = value;
  }

  onRatioKeyChange(oldKey, newKey): void {
    this.currency.ratio[newKey] = this.currency.ratio[oldKey];
    delete this.currency.ratio[oldKey];
  }

  onRatioValueChange(key, value): void {
    this.currency.ratio[key] = parseFloat(value);
  }

  addNewRatioKey(key): void {
    this.currency.ratio[key] = 1;
  }

  onSave(): void {
    this.dialogRef.close(this.currency);
  }
}
