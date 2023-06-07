import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportDownloadButtonComponent } from './report-download-button.component';

describe('ReportDownloadButtonComponent', () => {
  let component: ReportDownloadButtonComponent;
  let fixture: ComponentFixture<ReportDownloadButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDownloadButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDownloadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
