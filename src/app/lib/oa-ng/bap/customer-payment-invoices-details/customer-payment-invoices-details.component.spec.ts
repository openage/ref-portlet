import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentInvoicesDetailsComponent } from './customer-payment-invoices-details.component';

describe('CustomerPaymentInvoicesDetailsComponent', () => {
  let component: CustomerPaymentInvoicesDetailsComponent;
  let fixture: ComponentFixture<CustomerPaymentInvoicesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerPaymentInvoicesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPaymentInvoicesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
