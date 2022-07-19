import { Injectable } from '@angular/core';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { LivrableVO } from '../../../_core/models/livrable-vo';
import { RelookingBillLotService } from './relooking-bill-lot.service';
import { STATUT_LIVRABLE } from '../../../_core/constants/constants';
import { RelookingPopupConfirmationComponent } from '../../../_shared/components/relooking/relooking-popup-confirmation/relooking-popup-confirmation.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PenicheLigneErreurAndWariningResponseVO } from '../../../_core/models/peniche-ligne-erreur-response-vo';
import { ARCHIVED_FILE_MESSAGE, BILL, BILL_MESSAGE, DETAIL_MESSAGE,
  ERRORS, GENERATION_FILE_IMPOSSIBLE, MESSAGE_CONFIRMATION,
  RELOOKING_ERROR_CLASS_NAME, RELOOKING_WARNING_CLASS_NAME,
  RELOOKING_WITH, SECONDES, SUCCESS_RELOOKING_CLASS_NAME,
  SUCCESS_RELOOKING_MESSAGE, UNEXPECTED_STATUS_MESSAGE, WARNINGS }
  from '../../../_core/constants/bill-constant';

@Injectable()
export class ValidateRelookingStandardLot {

  nbFichiersMauvaisStatus = 0;
  logs: string[] = [];
  callNum = 0;
  hasChose = false;
  listBillsToRelooking: LivrableVO[] = [];

constructor(private readonly relookingBillLotService: RelookingBillLotService,
  private readonly modalService: NgbModal) { }

async validateBillToBeRelooked(){
  this.logs = [];
  if(!isNullOrUndefined(this.listBillsToRelooking) && this.listBillsToRelooking.length !== 0){
    for(const bill of this.listBillsToRelooking) {
      await this.billProcess(bill)
    }
    this.billToReProcess();
    }
}

async billProcess(bill: LivrableVO) {
  if (!bill.archive) {
    await this.generated(bill);
  } else {
    this.archivedBill(bill);
  }
}

private billToReProcess(): void {
  if (this.checkIsDonneeStock()) {
      this.validateBillToBeRelooked();
  } else {
    this.toRelookingLivrablesWithBadStatus();
  }
}

private toRelookingLivrablesWithBadStatus(): void {
  if (this.nbFichiersMauvaisStatus > 0) {
    this.logs.unshift(this.relookingErrorMessage());
  }
}

private checkIsDonneeStock(): LivrableVO {
  return this.listBillsToRelooking.find(livrable => livrable.livrableStatus !== STATUT_LIVRABLE.DONNEES_STOCKEES);
}

async generated(bill: LivrableVO){
  if (this.checkIsValidToGenerated(bill)) {
    if(bill.livrableStatus !== STATUT_LIVRABLE.DONNEES_STOCKEES){
    await this.openConfirmationPopup(bill);
    }
  } else {
    this.nbFichiersMauvaisStatus++;
    this.removeBill(bill);
  }
}

private archivedBill(livrable: LivrableVO): void {
  this.nbFichiersMauvaisStatus++;
  this.logs.unshift(this.createSpanElement(this.getfileGenerationMessage(livrable) , RELOOKING_ERROR_CLASS_NAME));
  this.removeBill(livrable);
}

private getfileGenerationMessage(livrable: any): any {
  return `${GENERATION_FILE_IMPOSSIBLE} ${livrable.fichierOriginal} ${ARCHIVED_FILE_MESSAGE}.`;
}

private removeBill(bill: LivrableVO): void {
  this.listBillsToRelooking = this.listBillsToRelooking.filter(billToRemove=> billToRemove.label !== bill.label);
}


private createSpanElement(message , className): string{
  return `<span class=${className}> ${message}. </span><br />`
}

private relookingErrorMessage(): string {
  return this.createSpanElement(
    `${this.nbFichiersMauvaisStatus} ${UNEXPECTED_STATUS_MESSAGE} `,
    RELOOKING_ERROR_CLASS_NAME
  );
}

private checkIsValidToGenerated(livrable: LivrableVO): boolean {
  return (livrable.livrableStatus === STATUT_LIVRABLE.GENERE) ||
  (livrable.livrableStatus === STATUT_LIVRABLE.GENERE_WARNING) ||
  (livrable.livrableStatus === STATUT_LIVRABLE.GENERE_ERREUR) ||
  (livrable.livrableStatus === STATUT_LIVRABLE.DONNEES_STOCKEES);
}

async openConfirmationPopup(livrable: LivrableVO) {
  const model = this.modalService.open(RelookingPopupConfirmationComponent, {centered: true,});
  model.componentInstance.message = `${MESSAGE_CONFIRMATION} ${livrable.label} ?`;
  const isOk = await model.result;
  if(isOk){
    this.listBillsToRelooking.forEach(data=>{
      if(data.label === livrable.label){
        data.livrableStatus = STATUT_LIVRABLE.DONNEES_STOCKEES;
      }
    });
  }else{
    this.removeBill(livrable);
  }
}

formattedLogs(bill: LivrableVO, messages: string[], errorNumber: number) {
  if (!bill.libelleErreurTraitement) {
    if (!bill.erreurs || bill.erreurs.length === 0) {
      messages.unshift(this.getSuccessRelookingMessage(bill.fichierOriginal));
    } else if (bill.livrableStatus === STATUT_LIVRABLE.GENERE_WARNING) {
      messages.unshift(
        this.createRolookingWithWarningsAndErrorsMessage(
          bill.fichierOriginal,
          bill.erreurs ,errorNumber,
          RELOOKING_WARNING_CLASS_NAME,
          false
        )
      );
    } else if (bill.livrableStatus === STATUT_LIVRABLE.GENERE_ERREUR) {
      messages.unshift(
        this.createRolookingWithWarningsAndErrorsMessage(bill.fichierOriginal,
          bill.erreurs,
          errorNumber,
          RELOOKING_ERROR_CLASS_NAME,
          true
        )
      );
    }
  } else {
    messages.unshift(
      this.createSpanElement(
        bill.libelleErreurTraitement ,
        RELOOKING_ERROR_CLASS_NAME
      )
    );
  }
}

getSuccessRelookingMessage(fichierOriginal: string): string {
  return `<span class=${SUCCESS_RELOOKING_CLASS_NAME}>${BILL}  ${fichierOriginal} ${SUCCESS_RELOOKING_MESSAGE} </span><br />`;
}

getSucessRelookingMessage(time: number): string {
  return `<span class=${SUCCESS_RELOOKING_CLASS_NAME}>${BILL}  ${BILL_MESSAGE} ${time} ${SECONDES} </span><br />`;
}

createRolookingWithWarningsAndErrorsMessage(fichierOriginal: string,
  erreurs: PenicheLigneErreurAndWariningResponseVO[] ,
  errorNumber: number , className , isError): string {
  return `<span class=${className}>${BILL}  ${fichierOriginal}  
  ${RELOOKING_WITH} ${erreurs ? erreurs.length:0} ${isError ? ERRORS:WARNINGS} dont 
  ${errorNumber} ${DETAIL_MESSAGE}.</span><br />`;
}

}
