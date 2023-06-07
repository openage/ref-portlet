import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseNewComponent } from './release-new.component';

describe('ReleaseNewComponent', () => {
  let component: ReleaseNewComponent;
  let fixture: ComponentFixture<ReleaseNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleaseNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
