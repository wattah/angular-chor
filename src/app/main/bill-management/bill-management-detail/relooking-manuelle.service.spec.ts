import { TestBed } from '@angular/core/testing';

import { RelookingManuelleService } from './relooking-manuelle.service';

describe('RelookingManuelleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RelookingManuelleService = TestBed.get(RelookingManuelleService);
    expect(service).toBeTruthy();
  });
});
