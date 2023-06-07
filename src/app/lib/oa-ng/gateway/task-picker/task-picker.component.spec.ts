import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPickerComponent } from './task-picker.component';

describe('TaskPickerComponent', () => {
  let component: TaskPickerComponent;
  let fixture: ComponentFixture<TaskPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
