import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SenditOrganizationDetailsComponent } from './organization-details.component';

describe('SenditOrganizationDetailsComponent', () => {
  let component: SenditOrganizationDetailsComponent;
  let fixture: ComponentFixture<SenditOrganizationDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SenditOrganizationDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenditOrganizationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
