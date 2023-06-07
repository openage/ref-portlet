import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DualBarWidgetComponent } from './dual-bar-widget.component';

describe('DualBarWidgetComponent', () => {
  let component: DualBarWidgetComponent;
  let fixture: ComponentFixture<DualBarWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DualBarWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DualBarWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
