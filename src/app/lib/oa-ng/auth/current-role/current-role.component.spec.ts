import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CurrentRoleComponent } from './current-role.component';

describe('CurrentRoleComponent', () => {
  let component: CurrentRoleComponent;
  let fixture: ComponentFixture<CurrentRoleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
