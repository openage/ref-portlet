import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LineItemsEditorComponent } from './line-items-editor.component';

describe('LineItemsEditorComponent', () => {
  let component: LineItemsEditorComponent;
  let fixture: ComponentFixture<LineItemsEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineItemsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
