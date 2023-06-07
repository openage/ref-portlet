import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoleTypePickerComponent } from './role-type-picker.component';

describe('RoleTypePickerComponent', () => {
  let component: RoleTypePickerComponent;
  let fixture: ComponentFixture<RoleTypePickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleTypePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleTypePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
