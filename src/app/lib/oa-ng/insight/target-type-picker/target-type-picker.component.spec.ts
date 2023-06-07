import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TargetTypePickerComponent } from './target-type-picker.component';

describe('TargetTypePickerComponent', () => {
  let component: TargetTypePickerComponent;
  let fixture: ComponentFixture<TargetTypePickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetTypePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetTypePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
