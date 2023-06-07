import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeesViewComponent } from './employees-view.component';

describe('EmployeesViewComponent', () => {
  let component: EmployeesViewComponent;
  let fixture: ComponentFixture<EmployeesViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
