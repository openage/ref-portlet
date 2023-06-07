import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogListComponent } from './log-list.component';

describe('LogListComponent', () => {
  let component: LogListComponent;
  let fixture: ComponentFixture<LogListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LogListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
