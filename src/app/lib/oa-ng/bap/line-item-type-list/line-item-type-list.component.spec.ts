import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineItemTypeListComponent } from './line-item-type-list.component';

describe('LineItemTypeListComponent', () => {
  let component: LineItemTypeListComponent;
  let fixture: ComponentFixture<LineItemTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineItemTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
