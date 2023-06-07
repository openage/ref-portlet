import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ThumbnailSelectorComponent } from './thumbnail-selector.component';

describe('ThumbnailSelectorComponent', () => {
  let component: ThumbnailSelectorComponent;
  let fixture: ComponentFixture<ThumbnailSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbnailSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
