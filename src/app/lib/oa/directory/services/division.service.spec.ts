import { inject, TestBed } from '@angular/core/testing';

import { DivisionService } from './division.service';

describe('DivisionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DivisionService]
    });
  });

  it('should be created', inject([DivisionService], (service: DivisionService) => {
    expect(service).toBeTruthy();
  }));
});
