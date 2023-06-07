import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReleaseButtonComponent } from './release-button.component';

describe('ReleaseButtonComponent', () => {
  let component: ReleaseButtonComponent;
  let fixture: ComponentFixture<ReleaseButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
