import { TestBed } from '@angular/core/testing';
import { TemplateService } from './template.service';

describe('FileTemplatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TemplateService = TestBed.get(TemplateService);
    expect(service).toBeTruthy();
  });
});
