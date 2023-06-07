import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FoldersWidgetComponent } from 'src/app/lib/oa-ng/core/folders-widget/folders-widget.component';

describe('FoldersWidgetComponent', () => {
  let component: FoldersWidgetComponent;
  let fixture: ComponentFixture<FoldersWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FoldersWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoldersWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
