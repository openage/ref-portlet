import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { DateService } from 'src/app/lib/oa/core/services';
import { Link } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})
export class InboxComponent implements OnInit {

  isCurrent = true;
  isSearching = false;
  page: Link;

  fromDate: Date;
  toDate: Date;
  selectedSubject: string;
  selectedCategory: string;
  unreadOnly = false;

  constructor(
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute,
    private dateService: DateService
  ) {
    this.navService.register(
      '/home/inbox',
      this.route,
      (isCurrent, params) => {
        this.isCurrent = isCurrent;
        if (this.isCurrent) {
          this.setContext();
          this.setSearchParams();
        }
      }
    ).then((link) => this.page = link);
  }

  ngOnInit() {
    this.uxService.onSearch.subscribe((query) => {
      this.onSearch(query);
    })
  }

  setSearchParams() {
    this.uxService.setSearchParams(this.page.meta.search);
  }

  ngOnDestroy(): void {
    this.uxService.reset();
  }

  setContext() {
    this.uxService.setContextMenu([
      {
        title: 'Unread Only',
        type: 'toggle',
        value: this.unreadOnly,
        event: (value: boolean) => {
          this.unreadOnly = value;
        }
      },
      {
        helpCode: this.page.meta.helpCode,
      },
      'close',
    ]);
  }

  onSearch(query: any) {
    if (query.dateFrom) {
      this.fromDate = this.dateService.date(query.dateFrom).bod();
    } else {
      this.fromDate = null;
    }

    if (query.dateTill) {
      this.toDate = this.dateService.date(query.dateTill).eod();
    } else {
      this.toDate = null;
    }

    this.selectedSubject = query.subject;
    this.selectedCategory = query.category;
  }

  onSelect($event) {
    this.navService.goto(`/home/inbox/${$event.id}`);
    this.uxService.resetSearchParams();
  }
}
