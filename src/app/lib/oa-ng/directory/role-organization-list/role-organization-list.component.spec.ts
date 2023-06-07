import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoleOrganizationListComponent } from './role-organization-list.component';

describe('RoleOrganizationListComponent', () => {
  let component: RoleOrganizationListComponent;
  let fixture: ComponentFixture<RoleOrganizationListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleOrganizationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleOrganizationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
