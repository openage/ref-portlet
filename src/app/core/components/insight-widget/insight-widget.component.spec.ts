import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightWidgetComponent } from './insight-widget.component';

describe('InsightWidgetComponent', () => {
  let component: InsightWidgetComponent;
  let fixture: ComponentFixture<InsightWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsightWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
