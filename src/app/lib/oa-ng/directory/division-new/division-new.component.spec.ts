import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DivisionNewComponent } from './division-new.component';

describe('DivisionNewComponent', () => {
  let component: DivisionNewComponent;
  let fixture: ComponentFixture<DivisionNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisionNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
