import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkspaceStepperComponent } from './workspace-stepper.component';

describe('WorkspaceStepperComponent', () => {
  let component: WorkspaceStepperComponent;
  let fixture: ComponentFixture<WorkspaceStepperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WorkspaceStepperComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
