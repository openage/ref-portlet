import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BillingEntityDetailsComponent } from './billing-entity-details.component';

describe('BillingEntityDetailsComponent', () => {
  let component: BillingEntityDetailsComponent;
  let fixture: ComponentFixture<BillingEntityDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingEntityDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingEntityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
