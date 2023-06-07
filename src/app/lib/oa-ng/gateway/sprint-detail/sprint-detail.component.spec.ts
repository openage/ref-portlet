import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SprintDetailComponent } from 'src/app/lib/oa-ng/gateway/sprint-detail/sprint-detail.component';

describe('SprintDetailComponent', () => {
  let component: SprintDetailComponent;
  let fixture: ComponentFixture<SprintDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SprintDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
