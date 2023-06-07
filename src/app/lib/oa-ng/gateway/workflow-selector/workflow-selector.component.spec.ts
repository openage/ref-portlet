import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkflowSelectorComponent } from './workflow-selector.component';

describe('WorkflowSelectorComponent', () => {
  let component: WorkflowSelectorComponent;
  let fixture: ComponentFixture<WorkflowSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowSelectorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
