import { TestBed } from '@angular/core/testing';

import { ValidateLivrableService } from './validate-livrable.service';

describe('ValidateLivrableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidateLivrableService = TestBed.get(ValidateLivrableService);
    expect(service).toBeTruthy();
  });
});
