import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BillingEntityPickerComponent } from './billing-entity-picker.component';

describe('BillingEntityPickerComponent', () => {
  let component: BillingEntityPickerComponent;
  let fixture: ComponentFixture<BillingEntityPickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingEntityPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingEntityPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
