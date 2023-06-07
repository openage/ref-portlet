import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeatMapMonthComponent } from './heat-map-month.component';

describe('HeatMapMonthComponent', () => {
  let component: HeatMapMonthComponent;
  let fixture: ComponentFixture<HeatMapMonthComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeatMapMonthComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
