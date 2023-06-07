import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountJournalListComponent } from './account-journal-list.component';

describe('AccountJournalListComponent', () => {
  let component: AccountJournalListComponent;
  let fixture: ComponentFixture<AccountJournalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountJournalListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountJournalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
