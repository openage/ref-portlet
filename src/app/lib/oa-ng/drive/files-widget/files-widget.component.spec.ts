import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FilesWidgetComponent } from 'src/app/lib/oa-ng/drive/files-widget/files-widget.component';

describe('FilesWidgetComponent', () => {
  let component: FilesWidgetComponent;
  let fixture: ComponentFixture<FilesWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FilesWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
