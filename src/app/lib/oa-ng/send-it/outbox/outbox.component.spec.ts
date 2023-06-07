import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutboxComponent } from './outbox.component';

describe('OutboxComponent', () => {
  let component: OutboxComponent;
  let fixture: ComponentFixture<OutboxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
