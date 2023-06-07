import { TestBed } from '@angular/core/testing';

import { TagTypeService } from './tag-type.service';

describe('TagTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TagTypeService = TestBed.get(TagTypeService);
    expect(service).toBeTruthy();
  });
});
