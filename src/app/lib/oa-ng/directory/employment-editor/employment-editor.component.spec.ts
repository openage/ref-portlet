import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmploymentEditorComponent } from './employment-editor.component';

describe('EmploymentEditorComponent', () => {
  let component: EmploymentEditorComponent;
  let fixture: ComponentFixture<EmploymentEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmploymentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploymentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
