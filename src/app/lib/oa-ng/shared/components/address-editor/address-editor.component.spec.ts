import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddressEditorComponent } from './address-editor.component';

describe('AddressEditorComponent', () => {
  let component: AddressEditorComponent;
  let fixture: ComponentFixture<AddressEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
