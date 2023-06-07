import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TargetWidgetComponent } from './target-widget.component';

describe('TargetWidgetComponent', () => {
  let component: TargetWidgetComponent;
  let fixture: ComponentFixture<TargetWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TargetWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
