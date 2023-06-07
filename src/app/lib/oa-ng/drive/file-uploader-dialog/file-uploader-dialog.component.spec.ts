import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FileUploaderDialogComponent } from './file-uploader-dialog.component';

describe('FileUploaderDialogComponent', () => {
  let component: FileUploaderDialogComponent;
  let fixture: ComponentFixture<FileUploaderDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploaderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploaderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
