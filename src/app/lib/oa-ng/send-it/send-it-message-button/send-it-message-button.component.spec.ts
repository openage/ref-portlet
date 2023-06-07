import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendItMessageButtonComponent } from './send-it-message-button.component';

describe('SendItMessageButtonComponent', () => {
  let component: SendItMessageButtonComponent;
  let fixture: ComponentFixture<SendItMessageButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendItMessageButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendItMessageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
