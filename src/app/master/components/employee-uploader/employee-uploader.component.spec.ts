import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeUploaderComponent } from './employee-uploader.component';

describe('EmployeeUploaderComponent', () => {
  let component: EmployeeUploaderComponent;
  let fixture: ComponentFixture<EmployeeUploaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
