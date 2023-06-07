import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BillingEntityListComponent } from './billing-entity-list.component';

describe('BillingEntityListComponent', () => {
  let component: BillingEntityListComponent;
  let fixture: ComponentFixture<BillingEntityListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingEntityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingEntityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
