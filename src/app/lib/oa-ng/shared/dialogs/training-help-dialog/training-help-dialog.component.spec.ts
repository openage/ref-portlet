import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrainingHelpDialogComponent } from './training-help-dialog.component';

describe('TrainingHelpDialogComponent', () => {
  let component: TrainingHelpDialogComponent;
  let fixture: ComponentFixture<TrainingHelpDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingHelpDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
