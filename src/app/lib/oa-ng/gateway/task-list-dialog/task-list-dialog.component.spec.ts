import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskListDialogComponent } from './task-list-dialog.component';

describe('TaskListDialogComponent', () => {
  let component: TaskListDialogComponent;
  let fixture: ComponentFixture<TaskListDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TaskListDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
