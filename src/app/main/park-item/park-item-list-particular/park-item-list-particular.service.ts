import {Injectable } from '@angular/core';
import { isNullOrUndefined, isNumber, isEmpty } from '../../../_core/utils/string-utils';
import { ReferenceDataVO } from '../../../_core/models/reference-data-vo';
import { ParcLigneService } from '../../../_core/services';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { Observable, Subject } from 'rxjs';
import { CODE_CONTRAT_PARK_ITEM } from '../../../_core/constants/constants';
import { LignePipe } from '../../../_shared/pipes';;
import { DateFormatPipeFrench } from '../../../_shared/pipes';

@Injectable({
    providedIn: 'root'
  })
export class ParkItemListParticularService  {


    messageError = "Erreur Serveur : Une erreur technique inattendue est surevenue.";
    transactionError = "Transaction rolled back because it has been marked as rollback-only";
    typeClient: string;
    idCustomer: number;
   cartId = null;
   datePattern =  "dd MMM yyyy";
   space = '  ';
   heur = "h";
   
    constructor(private readonly parcLigneService: ParcLigneService,
        private readonly confirmationDialogService: ConfirmationDialogService,
        private readonly lignePipe: LignePipe,
        private readonly datePipe: DateFormatPipeFrench) {
        }

     formatOffreCodeoffre(codeOffre: string, offre: string): string {
       if (offre) {
         offre = offre.replace('?', '€'); 
       }
        
       let tmp = '';
       if (!isNullOrUndefined(codeOffre) && codeOffre !== '' && codeOffre !== ' '){

         tmp = tmp.concat(codeOffre).concat(' - ').concat(offre);
       } else {
         tmp = offre;
       }
       return tmp && tmp !== '' ? tmp : '-' ;
     }

    defaultLigne(value: any) {
        let val = '-';
        if(!isNullOrUndefined(value)) {
            val = this.lignePipe.transform(value);
        }
        return val;
    }

    ligne(value: string): string {
        let val = '-';
        if(!isNullOrUndefined(value)) {
            if(isNumber(value) && value.length === 10 && value.charAt(0) === '0') {
                val = value.replace(/(\d{2})/g, '$1 ').replace(/(^\s+|\s+$)/, '');
            } else if (isNumber(value) && value.length === 12 ) {
                val = `${value.substring(0,2)} ${value.substring(2,3)} ${value.substring(3,11).replace(/(\d{2})/g, '$1 ').replace(/(^\s+|\s+$)/, '')}`;
            } else if (isNumber(value) && value.length === 13) {
                val = `${value.substring(0,3)} ${value.substring(3,4)} ${value.substring(4,12).replace(/(\d{2})/g, '$1 ').replace(/(^\s+|\s+$)/, '')}`;
            } else if(!isNumber(value) && (value.length === 10 || value.length === 12 || value.length === 13 )){
                val = '-';
            } else {
                val = value;
            }
        }
        return val;
      }

    defaultAffiche(value: any): string {
        let val = '-';
        if(!isNullOrUndefined(value)) {
                val = value;
            }
        return val ;
    }

    getOperateur(ref: ReferenceDataVO): string {
        if(!isNullOrUndefined(ref)) {
            return ref.label;
        }
        return '-';
    }

    getRenewalLabel(isRestrictedOffer: boolean, hasRenewalPeriod: boolean, authorizedRenewal: boolean): string {
        let value = "";
        if(isRestrictedOffer) {
            if(hasRenewalPeriod && authorizedRenewal) {
                value = "authorized";
            } else {
                value = "unauthorized";
            }
        } else {
            value = "notRestricted";
        }
        return value;
    }

    getTypeImage(value: string): string {
        const type = {
         MOBILE: 'phone-mobile',
         INTERNET: 'internet',
         FIXE: 'phone-home'
        };
        return type[value];
    }

    getStatutRenouv(value: string): string {
        const statutRen = {
            authorized: 'status-green-teleco',
            inProgress: 'status-renewal-done',
            unauthorized: 'status-stop',
            notRestricted: 'status-red'
        };
        return statutRen[value];
    }

    getStatut(nameImage: string): string {
        const imageList = {
          inProgress: 'status-orange',
          ACTIF: 'play',
          ORANGE_VIP: 'vip',
          SUSPENDU: 'pause',
          RESILIE: 'status-red',
          HORS_CONTRAT: 'not-in-contract',
          EN_CREATION: 'in-progress-portabilit',
          DENUMEROTE: 'denumerot',
          ORANGE: 'orange',
          ORANGE_PRO: 'pro',
          ORANGE_BY_PARNASSE: 'orange_by_parnasse'
        };
        return imageList[nameImage];
      }

      /**
       * permet de traiter l affichage btn ou recupere isSuspend la ligne
       * @param nicheContractStatus
       * @param codeStateDoss
       * @param isActive
       */
      isVisibleBtnSuspend(nicheContractStatus: string, codeStateDoss: string, isActive: boolean): boolean {
          let value = false;
          if(nicheContractStatus === "ACTIF" && Number(codeStateDoss) === 10) {
              value = true;
          } else if ((nicheContractStatus === "ACTIF" || nicheContractStatus === "SUSPENDU")
          && Number(codeStateDoss) === 50) {
              if(isActive) {
                value = false;
              }else {
                value = true;
              }
          }
          return value;
      }

      getLabelSuspend(data: any): string {
          let value = "";
          const nicheContractStatus = data.nicheContractStatus; 
          const codeStateDoss =  data.customerParkItemContract ? data.customerParkItemContract.codeStateDoss:'';
          if(nicheContractStatus === "ACTIF" && Number(codeStateDoss) === 10) {
            value = "<span class='icon suspend' ></span>";
        } else if ((nicheContractStatus === "ACTIF" || nicheContractStatus === "SUSPENDU")
        && Number(codeStateDoss) === 50) {
              value = "<span class='icon restore' ></span>";
        }
        return value;
      }

      isVisibleOrActiveUnlock(data:any): boolean {
          let value = false;
          const codeContract = data.customerParkItemContract ? data.customerParkItemContract.codeContract:'';
          const nicheContractStatus = data.nicheContractStatus;
          if((codeContract === CODE_CONTRAT_PARK_ITEM.CODE_CONTRACT_5HD16 ||
            codeContract === CODE_CONTRAT_PARK_ITEM.CODE_CONTRACT_5HD18 ||
            codeContract === CODE_CONTRAT_PARK_ITEM.CODE_CONTRACT_5HD20
            || codeContract === CODE_CONTRAT_PARK_ITEM.CODE_CONTRACT_5HD17 ||
            codeContract === CODE_CONTRAT_PARK_ITEM.CODE_CONTRACT_5HD19)
            && nicheContractStatus === 'ACTIF') {
               value = true;
            }
          return value ;
      }

      isVisibleBtnRefresh(nicheContractStatus: string): boolean {
          let value = true;
          if(nicheContractStatus === "DENUMEROTE" ||
             nicheContractStatus === "RESILIE" ||
             nicheContractStatus === "UNKNOWN" ) {
               value = false;
          }
          return value;
      }

     getLineHolderTypeAndName(lineHolder: ReferenceDataVO, lineHolderName: string):string {
        let lineHolderTypeAndName = "";
        if (!isNullOrUndefined(lineHolder)) {
            lineHolderTypeAndName += lineHolder.label;
        }
        if(!isNullOrUndefined(lineHolder) && lineHolder.label !== "" && !isNullOrUndefined(lineHolderName) && lineHolderName !== ""){
            lineHolderTypeAndName += " - ";
        }
        if(!isNullOrUndefined(lineHolderName) && lineHolderName !== ""){
            lineHolderTypeAndName += lineHolderName
        }
        return lineHolderTypeAndName;
    }

    getTypeRenouvellementOrRemise(renewalMobileClassification: number, isRemise: boolean ): string {
        let value = "-";
        if(renewalMobileClassification === 2 && !isRemise) {
            value = "Mobile Annuel";
         } else if(renewalMobileClassification === 2 && isRemise) {
            value = "800€ Maximum";
        } else if( renewalMobileClassification === 3 && !isRemise) {
            value = "Mobile Annuel Exclusif Monde";
        } else if (renewalMobileClassification === 3 && isRemise) {
            value = "Mobile le plus cher du catalogue";
        }
        return value;
    }


    suspendLine(idParkItem: number, isSuspend: boolean) : Observable<boolean>{
        const subject = new Subject<boolean>();
        this.parcLigneService.suspendOrActiveLine(idParkItem, isSuspend).subscribe(
           data => {
            subject.next(true);
            if(isSuspend === true) {
                this.openConfirmationDialog('Ligne suspendue dans ADV.');
               } else if (isSuspend === false) {
                this.openConfirmationDialog('La ligne sera rétablie dès que possible dans ADV – si vous voulez le faire immédiatement, le faire dans ADV. ');
               }
           },
           (error) => {
            subject.next(true);
            if (error.error.error !== '' && error.error.message !== this.transactionError) {
                this.openConfirmationDialog('Erreur Serveur : ' + error.error.message); 
             } else {
                this.openConfirmationDialog(this.messageError);
             }
            });
         return subject.asObservable();
     }

        deleteLine(idParkItem: number): Observable<boolean> {
            const subject = new Subject<boolean>();
            this.parcLigneService.deleteCustomerParkItem(idParkItem).subscribe(
               data => {
                subject.next(true);
               },
               (error) => {
                subject.next(false);
                this.openConfirmationDialog(this.messageError)
               });

            return subject.asObservable();
          }

          unlockParkItem(idParkItem: number): Observable<boolean> {
            const subject = new Subject<boolean>();
            this.parcLigneService.unlockCustomerParkItem(idParkItem).subscribe(
               data => {
                   if(data === false) {
                    this.openConfirmationDialog(this.messageError);
                   }
                   subject.next(true);
               },
               (error) => {
                subject.next(false);
                this.openConfirmationDialog(this.messageError);
               });
               return  subject.asObservable();
             }

             refreshLigne(idParkItem: number, userId: number): Observable<boolean> {
                 const subject = new Subject<boolean>();
                 this.parcLigneService.refreshCustomerPark(idParkItem, userId).subscribe(
                  data => {
                    subject.next(true);
                     },
                     (error) => {
                        subject.next(false);
                          if (error.error.error !== '' && error.error.message !== this.transactionError) {
                            this.openConfirmationDialog(`Erreur Serveur : ${error.error.message}`);
                         } else {
                            this.openConfirmationDialog(this.messageError);
                         }
                     });
                    return subject.asObservable();
             }


             openConfirmationDialog(message: string): any {
                const title = 'Erreur';
                const btnOkText = 'OK';
                this.confirmationDialogService.confirm(title, message, btnOkText,null,'lg', false)
                .then((confirmed) => console.log(confirmed))
                .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
              }

  horsForfaitComparator(hf1: string, hf2: string): number {
    if (!hf1) {
      hf1 = '-1';
    }
    if (!hf2) {
      hf2 = '-1';
    }
    hf1 = hf1.replace(',', '.');
    hf2 = hf2.replace(',', '.');
    if (parseFloat(hf1) > parseFloat(hf2)) {
        return 1;
    }
    return parseFloat(hf1) < parseFloat(hf2) ? -1 : 0;
  }

  statusRenewalComparator(s1: string, s2: string, param1: any, param2: any): number {
    if (param1.data.universe !== 'MOBILE') {
      s1 = '';
    }
    if (param2.data.universe !== 'MOBILE') {
      s2 = '';
    }
    return s1.localeCompare(s2);
  }

  statusRenewalComparators(s1: string, s2: string, param1: any, param2: any): number {
    if (param1.data.type !== 'MOBILE') {
      s1 = '';
    }
    if (param2.data.type !== 'MOBILE') {
      s2 = '';
    }
    return s1.localeCompare(s2);
  }

  dateRenewalComparator(date1: Date, date2: Date, param1: any, param2: any, universe = 'universe'): number {
    if (param1.data[universe] !== 'MOBILE' || param1.data.rangRenewal !== 'unauthorized') {
      date1 = null;
    }
    if (param2.data[universe] !== 'MOBILE' || param2.data.rangRenewal !== 'unauthorized') {
      date2 = null;
    }
    if ( date1 === null && date2 === null) {
       return 0; 
      }
    if ( date1 === null ) {
       return -1; 
      }
    if ( date2 === null) {
       return 1; 
      }
    if (date1 > date2) {
        return 1
    }
    return date1 < date2 ? -1 : 0;
  }
  dateCreationComparator(date1: Date, date2: Date): number {
  
    if ( date1 === null && date2 === null) { 
      return 0; 
    }
    if ( date1 === null ) {
       return -1;
    }
    if ( date2 === null) {
       return 1; 
    }
    
    return date1 > date2 ? 1 : date1 < date2 ? -1 : 0;
  }

 
  getTimeWithoutHM(dateTime: any){
    let minutes: any;
    let houres : any
    minutes= new Date(dateTime).getMinutes();
    minutes = ((minutes < 10) ? '0' : '') + minutes;
   houres= new Date(dateTime).getHours()+0;
   houres = ((houres < 10) ? '0' : '') + houres ;
   houres =((houres > 23) ? '00' : houres) + this.heur;
    return !isNullOrUndefined(dateTime)  ? this.datePipe.transform(dateTime, this.datePattern)  : "-" ;
  }
  
  getValue(value : string , lastChangeDate : Date){
    const valueConst = !isEmpty(value) ? value + this.space +  (!isNullOrUndefined(lastChangeDate) ? this.getTimeWithoutHM(lastChangeDate) :  '')  : ' -'
  return valueConst
  }
  
 
  
   /**
     * this bloc is for downloading facturette
     * */
    blobToArrayBuffer(base64: any): any {
      const binaryString = window.atob(base64);
      const binaryLen = binaryString.length;
      const bytes = new Uint8Array(binaryLen);
      for (let i = 0; i < binaryLen; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      return bytes;
    }
  
    saveResponseFileAsPdf(reportName: string, byte: any): any {
      const blob = new Blob([byte], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const fileName = reportName;
      window.open(link.href);
      link.download = fileName;
      link.click();
    }
  
}
