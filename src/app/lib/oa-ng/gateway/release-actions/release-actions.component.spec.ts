import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseActionsComponent } from './release-actions.component';

describe('ReleaseActionsComponent', () => {
  let component: ReleaseActionsComponent;
  let fixture: ComponentFixture<ReleaseActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleaseActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
