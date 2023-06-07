import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FolderWidgetComponent } from 'src/app/lib/oa-ng/drive/folder-widget/folder-widget.component';

describe('FolderWidgetComponent', () => {
  let component: FolderWidgetComponent;
  let fixture: ComponentFixture<FolderWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FolderWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
