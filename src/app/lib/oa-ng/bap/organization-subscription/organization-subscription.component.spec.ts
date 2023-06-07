import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganizationSubscriptionComponent } from './organization-subscription.component';

describe('OrganizationSubscriptionComponent', () => {
  let component: OrganizationSubscriptionComponent;
  let fixture: ComponentFixture<OrganizationSubscriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
