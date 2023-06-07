import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskStatusBarComponent } from './task-status-bar.component';

describe('TaskStatusBarComponent', () => {
  let component: TaskStatusBarComponent;
  let fixture: ComponentFixture<TaskStatusBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskStatusBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskStatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
