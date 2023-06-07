import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BillingEntityDialogComponent } from './billing-entity-dialog.component';

describe('BillingEntityDialogComponent', () => {
  let component: BillingEntityDialogComponent;
  let fixture: ComponentFixture<BillingEntityDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingEntityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingEntityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
