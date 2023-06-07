import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewProjectDialogComponent } from './new-project-dialog.component';

describe('NewProjectDialogComponent', () => {
  let component: NewProjectDialogComponent;
  let fixture: ComponentFixture<NewProjectDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProjectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
