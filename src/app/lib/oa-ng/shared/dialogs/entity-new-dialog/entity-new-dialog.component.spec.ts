import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntityNewDialogComponent } from './entity-new-dialog.component';

describe('EntityNewDialogComponent', () => {
  let component: EntityNewDialogComponent;
  let fixture: ComponentFixture<EntityNewDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityNewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
