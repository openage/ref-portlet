import { TestBed } from '@angular/core/testing';

import { StatGridService } from './stat-grid.service';

describe('StatGridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatGridService = TestBed.get(StatGridService);
    expect(service).toBeTruthy();
  });
});
