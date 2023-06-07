import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageDivsComponent } from './page-divs.component';

describe('PageDivsComponent', () => {
  let component: PageDivsComponent;
  let fixture: ComponentFixture<PageDivsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageDivsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDivsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
