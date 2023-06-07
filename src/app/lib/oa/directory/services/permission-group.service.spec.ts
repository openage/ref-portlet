import { inject, TestBed } from '@angular/core/testing';
import { PermissionGroupService } from './permission-group.service';

describe('PermissionGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionGroupService]
    });
  });

  it('should be created', inject([PermissionGroupService], (service: PermissionGroupService) => {
    expect(service).toBeTruthy();
  }));
});
