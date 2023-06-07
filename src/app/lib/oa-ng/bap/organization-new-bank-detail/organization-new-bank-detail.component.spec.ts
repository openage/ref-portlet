import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganizationNewBankDetailComponent } from './organization-new-bank-detail.component';

describe('OrganizationNewBankDetailComponent', () => {
  let component: OrganizationNewBankDetailComponent;
  let fixture: ComponentFixture<OrganizationNewBankDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationNewBankDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationNewBankDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
