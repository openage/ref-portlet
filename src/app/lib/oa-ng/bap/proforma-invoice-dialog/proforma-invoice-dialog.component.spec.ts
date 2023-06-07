import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaInvoiceDialogComponent } from './proforma-invoice-dialog.component';

describe('ProformaInvoiceDialogComponent', () => {
  let component: ProformaInvoiceDialogComponent;
  let fixture: ComponentFixture<ProformaInvoiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaInvoiceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaInvoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
