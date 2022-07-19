import { TestBed } from '@angular/core/testing';

import { RequestAnswersService } from './request-answers.service';

describe('RequestAnswersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequestAnswersService = TestBed.get(RequestAnswersService);
    expect(service).toBeTruthy();
  });
});
