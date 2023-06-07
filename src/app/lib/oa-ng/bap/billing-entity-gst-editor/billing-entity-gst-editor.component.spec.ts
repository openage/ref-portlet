import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BillingEntityGstEditorComponent } from './billing-entity-gst-editor.component';

describe('BillingEntityGstEditorComponent', () => {
  let component: BillingEntityGstEditorComponent;
  let fixture: ComponentFixture<BillingEntityGstEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingEntityGstEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingEntityGstEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
