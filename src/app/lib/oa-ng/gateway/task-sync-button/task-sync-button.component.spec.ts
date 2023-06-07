import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskSyncButtonComponent } from './task-sync-button.component';

describe('TaskSyncButtonComponent', () => {
  let component: TaskSyncButtonComponent;
  let fixture: ComponentFixture<TaskSyncButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskSyncButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSyncButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
