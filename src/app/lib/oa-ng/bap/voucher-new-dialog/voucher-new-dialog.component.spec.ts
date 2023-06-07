import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherNewDialogComponent } from './voucher-new-dialog.component';

describe('VoucherNewDialogComponent', () => {
  let component: VoucherNewDialogComponent;
  let fixture: ComponentFixture<VoucherNewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherNewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
