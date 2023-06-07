import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DesignationNewComponent } from './designation-new.component';

describe('DesignationNewComponent', () => {
  let component: DesignationNewComponent;
  let fixture: ComponentFixture<DesignationNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignationNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
