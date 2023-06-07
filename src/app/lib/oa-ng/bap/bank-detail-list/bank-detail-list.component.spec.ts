import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDetailListComponent } from './bank-detail-list.component';

describe('BankDetailListComponent', () => {
  let component: BankDetailListComponent;
  let fixture: ComponentFixture<BankDetailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankDetailListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
