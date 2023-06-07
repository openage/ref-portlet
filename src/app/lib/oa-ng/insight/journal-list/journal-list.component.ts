import { Component, EventEmitter, Input, Output, Pipe } from '@angular/core';
import * as moment from 'moment';
import { UxService } from 'src/app/core/services/ux.service';
import { NavService } from 'src/app/core/services/nav.service';
import { JournalListBaseComponent } from 'src/app/lib/oa/insight/components/journal-list.base.component';
import { JournalService } from 'src/app/lib/oa/insight/services/journal.service';

@Component({
  selector: 'insight-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.css']
})
export class JournalListComponent extends JournalListBaseComponent {
  @Input()
  view: 'list' | 'expansion' | 'table' = 'list';

  journalList: any[] = [];
  columnData: any[] = ['date', 'user', 'action', 'entity'];
  style: any = {};
  icons = true;

  constructor(
    journalService: JournalService,
    errorHandler: UxService,
    public navService: NavService
  ) {
    super(journalService, errorHandler);
    this.afterProcessing = () => {
      this.setStyle();
      this.setJournalList();
    };
  }

  setJournalList() {
    const groupedItems = this.items.reduce((groups, item) => {
      const date = item.timeStamp.toString().split('T')[0];
      if (!groups[date]) { groups[date] = []; }

      groups[date].push(item);
      return groups;
    }, {});

    const groupArrays = Object.keys(groupedItems).map((date) => {
      return {
        date: moment(date).format('DD MMM YYYY'),
        day: moment(date).format('ddd'),
        journals: groupedItems[date]
      };
    });
    this.journalList = groupArrays;
  }

  setStyle() {
    this.style['background'] = 'var(--default)';
    this.style['background'] = '7px / 15px Helvetica, Arial, sans-serif';
    this.style['background'] = '#fff';
  }

  viewAll() {
    this.navService.goto('/home/activities')
  }

  public getIcon(value) {
    switch (value) {
      case 'rfq':
        return 'lead';

      case 'quote':
        return 'quote';

      case 'price':
        return 'price';

      case 'order':
        return 'order';

      case 'particular':
        return 'particular';

      case 'ticket':
        return 'ticket';

      case 'status':
        return 'change_history';

      default:
        return 'timeline';
    }
  }
}

