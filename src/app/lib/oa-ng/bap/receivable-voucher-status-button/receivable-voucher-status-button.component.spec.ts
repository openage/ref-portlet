import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableVoucherStatusButtonComponent } from './receivable-voucher-status-button.component';

describe('ReceivableVoucherStatusButtonComponent', () => {
  let component: ReceivableVoucherStatusButtonComponent;
  let fixture: ComponentFixture<ReceivableVoucherStatusButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivableVoucherStatusButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivableVoucherStatusButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
