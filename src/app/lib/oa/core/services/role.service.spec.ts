import { inject, TestBed } from '@angular/core/testing';

import { RoleService } from '../../core/services';

describe('RoleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleService],
    });
  });

  it('should be created', inject([RoleService], (service: RoleService) => {
    expect(service).toBeTruthy();
  }));
});
