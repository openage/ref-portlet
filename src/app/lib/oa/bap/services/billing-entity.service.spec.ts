import { TestBed } from '@angular/core/testing';

import { BillingEntityService } from './billing-entity.service';

describe('BillingEntityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillingEntityService = TestBed.get(BillingEntityService);
    expect(service).toBeTruthy();
  });
});
