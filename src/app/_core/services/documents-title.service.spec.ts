import { TestBed } from '@angular/core/testing';

import { DocumentsTitleService } from './documents-title.service';

describe('DocumentsTitleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentsTitleService = TestBed.get(DocumentsTitleService);
    expect(service).toBeTruthy();
  });
});
