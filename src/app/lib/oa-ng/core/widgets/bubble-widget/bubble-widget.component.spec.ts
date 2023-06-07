import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BubbleWidgetComponent } from './bubble-widget.component';

describe('BubbleWidgetComponent', () => {
  let component: BubbleWidgetComponent;
  let fixture: ComponentFixture<BubbleWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BubbleWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
