import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountJournalNewComponent } from './account-journal-new.component';

describe('AccountJournalNewComponent', () => {
  let component: AccountJournalNewComponent;
  let fixture: ComponentFixture<AccountJournalNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountJournalNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountJournalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
