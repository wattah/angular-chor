import { TestBed } from '@angular/core/testing';

import { ContactMethodService } from './contact-method.service';

describe('ContactMethodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContactMethodService = TestBed.get(ContactMethodService);
    expect(service).toBeTruthy();
  });
});
