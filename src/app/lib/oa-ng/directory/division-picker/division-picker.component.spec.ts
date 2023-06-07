import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DivisionPickerComponent } from './division-picker.component';

describe('DivisionPickerComponent', () => {
  let component: DivisionPickerComponent;
  let fixture: ComponentFixture<DivisionPickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisionPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
