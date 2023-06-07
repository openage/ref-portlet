import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisplayImageDialogComponent } from './display-image-dialog.component';

describe('DisplayImageDialogComponent', () => {
  let component: DisplayImageDialogComponent;
  let fixture: ComponentFixture<DisplayImageDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayImageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
