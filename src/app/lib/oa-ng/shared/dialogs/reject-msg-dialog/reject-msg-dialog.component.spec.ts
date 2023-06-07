import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RejectMsgDialogComponent } from './reject-msg-dialog.component';

describe('RejectMsgDialogComponent', () => {
  let component: RejectMsgDialogComponent;
  let fixture: ComponentFixture<RejectMsgDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectMsgDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectMsgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
