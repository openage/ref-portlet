import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubscriptionListComponent } from './subscription-list.component';

describe('SubscriptionListComponent', () => {
  let component: SubscriptionListComponent;
  let fixture: ComponentFixture<SubscriptionListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
