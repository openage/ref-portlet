import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewTaskDialogComponent } from './new-task-dialog.component';

describe('NewTaskDialogComponent', () => {
  let component: NewTaskDialogComponent;
  let fixture: ComponentFixture<NewTaskDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NewTaskDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
