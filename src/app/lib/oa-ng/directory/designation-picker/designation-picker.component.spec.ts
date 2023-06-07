import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DesignationPickerComponent } from './designation-picker.component';

describe('DesignationPickerComponent', () => {
  let component: DesignationPickerComponent;
  let fixture: ComponentFixture<DesignationPickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignationPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
