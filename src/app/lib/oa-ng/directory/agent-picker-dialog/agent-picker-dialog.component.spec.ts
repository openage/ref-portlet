import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgentPickerDialogComponent } from './agent-picker-dialog.component';

describe('AgentPickerDialogComponent', () => {
  let component: AgentPickerDialogComponent;
  let fixture: ComponentFixture<AgentPickerDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentPickerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentPickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
