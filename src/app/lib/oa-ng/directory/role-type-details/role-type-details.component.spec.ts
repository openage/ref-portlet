import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoleTypeDetailsComponent } from './role-type-details.component';

describe('RoleTypeDetailsComponent', () => {
  let component: RoleTypeDetailsComponent;
  let fixture: ComponentFixture<RoleTypeDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleTypeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
