import { inject, TestBed } from '@angular/core/testing';

import { RoleTypeService } from './role-type.service';

describe('RoleTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleTypeService]
    });
  });

  it('should be created', inject([RoleTypeService], (service: RoleTypeService) => {
    expect(service).toBeTruthy();
  }));
});
