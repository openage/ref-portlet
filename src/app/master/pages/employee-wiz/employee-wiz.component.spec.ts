import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeWizComponent } from './employee-wiz.component';

describe('EmployeeWizComponent', () => {
  let component: EmployeeWizComponent;
  let fixture: ComponentFixture<EmployeeWizComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeWizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
