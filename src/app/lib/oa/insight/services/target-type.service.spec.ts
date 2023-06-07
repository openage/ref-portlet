import { TestBed } from '@angular/core/testing';

import { TargetTypeService } from './target-type.service';

describe('TargetTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TargetTypeService = TestBed.get(TargetTypeService);
    expect(service).toBeTruthy();
  });
});
