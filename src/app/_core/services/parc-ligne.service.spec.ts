import { TestBed } from '@angular/core/testing';

import { ParcLigneService } from './parc-ligne.service';

describe('ParcLigneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParcLigneService = TestBed.get(ParcLigneService);
    expect(service).toBeTruthy();
  });
});
