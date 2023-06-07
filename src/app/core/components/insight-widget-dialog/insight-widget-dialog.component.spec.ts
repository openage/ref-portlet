import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightWidgetDialogComponent } from './insight-widget-dialog.component';

describe('InsightWidgetDialogComponent', () => {
  let component: InsightWidgetDialogComponent;
  let fixture: ComponentFixture<InsightWidgetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsightWidgetDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightWidgetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
