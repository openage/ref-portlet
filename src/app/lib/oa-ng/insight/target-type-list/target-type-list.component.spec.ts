import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TargetTypeListComponent } from './target-type-list.component';

describe('TargetTypeListComponent', () => {
  let component: TargetTypeListComponent;
  let fixture: ComponentFixture<TargetTypeListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TargetTypeListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
