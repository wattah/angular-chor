import { Injectable } from '@angular/core';
import { isEmpty } from '../../../_core/utils/array-utils';

import { LivrableVO } from '../../../_core/models/livrable-vo';
import { isNullOrUndefined, isNumber } from '../../../_core/utils/string-utils';
import { CONSTANTS_BILL, PICTO_PDF } from '../../../_core/constants/bill-constant';
import { DocumentService } from '../../../_core/services/documents-service';

@Injectable({
  providedIn: 'root'
})
export class UploadBillClientService {

    // *****************************************Déclaration de constants et variables *********************** */
  messages: string[] = [];

  constructor(  readonly documentService: DocumentService ) { }
  
// ************************************ Contrôle nom facture****************************************************/
  prepareBillsToUpload(selectedFiles: any , periodFilter: string, numClient: string): string[] {
    const billsNameToUpload = [];
    const countBills = this.countSelectedFilesToUpload(selectedFiles);
    this.messages.unshift(this.getNumberSelectedBillsMessage(countBills));
    if (selectedFiles && selectedFiles[0]) {
      selectedFiles[0].forEach(bill => {
        const isValidName = this.isValidBillName(bill.name);
        const isDateValid = this.isValidBillDate(bill.name, periodFilter );
        const isNumClientValid = this.isValidClientNumber(bill.name, numClient);
        if (!isValidName) {
          this.messages.unshift(this.getInvalidBillMessage(CONSTANTS_BILL.FILE_LABEL, bill.name, CONSTANTS_BILL.NAME_FILE_INVALID_LABEL,
             CONSTANTS_BILL.ERROR_CLASS_NAME, null, null));
        }
        if (!isDateValid) {
          this.messages.unshift(this.getInvalidBillMessage(CONSTANTS_BILL.FILE_LABEL, bill.name, CONSTANTS_BILL.DATE_FILE_INVALID_LABEL,
             CONSTANTS_BILL.ERROR_CLASS_NAME, null, null));
        }
        if (!isNumClientValid) {
          this.messages.unshift(this.getInvalidBillMessage(CONSTANTS_BILL.FILE_LABEL, bill.name, CONSTANTS_BILL.NUM_CLIENT_INVALID_LABEL ,
            CONSTANTS_BILL.ERROR_CLASS_NAME, null, null));
        }
    // prepare billsName List To send
        if (isDateValid && isValidName && isNumClientValid) {
          this.documentService.uploadBillToPenicheServer(bill).subscribe((response) => {
            console.info('response ',response);
          },
          (error) => {
            console.error('error ', error);
          },
          () => {   
            console.info('complete ');
          });
          billsNameToUpload.push(bill.name);
        }
      });
    }
    return billsNameToUpload;
  }
/**************************************COUNT SELECTED FILES ***************************************************/
  countSelectedFilesToUpload(selectedFiles: any ): number {
    return selectedFiles && selectedFiles[0] ? selectedFiles[0].length : 0;
  }
// *************************************VALIDATION NAME BILL ****************************************************/
  isValidBillName(fileName: string): boolean {
    let nameFileValid = false;
    let extentionValid = false;
    const univers: string[] = ['FAMO', 'FASE', 'FAIN', 'FAFI'];

    const fileNameTab = fileName ? fileName.split('_') : null;
  // check valid name
    nameFileValid = fileNameTab && fileNameTab.length > 1 ?
  univers.includes(fileNameTab[0]) && isNumber(fileNameTab[1]) && isNumber(fileNameTab[2]) && fileNameTab[2].length === 6 : false;
  // check valid extention (pdf)
    const extention = fileName ? fileName.split('.') : null;

    if (extention && extention[1] && extention[1] === PICTO_PDF) {
      extentionValid = true; }

    return nameFileValid && extentionValid;
  }
  // *************************************VALIDATION N° CLIENT ****************************************************/
  isValidClientNumber(fileName: string, numClient: string): boolean {
    let numClientValid = false;
    const fileNameTab = fileName ? fileName.split('_') : null;
  // check valid num client
    numClientValid = fileNameTab && fileNameTab.length > 1 && numClient === fileNameTab[1].toString() ;

    return numClientValid ;
  }
// *************************************VALIDATION BILL DATE ****************************************************/
  isValidBillDate(fileName: string, dateFilter: string): boolean {
    let dateValid = false;
    const dateIn = dateFilter ? ((dateFilter.split('-') && dateFilter.split('-').length > 1 ) ?
  dateFilter.split('-')[0] + dateFilter.split('-')[1] : '') : null;
    const fileNameTab = fileName ? fileName.split('_') : null;
  // check valid date
    dateValid = fileNameTab && fileNameTab.length > 1 && dateIn === fileNameTab[2].toString() ;

    return dateValid ;
  }
// ****************************************PROCESS BILLS AFTER UPLOAD AND SHOW ERRORS MESSAGES ********************************/
  processBillsAfterUpload(billsAfterUpload: LivrableVO[]): void {
    if (!isEmpty(billsAfterUpload)) {
      billsAfterUpload.forEach(billAfterUpload => {
        if (isNullOrUndefined(billAfterUpload.libelleErreurTraitement)) {
          if ((billAfterUpload.libelleWarningTraitement !== null) && (billAfterUpload.libelleWarningTraitement.length > 0)) {
            this.messages.unshift(this.getInvalidWarningAndErrorBillMessage(billAfterUpload.libelleWarningTraitement ,
               CONSTANTS_BILL.WARNING_CLASS_NAME));
          }

          if (isEmpty(billAfterUpload.erreurs)) {
            this.messages.unshift(this.getInvalidBillMessage(CONSTANTS_BILL.BILL_DATA, billAfterUpload.fichierOriginal,
               CONSTANTS_BILL.EXTRACT_WITH_SUCCESS , CONSTANTS_BILL.SUCCESS_CLASS_NAME, null , null));
          } else {
            this.messages.unshift(this.getInvalidBillMessage(CONSTANTS_BILL.BILL_DATA, billAfterUpload.fichierOriginal,
               CONSTANTS_BILL.EXTRACT_WITH ,
               CONSTANTS_BILL.WARNING_CLASS_NAME, billAfterUpload.erreurs.length , CONSTANTS_BILL.WARNING_ERRORS_LABEL));
          }
        } else {
          this.messages.unshift(this.getInvalidWarningAndErrorBillMessage(billAfterUpload.libelleErreurTraitement,
             CONSTANTS_BILL.ERROR_CLASS_NAME));
        }
      });
    }
  }
// ****************************************INFO MESSAGE ********************************/
  private getNumberSelectedBillsMessage(numberSelectedBills: number): string {
    return `<span class=${CONSTANTS_BILL.INFO_CLASS_NAME}> ${numberSelectedBills} ${CONSTANTS_BILL.SELECTED_FILE_LABEL} </span><br />`;
  }

// ****************************************ERROR MESSAGE ********************************/
  private getInvalidBillMessage(firstLabel: string , billName: string, secondLabel: string, className: string, param: number,
     thirdLabel: string): string {
    return `<span class=${className}> ${firstLabel} ${billName} ${secondLabel}  ${param === null ? '' : param} ${thirdLabel === null ?
       '' : thirdLabel}</span><br />`;
  }
// ****************************************Warning MESSAGE ********************************/
  private getInvalidWarningAndErrorBillMessage(labelMessage: string, className: string): string {
    return `<span class=${className}>${labelMessage} </span><br />`;
  }
}
