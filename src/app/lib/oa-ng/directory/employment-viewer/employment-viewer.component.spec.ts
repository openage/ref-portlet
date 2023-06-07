import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EmploymentViewerComponent } from './employment-viewer.component';

describe('EmploymentViewerComponent', () => {
  let component: EmploymentViewerComponent;
  let fixture: ComponentFixture<EmploymentViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmploymentViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploymentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
