import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeSummaryComponent } from './employee-summary.component';

describe('EmployeeSummaryComponent', () => {
  let component: EmployeeSummaryComponent;
  let fixture: ComponentFixture<EmployeeSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});