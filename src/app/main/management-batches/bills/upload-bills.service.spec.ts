import { TestBed } from '@angular/core/testing';

import { UploadBillsService } from './upload-bills.service';

describe('UploadBillsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadBillsService = TestBed.get(UploadBillsService);
    expect(service).toBeTruthy();
  });
});
