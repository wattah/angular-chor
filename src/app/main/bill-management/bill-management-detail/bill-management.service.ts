import { ConfirmationDialogService } from './../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { BillingService } from './../../../_core/services/billing.service';
import { CORRECTION, PARAMETRIZE_COL_ID, PARAMETRIZE_MESSAGE, FACTURE_VERIFIED, FACTURE_TO_BE_CORRECT, TO_VERIFIED_BILL, TO_BE_CORRECT, SIZE, NON, OUI, ORIGINAL_BILL } from './../../../_core/constants/bill-constant';
import { DocumentService } from '../../../_core/services/documents-service';
import { ParametrizePopupService } from './parametrize-popup.service';
import { STATUT_LIVRABLE , SousEtatLivrable as UNDER_STATUS_LIVRABLE } from '../../../_core/constants/constants';
import { DOWLOAD_COL_ID, DOWNLOAD_CHOSE_MESSAGE, BILL_RELOOKED_MANUALLY, CANCEL, DOWNLOAD_ERROR_MESSAGE, DOWNLOAD_FILIGRANE_MESSAGE, WITH_FILIGRANE, WITHOUT_FILIGRANE } from '../../../_core/constants/bill-constant';
import { LivrableVO } from '../../../_core/models/livrable-vo';
import { Injectable } from "@angular/core";
import { checkValidateToDeleteOrDownloadOrRelooking, checkValidateToParameters } from '../../../_core/utils/bills-utils';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class BillManagementService{
  rowData = [];
  finishRowDataUpdate$ = new BehaviorSubject(false);
    constructor(private readonly parametrizePopupService: ParametrizePopupService,
      private readonly documentService: DocumentService,
      private readonly billingService: BillingService,
      private readonly confirmationDialogService: ConfirmationDialogService){
        
    }
    download(event: any) {
        if(event.column.colId === DOWLOAD_COL_ID && checkValidateToDeleteOrDownloadOrRelooking(event, false)){
          const livrable: LivrableVO = event.data;
          if(livrable ){
            if(livrable.livrableStatus === STATUT_LIVRABLE.FICHIER_RELOOKE_MANUELLEMENT){
              this.downloadBillInRelookingManuallyCase(livrable);
            }else{
              if(livrable.archive){
                this.downloadArchivedBill(livrable);
              }else{
                this.downloadBillInGeneralCase(livrable);
              }
              
            }
          }
        }
    }

    /**
   * to download bill if the livrable in FICHIER_RELOOKE_MANUELLEMENT status
   * @param livrable 
   */
  private downloadBillInRelookingManuallyCase(livrable: LivrableVO) {
    const model = this.openDownLoadPopup(
      DOWNLOAD_CHOSE_MESSAGE,
      BILL_RELOOKED_MANUALLY,
      ORIGINAL_BILL
    );
    model.then(
      (chose: any) => {
        if (chose !== CANCEL) {
          this.documentService.errorMessage = DOWNLOAD_ERROR_MESSAGE;
          if (chose.valide) {
            this.downLoadRelookedBill(livrable, chose);
          } else {
            this.downloadOriginalBill(livrable);
          }
        }
      }
    );
  }
/**
 * to download the original file after relooking
 * @param livrable 
 */
  downloadOriginalBill(livrable: LivrableVO) {
    this.documentService.downloadOriginalBill(livrable.fichierOriginal).subscribe(
      (data) => this.documentService.onSsuccessFileTreatement(data, livrable.fichier),
      (error) => this.documentService.onErrorFileTreatement()
    );
  }

  /**
   * to download relooked bill
   * @param livrable 
   * @param chose 
   */
  private downLoadRelookedBill(livrable: LivrableVO, chose: {value: string , valide: boolean}) {
    if(chose.value === ORIGINAL_BILL){
      this.downloadOriginalBill(livrable);
    }else{
      this.documentService.downloadBillByFiligrane(livrable.fichier, !chose.valide).subscribe(
        (data) => this.documentService.onSsuccessFileTreatement(data, livrable.fichier),
        (error) => this.documentService.onErrorFileTreatement()
      );
    }
  }

  /**
   * to open popup in download case
   * @param message 
   * @param firstButtonValue 
   * @param secondButtonValue 
   */
  private openDownLoadPopup(message: string , firstButtonValue: string , secondButtonValue: string , thirdButtonValue: string = '') {
    return this.parametrizePopupService.config(
      message,
      firstButtonValue,
      secondButtonValue,
      thirdButtonValue,
      { value: firstButtonValue, valide: true },
      { value: secondButtonValue, valide: false },
      { value: thirdButtonValue, valide: false },
      true
    );
  }

  /**
   * to download bill in general with livrable status equals GENERE(ERRORS/WARNINGS)
   * @param livrable 
   */
  private downloadBillInGeneralCase(livrable: LivrableVO) {
    const model = this.openDownLoadPopup(
      DOWNLOAD_FILIGRANE_MESSAGE,
      WITH_FILIGRANE,
      WITHOUT_FILIGRANE,
      ORIGINAL_BILL
    );
    model.then(
      (chose: any) => {
        if (chose !== CANCEL) {
          this.documentService.errorMessage = DOWNLOAD_ERROR_MESSAGE;
          this.downLoadRelookedBill(livrable, chose);
        }
      }
    );
  }

  private downloadArchivedBill(livrable: LivrableVO) {
    this.documentService.errorMessage = DOWNLOAD_ERROR_MESSAGE;
    this.downLoadRelookedBill(livrable, { value: WITHOUT_FILIGRANE, valide: false });
  }

  parametrize(event: any) {
    if(event.column.colId === PARAMETRIZE_COL_ID && checkValidateToParameters(event)){
      const livrable: LivrableVO = event.data
      if(this.hasToVerifyStatus(livrable)){
        this.updateStatus(livrable);
      }
      if(this.hasToBeCorrectStatus(livrable)){
        this.openPopUpForTaskOnLivrable(CORRECTION , PARAMETRIZE_MESSAGE , true ,  CANCEL , FACTURE_VERIFIED).then(
          (chose)=>{
            if(chose){
              this.updateStatusLivrable(livrable , true);
            }
          }
        )
      }
    }   
  }

  /**
   * to open popup and call updateSOUS_ETAT_LIVRABLE method
   * @param livrable 
   */
  private updateStatus(livrable: LivrableVO) {
    const model = this.parametrizePopupService.config(
      PARAMETRIZE_MESSAGE,
      FACTURE_VERIFIED,
      FACTURE_TO_BE_CORRECT,
      '',
      { value: TO_VERIFIED_BILL, valide: true },
      { value: TO_BE_CORRECT, valide: false },
      null,
      true
    );
    model.then(
      (chose: any) => {
        if (chose !== CANCEL) {
          this.updateStatusLivrable(livrable, chose.valide);
        }
      });
  }

  /**
   * to check if livrable has Correction status
   * @param livrable
   */
  private hasToBeCorrectStatus(livrable: LivrableVO) {
    return livrable.status === UNDER_STATUS_LIVRABLE.FOND_INVALIDE_METIER_ATTENTE_CORRECTION || livrable.status === UNDER_STATUS_LIVRABLE.FORME_INVALIDE_METIER_ATTENTE_CORRECTION;
  }

  /**
   * to update sous status after chose popup
   * @param livrable 
   * @param chose 
   */
  updateStatusLivrable(livrable: LivrableVO , chose: boolean) {
    this.billingService.updateStatusLivrable(livrable , chose).subscribe(
      (updatedBill)=>{
        this.mappeLivrableVOInRowData(updatedBill);
    });
  }

  private hasToVerifyStatus(livrable: LivrableVO): boolean {
    return livrable.status === UNDER_STATUS_LIVRABLE.FOND_A_VALIDER_METIER || livrable.status === UNDER_STATUS_LIVRABLE.FORME_A_VALIDER_METIER;
  }

  openPopUpForTaskOnLivrable(tache: string , message: string,visibleCancelButton: boolean , nonButtonContent: string = NON , ouiButtonContent: string = OUI) {
    return this.confirmationDialogService
     .confirm(tache,message, ouiButtonContent, nonButtonContent , SIZE, visibleCancelButton);
  }

  private mappeLivrableVOInRowData(livrable: LivrableVO) {
    this.rowData = this.rowData.map(
      (livrableBeforeRelooking: LivrableVO) => {
        if (livrableBeforeRelooking.label === livrable.label && livrableBeforeRelooking.numero === livrable.numero) {
          livrableBeforeRelooking = livrable;
          livrableBeforeRelooking.arrow = '';
        }
        return livrableBeforeRelooking;
      });
      this.finishRowDataUpdate$.next(true);
  }
}