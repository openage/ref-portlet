import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemplateUploaderComponent } from './template-uploader.component';

describe('TemplateUploaderComponent', () => {
  let component: TemplateUploaderComponent;
  let fixture: ComponentFixture<TemplateUploaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateUploaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
