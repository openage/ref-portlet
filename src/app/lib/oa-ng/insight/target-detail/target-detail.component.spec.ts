import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TargetDetailComponent } from './target-detail.component';

describe('TargetDetailComponent', () => {
  let component: TargetDetailComponent;
  let fixture: ComponentFixture<TargetDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
