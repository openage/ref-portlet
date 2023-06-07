import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TargetNewDialogComponent } from './target-new-dialog.component';

describe('TargetNewDialogComponent', () => {
  let component: TargetNewDialogComponent;
  let fixture: ComponentFixture<TargetNewDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetNewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
