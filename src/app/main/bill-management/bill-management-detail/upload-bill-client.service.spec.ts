import { TestBed } from '@angular/core/testing';

import { UploadBillClientService } from './upload-bill-client.service';

describe('UploadBillClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadBillClientService = TestBed.get(UploadBillClientService);
    expect(service).toBeTruthy();
  });
});
