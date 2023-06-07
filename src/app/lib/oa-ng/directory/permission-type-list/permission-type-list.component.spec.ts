import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PermissionTypeListComponent } from './permission-type-list.component';

describe('PermissionTypeListComponent', () => {
  let component: PermissionTypeListComponent;
  let fixture: ComponentFixture<PermissionTypeListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
