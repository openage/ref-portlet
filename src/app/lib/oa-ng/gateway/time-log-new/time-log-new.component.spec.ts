import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLogNewComponent } from './time-log-new.component';

describe('TimeLogNewComponent', () => {
  let component: TimeLogNewComponent;
  let fixture: ComponentFixture<TimeLogNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeLogNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLogNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
