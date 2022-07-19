import { TestBed } from '@angular/core/testing';

import { ReferenceDataTypeService } from './reference-data-type.service';

describe('ReferenceDataTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReferenceDataTypeService = TestBed.get(ReferenceDataTypeService);
    expect(service).toBeTruthy();
  });
});
