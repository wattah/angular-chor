import { TestBed } from '@angular/core/testing';

import { MessageStylesService } from './message-styles.service';

describe('MessageStylesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessageStylesService = TestBed.get(MessageStylesService);
    expect(service).toBeTruthy();
  });
});
