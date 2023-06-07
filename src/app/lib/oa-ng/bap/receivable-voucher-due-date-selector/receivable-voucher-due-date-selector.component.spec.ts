import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableVoucherDueDateSelectorComponent } from './receivable-voucher-due-date-selector.component';

describe('ReceivableVoucherDueDateSelectorComponent', () => {
  let component: ReceivableVoucherDueDateSelectorComponent;
  let fixture: ComponentFixture<ReceivableVoucherDueDateSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivableVoucherDueDateSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivableVoucherDueDateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
