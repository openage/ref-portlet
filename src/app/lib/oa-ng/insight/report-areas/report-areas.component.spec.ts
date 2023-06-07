import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportAreasComponent } from './report-areas.component';

describe('ReportAreasComponent', () => {
  let component: ReportAreasComponent;
  let fixture: ComponentFixture<ReportAreasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAreasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
