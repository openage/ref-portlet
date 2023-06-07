import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FileSideDetailComponent } from './file-side-detail.component';

describe('FileSideDetailComponent', () => {
  let component: FileSideDetailComponent;
  let fixture: ComponentFixture<FileSideDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FileSideDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSideDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
