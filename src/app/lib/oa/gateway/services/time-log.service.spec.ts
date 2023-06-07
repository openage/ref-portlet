import { TestBed } from '@angular/core/testing';

import { TimeLogService } from './time-log.service';

describe('TimeLogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeLogService = TestBed.get(TimeLogService);
    expect(service).toBeTruthy();
  });
});
