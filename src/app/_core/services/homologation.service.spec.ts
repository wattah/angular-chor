import { TestBed } from '@angular/core/testing';

import { HomologationService } from './homologation.service';

describe('HomologationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HomologationService = TestBed.get(HomologationService);
    expect(service).toBeTruthy();
  });
});
