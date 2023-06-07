import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PieChartWidgetComponent } from './pie-chart-widget.component';

describe('PieChartWidgetComponent', () => {
  let component: PieChartWidgetComponent;
  let fixture: ComponentFixture<PieChartWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PieChartWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
