import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IconTogglerComponent } from './icon-toggler.component';

describe('IconTogglerComponent', () => {
  let component: IconTogglerComponent;
  let fixture: ComponentFixture<IconTogglerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IconTogglerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
