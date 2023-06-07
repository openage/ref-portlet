import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FileViewDialogComponent } from './file-view-dialog.component';

describe('FileViewDialogComponent', () => {
  let component: FileViewDialogComponent;
  let fixture: ComponentFixture<FileViewDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FileViewDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
