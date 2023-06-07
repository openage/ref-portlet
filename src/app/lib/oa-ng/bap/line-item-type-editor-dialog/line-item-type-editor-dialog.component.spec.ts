import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineItemTypeEditorDialogComponent } from './line-item-type-editor-dialog.component';

describe('LineItemTypeEditorDialogComponent', () => {
  let component: LineItemTypeEditorDialogComponent;
  let fixture: ComponentFixture<LineItemTypeEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineItemTypeEditorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemTypeEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
