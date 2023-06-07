import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubscriptionDialogComponent } from './subscription-dialog.component';

describe('SubscriptionDialogComponent', () => {
  let component: SubscriptionDialogComponent;
  let fixture: ComponentFixture<SubscriptionDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
