import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocViewDialogComponent } from './doc-view-dialog.component';

describe('DocViewDialogComponent', () => {
  let component: DocViewDialogComponent;
  let fixture: ComponentFixture<DocViewDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
