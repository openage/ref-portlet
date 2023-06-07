import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagTypesSelectorComponent } from './tag-types-selector.component';

describe('TagTypesSelectorComponent', () => {
  let component: TagTypesSelectorComponent;
  let fixture: ComponentFixture<TagTypesSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TagTypesSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagTypesSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
