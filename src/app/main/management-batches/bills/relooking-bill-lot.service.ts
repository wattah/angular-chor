import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationDialogRelookingService } from '../../../_shared/confirmation-dialog-relooking/confirmation-dialog-relooking.service';
import { LivrableVO } from '../../../_core/models/livrable-vo';
import { CANCELED_UPLOAD, CONTINUE_UPLOAD, MESSAGE_FORMAT_FILE_KO, MESSAGE_GENERATE_CORRECTLY, MESSAGE_OK, MESSAGE_RELOOKING_POPUP,
  TITLE_POPU_ERROR,
         TITLE_RELOOKING } from '../../../_core/constants/bill-constant';
import { checkIsNameValide } from '../../../_core/utils/bills-utils';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { BillingService } from '../../../_core/services/billing.service';



@Injectable()
export class RelookingBillLotService {

  livrablesToRelooking: LivrableVO[] = [];
  billAfterRelookingManually$ = new BehaviorSubject(null);

  constructor(private readonly dialogRelookingService : ConfirmationDialogRelookingService,
    private readonly dialogService : ConfirmationDialogService,
    private readonly billingService : BillingService,
    private readonly snackBar : MatSnackBar) {
  }

   relookingManuallyConfirmation(bill: LivrableVO) {
    this.dialogRelookingService.confirm(TITLE_RELOOKING,MESSAGE_RELOOKING_POPUP, CONTINUE_UPLOAD,CANCELED_UPLOAD,'lg', true)
    .then((files) =>
         this.relookingManuallyBill(files[0][0].name,bill , files[0][0])
     ) .catch(() =>
     console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    return null;
  }

   relookingManuallyBill(fileName: string, bill: LivrableVO , file) {
    const isValidFile = checkIsNameValide(bill, fileName);
    if(!isValidFile) {
       this.dialogService.confirm(TITLE_POPU_ERROR, MESSAGE_FORMAT_FILE_KO, MESSAGE_OK, "Non", "sm", false);
    } else {
      if(bill.livrableId === null){
        bill.livrableId = 0;
      }
     this.billingService.replaceRelookedBill(fileName, bill , file).subscribe(data => {
       this.setBillAfterRelookingManually(data);
      },
       error => {
         this.setBillAfterRelookingManually(null);
         this.dialogService.confirm("", error.error.message, MESSAGE_OK, "Non", "sm", false);
      },
       () => {
          this.snackBar.open(
          MESSAGE_GENERATE_CORRECTLY, undefined,
          { duration: 3000, panelClass: ['center-snackbar', 'snack-bar-container'] });
       }
     );
    }
  }

  setBillAfterRelookingManually(val: LivrableVO): void {
    this.billAfterRelookingManually$.next(val);
  }

  getBillAfterRelookingManually(): BehaviorSubject<LivrableVO> {
    return this.billAfterRelookingManually$;
  }
}
