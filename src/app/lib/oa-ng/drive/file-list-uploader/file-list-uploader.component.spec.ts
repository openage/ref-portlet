import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FileListUploaderComponent } from './file-list-uploader.component';

describe('FileListUploaderComponent', () => {
  let component: FileListUploaderComponent;
  let fixture: ComponentFixture<FileListUploaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FileListUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileListUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
