import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDetailDialogComponent } from './bank-detail-dialog.component';

describe('BankDetailDialogComponent', () => {
  let component: BankDetailDialogComponent;
  let fixture: ComponentFixture<BankDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankDetailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
