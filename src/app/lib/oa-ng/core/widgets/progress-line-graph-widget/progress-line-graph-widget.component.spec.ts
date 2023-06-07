import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProgressLineGraphWidgetComponent } from './progress-line-graph-widget.component';

describe('ProgressLineGraphWidgetComponent', () => {
  let component: ProgressLineGraphWidgetComponent;
  let fixture: ComponentFixture<ProgressLineGraphWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressLineGraphWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressLineGraphWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
