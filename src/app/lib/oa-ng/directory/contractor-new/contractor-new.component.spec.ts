import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractorNewComponent } from './contractor-new.component';

describe('ContractorNewComponent', () => {
  let component: ContractorNewComponent;
  let fixture: ComponentFixture<ContractorNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractorNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
