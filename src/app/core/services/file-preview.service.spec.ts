import { TestBed } from '@angular/core/testing';

import { FilePreviewService } from './file-preview.service';

describe('AppInitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilePreviewService = TestBed.get(FilePreviewService);
    expect(service).toBeTruthy();
  });
});
