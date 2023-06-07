import { TestBed } from '@angular/core/testing';

import { AkaService } from './aka.service';

describe('AkaService', () => {
  let service: AkaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AkaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
