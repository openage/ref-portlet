import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RolePermissionsDialogComponent } from './role-permissions-dialog.component';

describe('RolePermissionsDialogComponent', () => {
  let component: RolePermissionsDialogComponent;
  let fixture: ComponentFixture<RolePermissionsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RolePermissionsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePermissionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
