import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FolderEditComponent } from './folder-edit.component';

describe('FolderEditComponent', () => {
  let component: FolderEditComponent;
  let fixture: ComponentFixture<FolderEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
