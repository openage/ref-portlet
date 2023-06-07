import { inject, TestBed } from '@angular/core/testing';
import { DirectoryRoleService } from './directory-role.service';

describe('DirectoryRoleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirectoryRoleService]
    });
  });

  it('should be created', inject([DirectoryRoleService], (service: DirectoryRoleService) => {
    expect(service).toBeTruthy();
  }));
});
