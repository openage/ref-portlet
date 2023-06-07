import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeatMapWidgetComponent } from './heat-map-widget.component';

describe('HeatMapWidgetComponent', () => {
  let component: HeatMapWidgetComponent;
  let fixture: ComponentFixture<HeatMapWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeatMapWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
