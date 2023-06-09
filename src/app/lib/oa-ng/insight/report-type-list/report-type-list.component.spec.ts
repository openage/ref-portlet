import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportTypeListComponent } from './report-type-list.component';

describe('ReportTypeListComponent', () => {
  let component: ReportTypeListComponent;
  let fixture: ComponentFixture<ReportTypeListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
