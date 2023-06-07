import { TestBed } from '@angular/core/testing';

import { GatewayOrganizationService } from './organization.service';

describe('OrganizationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GatewayOrganizationService = TestBed.get(GatewayOrganizationService);
    expect(service).toBeTruthy();
  });
});
