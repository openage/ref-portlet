import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReleaseOngoingListComponent } from './release-ongoing-list.component';

describe('ReleaseOngoingListComponent', () => {
  let component: ReleaseOngoingListComponent;
  let fixture: ComponentFixture<ReleaseOngoingListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseOngoingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseOngoingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
