/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConfirmationDialogRelookingService } from './confirmation-dialog-relooking.service';

describe('Service: ConfirmationDialog', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmationDialogRelookingService]
    });
  });

  it('should ...', inject([ConfirmationDialogRelookingService], (service: ConfirmationDialogRelookingService) => {
    expect(service).toBeTruthy();
  }));
});
