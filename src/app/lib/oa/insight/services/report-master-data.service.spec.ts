import { TestBed } from '@angular/core/testing';

import { ReportMasterDataService } from './report-master-data.service';

describe('ReportMasterDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportMasterDataService = TestBed.get(ReportMasterDataService);
    expect(service).toBeTruthy();
  });
});
