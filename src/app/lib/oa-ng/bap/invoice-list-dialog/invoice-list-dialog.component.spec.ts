import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoiceListDialogComponent } from './invoice-list-dialog.component';

describe('InvoiceListDialogComponent', () => {
  let component: InvoiceListDialogComponent;
  let fixture: ComponentFixture<InvoiceListDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceListDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
