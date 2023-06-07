import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FileUploaderZoneComponent } from './file-uploader-zone.component';

describe('FileUploaderZoneComponent', () => {
  let component: FileUploaderZoneComponent;
  let fixture: ComponentFixture<FileUploaderZoneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploaderZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploaderZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
