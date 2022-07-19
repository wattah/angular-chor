/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConfirmationDialogService } from './confirmation-dialog.service';

describe('Service: ConfirmationDialog', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmationDialogService]
    });
  });

  it('should ...', inject([ConfirmationDialogService], (service: ConfirmationDialogService) => {
    expect(service).toBeTruthy();
  }));
});
