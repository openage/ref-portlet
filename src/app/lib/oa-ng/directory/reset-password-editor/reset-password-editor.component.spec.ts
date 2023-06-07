import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

// import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordEditorComponent } from './reset-password-editor.component';

describe('resetpasswordeditorcomponent', () => {
  let component: ResetPasswordEditorComponent;
  let fixture: ComponentFixture<ResetPasswordEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
