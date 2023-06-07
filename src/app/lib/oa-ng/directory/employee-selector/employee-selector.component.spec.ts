import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeSelectorComponent } from './employee-selector.component';

describe('EmployeeSelectorComponent', () => {
  let component: EmployeeSelectorComponent;
  let fixture: ComponentFixture<EmployeeSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeSelectorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
