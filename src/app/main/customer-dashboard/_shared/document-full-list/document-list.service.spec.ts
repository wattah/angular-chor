import { TestBed } from '@angular/core/testing';

import { DocumentListService } from './document-list.service';

describe('DocumentListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentListService = TestBed.get(DocumentListService);
    expect(service).toBeTruthy();
  });
});
