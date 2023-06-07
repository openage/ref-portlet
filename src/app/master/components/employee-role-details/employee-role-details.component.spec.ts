import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRoleDetailsComponent } from './employee-role-details.component';

describe('EmployeeRoleDetailsComponent', () => {
  let component: EmployeeRoleDetailsComponent;
  let fixture: ComponentFixture<EmployeeRoleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeRoleDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeRoleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
