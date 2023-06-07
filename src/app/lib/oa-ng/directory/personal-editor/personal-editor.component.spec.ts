import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonalEditorComponent } from './personal-editor.component';

describe('PersonalEditorComponent', () => {
  let component: PersonalEditorComponent;
  let fixture: ComponentFixture<PersonalEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
