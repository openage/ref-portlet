import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FolderSideDetailComponent } from './folder-side-detail.component';

describe('FolderSideDetailComponent', () => {
  let component: FolderSideDetailComponent;
  let fixture: ComponentFixture<FolderSideDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderSideDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderSideDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
