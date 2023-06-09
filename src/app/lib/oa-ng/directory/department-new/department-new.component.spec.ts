import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DepartmentNewComponent } from './department-new.component';

describe('DepartmentNewComponent', () => {
  let component: DepartmentNewComponent;
  let fixture: ComponentFixture<DepartmentNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
