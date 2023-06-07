import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JsonEditorDialogComponent } from './json-editor-dialog.component';

describe('JsonEditorDialogComponent', () => {
  let component: JsonEditorDialogComponent;
  let fixture: ComponentFixture<JsonEditorDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonEditorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
