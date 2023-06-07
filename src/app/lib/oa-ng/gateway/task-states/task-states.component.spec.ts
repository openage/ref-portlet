import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TaskStatesComponent } from './task-states.component';

describe('TaskStateSummaryComponent', () => {
  let component: TaskStatesComponent;
  let fixture: ComponentFixture<TaskStatesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TaskStatesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
