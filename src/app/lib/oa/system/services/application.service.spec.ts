import { TestBed } from '@angular/core/testing';

import { ApplicationService } from './application.service';

describe('TenantService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicationService = TestBed.get(ApplicationService);
    expect(service).toBeTruthy();
  });
});
