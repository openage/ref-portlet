import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemplatesSubscriptionComponent } from './templates-subscription.component';

describe('TemplatesSubscriptionComponent', () => {
  let component: TemplatesSubscriptionComponent;
  let fixture: ComponentFixture<TemplatesSubscriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TemplatesSubscriptionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
