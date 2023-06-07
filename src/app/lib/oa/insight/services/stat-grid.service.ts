import { Injectable } from '@angular/core';
import { MockedService } from '../../core/services/mocked-api';
import { StatGrid } from '../models/stat-grid.model';

@Injectable()
export class StatGridService extends MockedService<StatGrid> {
  constructor() {
    super([
      new StatGrid({
        id: 'hospital-dashboard',
        label: `In a Nutshell`,
        stats: [
          { label: `Total RFQ's`, value: 32 },
          { label: `Total Bids`, value: 1242 },
          { label: `Total Service Providers`, value: 2245 },
          { label: `Average Bid`, value: '$190,000' },
        ]
      }),
      new StatGrid({
        id: 'provider-dashboard',
        label: `In a Nutshell`,
        stats: [
          { label: `Total RFQ/P Invites`, value: 32 },
          { label: `Total Bids`, value: 1242 },
          { label: `Total Contracts`, value: 4 },
          { label: `Average Bid`, value: '$190,000' },
        ]
      }),
      new StatGrid({
        id: 'rfq-list',
        label: `In a Nutshell`,
        stats: [
          { label: `Total RFQ's`, value: 14 },
          { label: `Total Awarded RFQ's`, value: 7 },
          { label: `Total Active RFQ's`, value: 8 },
          { label: `Total Archived/ Cancelled RFQ's`, value: 2 }
        ]
      })
    ]);
  }
}
