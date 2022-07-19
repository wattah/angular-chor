import { STATUT_LIVRABLE, SousEtatLivrable as UNDER_STATUS_LIVRABLE, TYPE_BIll } from "../constants/constants";
import { SEPARATOR_DATE, UNIVERS_MOBILE, UNIVERS_SERVICE } from "../constants/bill-constant";
import { LivrableVO } from "../models/livrable-vo";
import { isNullOrUndefined } from "./string-utils";

export function checkValidateToDeleteOrDownloadOrRelooking(params, isDeleteOrRelooking: boolean): boolean {
    if(!isNullOrUndefined(params) && !isNullOrUndefined(params.data)){
      const bill: LivrableVO = params.data;
      if(checkIsArchive(bill) && !isDeleteOrRelooking){
        return true;
      }
      const billStatus = !isNullOrUndefined(bill.livrableStatus) ? bill.livrableStatus : '';
      return isDeleteOrRelooking ? checkIsGenereAndRelooking(billStatus) && !checkIsArchive(bill) :
        checkIsGenereAndRelooking(billStatus);
     }
    return false;
  }

  export function checkIsArchive(bill: LivrableVO): boolean {
    return bill.status === UNDER_STATUS_LIVRABLE.ARCHIVE ||
      bill.status === UNDER_STATUS_LIVRABLE.A_ENVOYER ||
      bill.status === UNDER_STATUS_LIVRABLE.ENVOYE;
   }
  export function checkValidateToPadlock(params): boolean {
    if(!isNullOrUndefined(params) && !isNullOrUndefined(params.data)){
      const bill: LivrableVO = params.data;
        return !isNullOrUndefined(bill) && checkIsArchive(bill);
      }
      return false;
   }

   export function checkValidateToParameters(params): boolean {
    if(!isNullOrUndefined(params) && !isNullOrUndefined(params.data)){
      const bill: LivrableVO = params.data;
      const billStatus = !isNullOrUndefined(bill.livrableStatus) ? bill.livrableStatus : '';
      const status = !isNullOrUndefined(bill.status) ? bill.status : '';
      return (checkIsGenereAndRelooking(billStatus) &&
               (status === UNDER_STATUS_LIVRABLE.FOND_INVALIDE_METIER_ATTENTE_CORRECTION ||
                status === UNDER_STATUS_LIVRABLE.FORME_INVALIDE_METIER_ATTENTE_CORRECTION ||
                status === UNDER_STATUS_LIVRABLE.FOND_A_VALIDER_METIER ||
                status === UNDER_STATUS_LIVRABLE.FORME_A_VALIDER_METIER));
      }
      return false;
    }

    export function checkAddAvoir(params): boolean {
      if(!isNullOrUndefined(params) && !isNullOrUndefined(params.data)){
        const bill: LivrableVO = params.data;
        const billStatus = !isNullOrUndefined(bill.livrableStatus) ? bill.livrableStatus : '';
        return bill.univers === UNIVERS_MOBILE  && bill.avoir === false && bill.avoirComplementaire === false && checkIsGenereAndRelooking(billStatus);
      }
      return false;
    }

    export function checkBlueCard(params): boolean {
      if(!isNullOrUndefined(params) && !isNullOrUndefined(params.data)){
        const bill: LivrableVO = params.data;
        const billStatus = !isNullOrUndefined(bill.livrableStatus) ? bill.livrableStatus : '';
        return bill.univers === UNIVERS_SERVICE &&
               checkIsGenereAndRelooking(billStatus) &&
               !bill.archive;
      }
      return false
    }

    export function checkIsGenereAndRelooking(billStatus: string): boolean {
        return (billStatus === STATUT_LIVRABLE.GENERE ||
                 billStatus === STATUT_LIVRABLE.GENERE_ERREUR ||
                 billStatus === STATUT_LIVRABLE.GENERE_WARNING ||
                 billStatus === STATUT_LIVRABLE.FICHIER_RELOOKE_MANUELLEMENT);
    }

    export function checkIsNameValide(bill: LivrableVO, nameFile: string): boolean {
      let nomFichierOK = false;
			const periode =  getPeriode(bill);
      if ((bill.type === TYPE_BIll.FACTURE) && (!bill.avoir)) {
        const patternFA = /^FA((.){2})_((\d)*)_((\d){6})(_)?(.)*\.pdf/gi;
        const resFA  = patternFA.exec(nameFile);
        nomFichierOK = (resFA !== null && resFA[1] === bill.univers.substring(0, 2) && resFA[3] === bill.clientIdentifier &&
         periode === resFA[5]);
      } else if ((bill.type === TYPE_BIll.FACTURE) && (bill.avoir)) {
        var patternAV = /^AV((.){2})_((\d)*)_((\d){6})(_)?(.)*\.pdf/gi;
        var resAV  = patternAV.exec(nameFile);
        nomFichierOK = (resAV !== null && resAV[1] === bill.univers.substring(0, 2) && resAV[3] === bill.numero &&
         periode === resAV[5]);
      } else if (bill.type === TYPE_BIll.CR) {
        const patternCR = /^CRFA_((\d)*)_((\d){6})(_)?(.)*\.pdf/gi;
        const resCR = patternCR.exec(nameFile);
        nomFichierOK = (resCR != null && resCR[1] === bill.numero && periode === resCR[3]);
      }
      return nomFichierOK;
}
export function getPeriode(bill): string {
  if(bill.date && bill.date.split(SEPARATOR_DATE) && bill.date.split(SEPARATOR_DATE).length > 1) {
    return `${bill.date.split(SEPARATOR_DATE)[0]}${bill.date.split(SEPARATOR_DATE)[1]}`;
  }
  return  "";
}
