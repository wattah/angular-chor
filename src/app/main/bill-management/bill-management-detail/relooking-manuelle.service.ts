import { Injectable } from '@angular/core';
import { ConfirmationDialogRelookingService } from '../../../_shared/confirmation-dialog-relooking/confirmation-dialog-relooking.service';
import { LivrableVO } from '../../../_core/models/livrable-vo';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BillingService } from '../../../_core/services/billing.service';
import { BehaviorSubject } from 'rxjs';
import { CONSTANTS_BILL, PICTO_PDF } from '../../../_core/constants/bill-constant';

@Injectable({
  providedIn: 'root'
})
export class RelookingManuelleService {

 private readonly livrableResult$ = new BehaviorSubject(null);

  //*****************************************Déclaration de constants et variables *********************** */
  contenuPopupRelook = "Attention! <br> "
  +" Vous êtes sur le point de charger un fichier PDF de votre choix en tant que fichier relooké."
  + " Si le fichier a déjà été généré par Péniche, il sera supprimé et remplacé par le nouveau fichier uploadé manuellement."
  +"Pour annuler cette action, vous devrez supprimer le fichier (bouton poubelle), ré-importer le fichier d'origine et le relooker";
  titleRelooking= 'Attention!';
  continueUpload = 'Je continue le téléchargement';
  cancelUpload = 'J\'annule le téléchargement ';
  titleFormatFileKO = "Erreur";
  contenuPopupFormatFileKO = "Le fichier sélectionné ne respecte pas la bonne nomenclature fichier. "
  + "Veuillez charger un fichier nommé correctement.";
  okPopupFormatFileKO  = "OK";
  contenuSnackBar = "Votre fichier a bien été généré manuellement." +
      "La facture relookée est chargée puis elle passe à l'état "+
      'Relookée manuellement" et au statut "Facture vérifiée" (statut détaillé => "Vérifiée automatiquement")';


   //*****************************************Constructeur *************************************************/
  constructor(private readonly relookingDialog : ConfirmationDialogRelookingService,
              private readonly confiramtionDialog : ConfirmationDialogService,
              private readonly snackBar : MatSnackBar,
              private readonly billingService : BillingService) { }


//*******************************POP UP Confirmation Relooking*********************************************/

popUpRelookingConfirmation(livrable):LivrableVO{ 
    this.relookingDialog.confirm(this.titleRelooking,this.contenuPopupRelook, this.continueUpload, this.cancelUpload,'lg', true)
    .then((files) =>  this.replaceRelookedBill(files[0][0].name,livrable , files[0][0]) )
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

    return null;
  }

//************************************ Traitement **************************************************************/
replaceRelookedBill(nomFichier : string, livrableVo :LivrableVO , file)  {
 const nameFileValid = this.isValidNameBill(nomFichier, livrableVo);
 if(nameFileValid){
   if(livrableVo.livrableId === null){
     livrableVo.livrableId = 0;
   }
  this.billingService.replaceRelookedBill(nomFichier, livrableVo , file).subscribe(data => {
   this.setLivrableResult(data);

    },
    error => {
      this.confiramtionDialog.confirm("", error.error.message, this.okPopupFormatFileKO, "Non", "sm", false);
      this.setLivrableResult(null)
;    },
    () => {
     this.openSnackBar(this.contenuSnackBar);
    }
  );

 }

}
//************************************ Contrôle nom fichier****************************************************/
isValidNameBill(nomFichier : string, livrableVo :LivrableVO): boolean{
    let nameFileValid = false;
    let extentionValid = false;
    const nomFichierTab = nomFichier  ? nomFichier.split('_') : null;
    const periode =  livrableVo.date ? ((livrableVo.date.split('-')  &&  livrableVo.date.split('-').length > 1 )?  
     livrableVo.date.split('-')[0]+livrableVo.date.split('-')[1] : "") : null;
    const univers = livrableVo.univers;
    const extention = nomFichier ? nomFichier.split('.') : null;
     if(extention  && extention[1] && extention[1] === PICTO_PDF){
      extentionValid = true;
     }

     if(livrableVo.type  && livrableVo.type === CONSTANTS_BILL.FACTURE ){
       const isFactureOrAvoir = (!livrableVo.avoir ? nomFichierTab[0].startsWith("FA") : nomFichierTab[0].startsWith("AV")  )
        nameFileValid = nomFichierTab !== null && nomFichierTab.length > 3 && isFactureOrAvoir
                       &&  nomFichierTab[0].substring(2,4) === univers.substring(0,2) && nomFichierTab[1] === livrableVo.clientIdentifier 
                       && nomFichierTab[2] === periode ;
     }

   if(!nameFileValid){
    this.confiramtionDialog.confirm(this.titleFormatFileKO, this.contenuPopupFormatFileKO, this.okPopupFormatFileKO, "Non", "sm", false);
   }
   return nameFileValid && extentionValid;
}

/*************************************** SNACK BAR **************************************/
openSnackBar(text: string): void {
  this.snackBar.open(
    text, undefined, 
    { duration: 3000, panelClass: ['center-snackbar', 'snack-bar-container'] });
}

/*************************************** SET  livrableResult **************************************/
setLivrableResult(val: LivrableVO): void {
  this.livrableResult$.next(val);
}
/*************************************** GET  livrableResult **************************************/
getLivrableResult(): BehaviorSubject<LivrableVO> {
  return this.livrableResult$;
}
/************************************************************************************************** */

}

