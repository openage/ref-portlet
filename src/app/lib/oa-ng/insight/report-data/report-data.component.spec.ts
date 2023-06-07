import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReportDataComponent } from './report-data.component';

describe('ReportDataComponent', () => {
  let component: ReportDataComponent;
  let fixture: ComponentFixture<ReportDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
