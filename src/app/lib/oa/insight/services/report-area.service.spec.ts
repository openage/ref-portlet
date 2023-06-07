import { TestBed } from '@angular/core/testing';

import { ReportAreaService } from './report-area.service';

describe('ReportAreaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportAreaService = TestBed.get(ReportAreaService);
    expect(service).toBeTruthy();
  });
});
