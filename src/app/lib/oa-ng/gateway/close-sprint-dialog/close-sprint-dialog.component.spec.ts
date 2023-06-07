import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseSprintDialogComponent } from './close-sprint-dialog.component';

describe('CloseSprintDialogComponent', () => {
  let component: CloseSprintDialogComponent;
  let fixture: ComponentFixture<CloseSprintDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseSprintDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseSprintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
