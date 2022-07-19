import { Injectable } from '@angular/core';
import { isNumber, isNullOrUndefined } from '../../../_core/utils/string-utils';
import { BillingService } from '../../../_core/services/billing.service';
import { LivrableVO } from '../../../_core/models/livrable-vo';
import { CONSTANTS_BILL, PICTO_PDF } from '../../../_core/constants/bill-constant';
import { DocumentService } from '../../../_core/services/documents-service';

@Injectable({
  providedIn: 'root'
})
export class UploadBillsService {

  //*****************************************Déclaration de constants et variables *********************** */
 messages: string[] = [];


//*****************************************Constructeur *************************************************/
  constructor(  readonly documentService: DocumentService ) { }

//************************************ Contrôle nom fichier****************************************************/
 prepareBillsToUpload(selectedFiles: any , periodFilter : string): string[]{
  const billsNameToUpload = [];
 const countBills = this.countSelectedFilesToUpload(selectedFiles);
  this.messages.unshift(this.getNumberSelectedBillsMessage(countBills));
  if(selectedFiles && selectedFiles[0]){
    selectedFiles[0].forEach(bill => {
      const isValidName = this.isValidBillName(bill.name);
      const isDateValid = this.isValidBillDate(bill.name,periodFilter );
      if (!isValidName){
        this.messages.unshift(this.getInvalidBillMessage(CONSTANTS_BILL.FILE_LABEL, bill.name, CONSTANTS_BILL.NAME_FILE_INVALID_LABEL, CONSTANTS_BILL.ERROR_CLASS_NAME, null, null));
      }
      if (!isDateValid){
        this.messages.unshift(this.getInvalidBillMessage(CONSTANTS_BILL.FILE_LABEL, bill.name, CONSTANTS_BILL.DATE_FILE_INVALID_LABEL, CONSTANTS_BILL.ERROR_CLASS_NAME, null, null));
      }
    // prepare billsName List To send
    if(isDateValid && isValidName){
      this.documentService.uploadBillToPenicheServer(bill).subscribe((response) => {
        console.info('response ', response);
      },
      (error) => {
        console.error('error ', error);
      },
      () => {   
        console.info('complet');
      });
  
      billsNameToUpload.push(bill.name);
    }
    });
  }
  return billsNameToUpload;
}
/**************************************COUNT SELECTED FILES ***************************************************/
countSelectedFilesToUpload(selectedFiles: any ):number{
  return selectedFiles && selectedFiles[0]   ? selectedFiles[0].length : 0;
}
//*************************************VALIDATION NAME FILE ****************************************************/
isValidBillName(fileName : string) : boolean{
  let nameFileValid = false;
  let extentionValid = false;
  const univers: string[] = ['FAMO', 'FASE', 'FAIN','FAFI'];

  const fileNameTab = fileName  ? fileName.split('_') : null;
  //check valide name
  nameFileValid = fileNameTab && fileNameTab.length > 1 ? 
  univers.includes(fileNameTab[0]) && isNumber(fileNameTab[1]) && isNumber(fileNameTab[2]) &&  fileNameTab[2].length === 6 : false;
  //check valid extention (pdf)
  const extention = fileName ? fileName.split('.') : null;

     if(extention  && extention[1] && extention[1] === PICTO_PDF){
      extentionValid = true;}

   return nameFileValid && extentionValid;
}
//*************************************VALIDATION NAME FILE ****************************************************/
isValidBillDate(fileName : string, dateFilter : string) : boolean{
  let dateValid = false;
  const dateIn =  dateFilter ? ((dateFilter.split('-')  &&  dateFilter.split('-').length > 1 )?  
  dateFilter.split('-')[0]+ dateFilter.split('-')[1] : "") : null;
  const fileNameTab = fileName  ? fileName.split('_') : null;
  //check valide date
  dateValid = fileNameTab && fileNameTab.length > 1 &&  dateIn === fileNameTab[2].toString() ;

  return dateValid ;
}
//****************************************INFO MESSAGE ********************************/
private getNumberSelectedBillsMessage(numberSelectedBills: number): string {
  return `<span class=${CONSTANTS_BILL.INFO_CLASS_NAME}> ${numberSelectedBills} ${CONSTANTS_BILL.SELECTED_FILE_LABEL} </span><br />`;
}

//****************************************INFO MESSAGE ********************************/
private getInvalidBillMessage(firstLabel : string , billName: string, secondLabel : string, className : string, param : number, thirthLable : string): string {
  return `<span class=${className}> ${firstLabel} ${billName} ${secondLabel}  ${param === null ? '': param} ${thirthLable === null ? '' : thirthLable}</span><br />`;
}
//****************************************Wrning MESSAGE ********************************/
private getInvalidWarningAndErrorBillMessage(labelMessage : string, className : string): string {
  return `<span class=${className}>${labelMessage} </span><br />`;
}
//****************************************PROCESS BILLS AFTER UPLOAD AND SHOW ERRORS MESSAGES ********************************/
processBillsAfterUpload(billsAfterUpload : LivrableVO[]){

 if(billsAfterUpload && billsAfterUpload.length > 0){
  billsAfterUpload.forEach(billAfterUpload => {
     if(isNullOrUndefined(billAfterUpload.libelleErreurTraitement)){
      if ((billAfterUpload.libelleWarningTraitement != null) && (billAfterUpload.libelleWarningTraitement.length > 0)) {
        this.messages.unshift(this.getInvalidWarningAndErrorBillMessage(billAfterUpload.libelleWarningTraitement , CONSTANTS_BILL.WARNING_CLASS_NAME));
      }

      if ((billAfterUpload.erreurs == null) || (billAfterUpload.erreurs.length == 0)) {
        this.messages.unshift(this.getInvalidBillMessage(CONSTANTS_BILL.BILL_DATA, billAfterUpload.fichierOriginal, CONSTANTS_BILL.EXTRACT_WITH_SUCCESS , CONSTANTS_BILL.SUCCESS_CLASS_NAME, null , null));
      } else {
        this.messages.unshift(this.getInvalidBillMessage(CONSTANTS_BILL.BILL_DATA, billAfterUpload.fichierOriginal, CONSTANTS_BILL.EXTRACT_WITH , CONSTANTS_BILL.WARNING_CLASS_NAME, billAfterUpload.erreurs.length ,CONSTANTS_BILL.WARNING_ERRORS_LABEL));
      }
     }
     else{
      this.messages.unshift(this.getInvalidWarningAndErrorBillMessage(billAfterUpload.libelleErreurTraitement,CONSTANTS_BILL.ERROR_CLASS_NAME));
     }
   });
 }
}
}

