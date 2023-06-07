import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentInvoicesComponent } from './customer-payment-invoices.component';

describe('CustomerPaymentInvoicesComponent', () => {
  let component: CustomerPaymentInvoicesComponent;
  let fixture: ComponentFixture<CustomerPaymentInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerPaymentInvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPaymentInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
