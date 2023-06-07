import { TestBed } from '@angular/core/testing';

import { LineItemTypeService } from './line-item-type.service';

describe('LineItemTypeService', () => {
  let service: LineItemTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineItemTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
