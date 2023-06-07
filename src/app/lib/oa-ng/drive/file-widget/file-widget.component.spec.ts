import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FileWidgetComponent } from 'src/app/lib/oa-ng/drive/file-widget/file-widget.component';

describe('FileWidgetComponent', () => {
  let component: FileWidgetComponent;
  let fixture: ComponentFixture<FileWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FileWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
