import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewDivisionComponent } from './new-division.component';

describe('NewDivisionComponent', () => {
  let component: NewDivisionComponent;
  let fixture: ComponentFixture<NewDivisionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
