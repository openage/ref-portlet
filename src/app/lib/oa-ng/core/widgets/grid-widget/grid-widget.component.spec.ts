import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GridWidgetComponent } from './grid-widget.component';

describe('GridWidgetComponent', () => {
  let component: GridWidgetComponent;
  let fixture: ComponentFixture<GridWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GridWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
