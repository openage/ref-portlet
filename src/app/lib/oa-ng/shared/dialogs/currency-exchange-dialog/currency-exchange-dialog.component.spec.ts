import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyExchangeDialogComponent } from './currency-exchange-dialog.component';

describe('CurrencyExchangeDialogComponent', () => {
  let component: CurrencyExchangeDialogComponent;
  let fixture: ComponentFixture<CurrencyExchangeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyExchangeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyExchangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
