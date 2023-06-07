import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarGraphWidgetComponent } from './bar-graph-widget.component';

describe('BarGraphWidgetComponent', () => {
  let component: BarGraphWidgetComponent;
  let fixture: ComponentFixture<BarGraphWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarGraphWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarGraphWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
