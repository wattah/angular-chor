/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BillingService } from './billing.service';

describe('Service: Billing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillingService]
    });
  });

  it('should ...', inject([BillingService], (service: BillingService) => {
    expect(service).toBeTruthy();
  }));
});
