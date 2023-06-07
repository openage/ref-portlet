import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportTypePickerComponent } from './report-type-picker.component';

describe('ReportTypePickerComponent', () => {
  let component: ReportTypePickerComponent;
  let fixture: ComponentFixture<ReportTypePickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReportTypePickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTypePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
