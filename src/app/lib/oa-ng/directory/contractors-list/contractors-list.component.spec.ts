import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractorsListComponent } from './contractors-list.component';

describe('ContractorsListComponent', () => {
  let component: ContractorsListComponent;
  let fixture: ComponentFixture<ContractorsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractorsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
