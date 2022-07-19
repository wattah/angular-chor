import { TestBed } from '@angular/core/testing';

import { ParkItemUpdateService } from './park-item-update.service';

describe('ParkItemUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParkItemUpdateService = TestBed.get(ParkItemUpdateService);
    expect(service).toBeTruthy();
  });
});
