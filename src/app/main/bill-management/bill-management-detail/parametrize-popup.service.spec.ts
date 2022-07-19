import { TestBed } from '@angular/core/testing';

import { ParametrizePopupService } from './parametrize-popup.service';

describe('ParametrizePopupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParametrizePopupService = TestBed.get(ParametrizePopupService);
    expect(service).toBeTruthy();
  });
});
