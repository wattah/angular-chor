import { TestBed } from '@angular/core/testing';

import { CustomerHardwareParkService } from './customer-hardware-park.service';

describe('CustomerHardwareParkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerHardwareParkService = TestBed.get(CustomerHardwareParkService);
    expect(service).toBeTruthy();
  });
});
