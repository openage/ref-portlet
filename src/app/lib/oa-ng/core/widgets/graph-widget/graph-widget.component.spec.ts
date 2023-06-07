import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GraphWidgetComponent } from './graph-widget.component';

describe('GraphWidgetComponent', () => {
  let component: GraphWidgetComponent;
  let fixture: ComponentFixture<GraphWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GraphWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
