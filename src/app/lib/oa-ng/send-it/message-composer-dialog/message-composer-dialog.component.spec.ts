import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MessageComposerDialogComponent } from './message-composer-dialog.component';

describe('MessagePreviewComponent', () => {
  let component: MessageComposerDialogComponent;
  let fixture: ComponentFixture<MessageComposerDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MessageComposerDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComposerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
