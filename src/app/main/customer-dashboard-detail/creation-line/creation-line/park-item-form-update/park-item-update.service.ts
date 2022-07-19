import { Injectable } from '@angular/core';
import { NicheContractStatustValue, NicheContractStatus, NicheContractStatusWithFilter } from '../../../../../_core/enum/customer-park-item-statut.enum';




@Injectable({
  providedIn: 'root'
})
export class ParkItemUpdateService {

  public NicheContractStatustValue = NicheContractStatustValue;

  public selectedStatusList = [];


  constructor( 
    ) {
      console.info('constructor Empty');
     }

  getListContractStatut() : any[]{
  let listOfContractStatusList = [];
 listOfContractStatusList = Object.values(NicheContractStatusWithFilter) ;
 return listOfContractStatusList;
}


setSelectedNicheStatusContractList(nicheContractStatus : string) : any[] {
    if(nicheContractStatus === null){
      this.selectedStatusList = Object.values(NicheContractStatus) ;
    } 
this.getStatusArrayWhenStatusIsEncreation(nicheContractStatus);
this.getStatusArrayWhenStatusIsActifOrSuspendu(nicheContractStatus);
this.getStatusArrayWhenStatusIsResilie(nicheContractStatus)
this.getStatusArrayWhenStatusIsOrangeOrOrangePro(nicheContractStatus);
this.getStatusArrayWhenStatusIsHorsCantractOrangeByPanasseOrOrangeVIP(nicheContractStatus);
this.getStatusArrayWhenStatusIsUnnumbered(nicheContractStatus);

return this.selectedStatusList;
  }
// WHEN STATUS === EN_CREATION
// THEN LIST OF STATUS === EN_CREATION  ORANGE_PRO ACTIF DENUMEROTE
// ORANGE_VIP ORANGE_BY_PARNASSE ORANGE HORS_CONTRAT
getStatusArrayWhenStatusIsEncreation(nicheContractStatus : string): any[]{
           if(nicheContractStatus ===NicheContractStatus[NicheContractStatus.EN_CREATION] ){
               this.selectedStatusList = Object.values([NicheContractStatus.ACTIF, NicheContractStatus.DENUMEROTE
                , NicheContractStatus.EN_CREATION, NicheContractStatus.HORS_CONTRAT, NicheContractStatus.ORANGE 
                ,NicheContractStatus.ORANGE_BY_PARNASSE ,NicheContractStatus.ORANGE_PRO,NicheContractStatus.ORANGE_VIP]); }

            return this.selectedStatusList;
                                                                                }

// WHEN STATUS === RESILIE
// THEN LIST OF STATUS === RESILIE  ORANGE_PRO ACTIF DENUMEROTE
// ORANGE_VIP ORANGE_BY_PARNASSE ORANGE HORS_CONTRAT
getStatusArrayWhenStatusIsResilie(nicheContractStatus : string): any[]{
         if(nicheContractStatus === NicheContractStatus[NicheContractStatus.RESILIE] ){
                 this.selectedStatusList = Object.values([NicheContractStatus.ACTIF, NicheContractStatus.DENUMEROTE, 
                  NicheContractStatus.HORS_CONTRAT, NicheContractStatus.RESILIE,NicheContractStatus.ORANGE, 
                  NicheContractStatus.ORANGE_BY_PARNASSE,
                  NicheContractStatus.ORANGE_PRO, NicheContractStatus.ORANGE_VIP ]);}
     
          return this.selectedStatusList;
                                                                      }

// WHEN STATUS === HORS_CONTRAT OR ORANGE_BY_PARNASSE OR ORANGE_VIP
// THEN LIST OF STATUS === ORANGE  ORANGE_PRO ACTIF DENUMEROTE
// ORANGE_VIP ORANGE_BY_PARNASSE HORS_CONTRAT
getStatusArrayWhenStatusIsHorsCantractOrangeByPanasseOrOrangeVIP(nicheContractStatus : string): any[]{
        if(nicheContractStatus === NicheContractStatus[NicheContractStatus.HORS_CONTRAT] 
        || nicheContractStatus === NicheContractStatus[NicheContractStatus.ORANGE_BY_PARNASSE] 
        || nicheContractStatus === NicheContractStatus[NicheContractStatus.ORANGE_VIP] ){
                this.selectedStatusList = Object.values([NicheContractStatus.ACTIF,NicheContractStatus.DENUMEROTE, 
                  NicheContractStatus.HORS_CONTRAT,NicheContractStatus.ORANGE , 
                  NicheContractStatus.ORANGE_BY_PARNASSE,NicheContractStatus.ORANGE_PRO,NicheContractStatus.ORANGE_VIP]); }
       
        return this.selectedStatusList;
     
       }

// WHEN STATUS === DENUMEROTE 
// THEN LIST OF STATUS === DENUMEROTE ORANGE ORANGE_PRO 
// ORANGE_VIP ORANGE_BY_PARNASSE
getStatusArrayWhenStatusIsUnnumbered(nicheContractStatus : string): any[]{
        if(nicheContractStatus === NicheContractStatus[NicheContractStatus.DENUMEROTE] ){
                  this.selectedStatusList = Object.values([ NicheContractStatus.ORANGE , NicheContractStatus.ORANGE_PRO,
                  NicheContractStatus.DENUMEROTE,NicheContractStatus.ORANGE_VIP,NicheContractStatus.ORANGE_BY_PARNASSE ]);}

        return this.selectedStatusList;
        }

// WHEN STATUS === ACTIF OR SUSPEND
// THEN LIST OF STATUS === RESILIE ORANGE ORANGE_PRO SUSPENDU
//  ACTIF DENUMEROTE HORS_CONTRAT ORANGE_VIP  ORANGE_BY_PARNASSE
getStatusArrayWhenStatusIsActifOrSuspendu(nicheContractStatus : string): any[]{
        if(nicheContractStatus === NicheContractStatus[NicheContractStatus.ACTIF]
          ||  nicheContractStatus === NicheContractStatus[NicheContractStatus.SUSPENDU]){
                 this.selectedStatusList = Object.values([ NicheContractStatus.ACTIF, NicheContractStatus.DENUMEROTE, NicheContractStatus.HORS_CONTRAT
                   ,NicheContractStatus.ORANGE, NicheContractStatus.ORANGE_BY_PARNASSE ,NicheContractStatus.ORANGE_PRO,
                    NicheContractStatus.ORANGE_VIP, NicheContractStatus.SUSPENDU ,NicheContractStatus.RESILIE]);}

        return this.selectedStatusList;
         }

// WHEN Status === ORNAGE OR ORANGE PRO
//THEN LIST OF STATUS === ALL POSSIBLE STATUS
getStatusArrayWhenStatusIsOrangeOrOrangePro(nicheContractStatus : string): any[]{
       if(nicheContractStatus ===NicheContractStatus[NicheContractStatus.ORANGE]  
       || nicheContractStatus ===NicheContractStatus[NicheContractStatus.ORANGE_PRO]  ){
                 this.selectedStatusList = Object.values(NicheContractStatus);}
  
          return this.selectedStatusList;
                                                                               }

 //      
isNewNumberAndDateUnnumberedVisibleAndEdited(nicheContractStatus : string) : boolean{
  
       if(nicheContractStatus === NicheContractStatus[NicheContractStatus.DENUMEROTE]){
             return   true;
         }
       return false;
                                                                                    }
isInputSubscriptionDateVisible(nicheContractStatus : string) : boolean {
        if(nicheContractStatus === NicheContractStatus[NicheContractStatus.EN_CREATION]
          || nicheContractStatus === NicheContractStatus[NicheContractStatus.SUSPENDU] 
          || nicheContractStatus === NicheContractStatus[NicheContractStatus.RESILIE]){
        return true;
    }


  return false;
}

isInputCancelationDateVisible(nicheContractStatus : string) : boolean {
  if(nicheContractStatus === NicheContractStatus[NicheContractStatus.ACTIF]
    || nicheContractStatus === NicheContractStatus[NicheContractStatus.DENUMEROTE] 
    || nicheContractStatus === NicheContractStatus[NicheContractStatus.RESILIE] 
    ){
   return false;
    }


  return true;
}

isPickerCancelationDateVisible(nicheContractStatus : string) : boolean {
  if(nicheContractStatus === NicheContractStatus[NicheContractStatus.RESILIE]){
   return true;
    }

  return false;
}


isPickerSubscribtionDateVisible(nicheContractStatus : string) : boolean {
  if(nicheContractStatus === NicheContractStatus[NicheContractStatus.ACTIF]){
   return true;
    }

  return false;
}






 
}
