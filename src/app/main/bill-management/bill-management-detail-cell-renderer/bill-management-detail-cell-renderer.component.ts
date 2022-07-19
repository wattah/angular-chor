import { HistorqueLivrable } from './../../../_core/models/historque-livrable';
import { PenicheLigneErreurAndWariningResponseVO } from './../../../_core/models/peniche-ligne-erreur-response-vo';
import { STATUT_LIVRABLE, SOUS_ETAT_LIVRABLE_MESSAGE, MESSAGE_STATUS } from './../../../_core/constants/constants';
import { LivrableVO } from './../../../_core/models/livrable-vo';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'app-bill-management-detail-cell-renderer',
  templateUrl: './bill-management-detail-cell-renderer.component.html',
  styleUrls: ['./bill-management-detail-cell-renderer.component.scss']
})
export class BillManagementDetailCellRendererComponent implements ICellRendererAngularComp {
  dossiers: string[] = [];
  livrableStatus: string;
  data: LivrableVO;
  LOCAL_STATUT_LIVRABLE = STATUT_LIVRABLE;
  status: string;
  formattedStatus: string;
  erreursAndWarnings: PenicheLigneErreurAndWariningResponseVO[] = [];
  erreurs: PenicheLigneErreurAndWariningResponseVO[] = [];
  warnings: PenicheLigneErreurAndWariningResponseVO[]=[];
  messageLivrableStatus: string;
  historiquesStatutsAsString: string;
  historiques: HistorqueLivrable[] = [];
  controles: string[] = [];
  SEPARATEUR_WEB_SERVICES = ';;';
  FIELD_SEPARATEUR_WEB_SERVICES = '!!';
  isAvoirComplementaire = false;

  agInit(params: any): void {
    if (params) {
      this.data = params.data;
      this.dossiers = this.data.dossiers;
      this.livrableStatus = this.data.livrableStatus;
      this.messageLivrableStatus = this.getMessageLivrableStatus();
      this.status = this.data.status;
      this.formattedStatus = this.getFormattedStatus(this.status);
      this.erreursAndWarnings = this.data.erreurs;
      this.filterErreursAndWarningsByServite();
      this.historiquesStatutsAsString = this.data.historiquesStatuts;
      this.historiques = this.mappeHistoriquesStatus();
      this.controles = this.mappeControles(this.data.controles);
      this.isAvoirComplementaire = this.data.avoirComplementaire;
    }
  }
  /**
   * to mappe controls string of string to array of string
   * EX : "controles": "Hors-forfait : 1,000 >= 800;;Première facture;;Nouvelle Ligne : 0788302020",
   */
  mappeControles(controles: string): string[] {
    if(controles && controles.length !== 0){
      return controles.split(this.SEPARATEUR_WEB_SERVICES);
    }
    return [];
  }
  /**
   * to mappe historique from string value to object valeu
   * EX: historiquesStatutsAsString => 01/10/2009!!00:00:00!!FOND_VALIDE_SI
   */
  mappeHistoriquesStatus(): HistorqueLivrable[] {
    if(this.historiquesStatutsAsString){
      const historiquesStatutsAsArray = this.historiquesStatutsAsString.split(this.SEPARATEUR_WEB_SERVICES);
      return historiquesStatutsAsArray.map(
        (historiquesStatuts)=> this.mappeHistorique(historiquesStatuts)
      );
    }
  }
  mappeHistorique(historiquesStatuts: string): HistorqueLivrable {
    const historiqueObject = {} as HistorqueLivrable;
    const historique = historiquesStatuts.split(this.FIELD_SEPARATEUR_WEB_SERVICES);
    if(historique && historique.length !== 0){
      historiqueObject.date = historique[0];
      historiqueObject.time =  historique[1];
      historiqueObject.status = this.getFormattedStatus(historique[2]);
    }
    return historiqueObject;
  }
  /**
   * if severite 1 erreurs  , if 0 warnings
   */
  private filterErreursAndWarningsByServite(): void {
    if (this.erreursAndWarnings && this.erreursAndWarnings.length !== 0) {
      const erreursAndWarningsToBeFilterToErreurs =  this.data.erreurs.slice();
      const erreursAndWarningsToBeFilterToWarnings =  this.data.erreurs.slice();
      this.erreurs = erreursAndWarningsToBeFilterToErreurs.filter(erreur => erreur.severite === 1);
      this.warnings = erreursAndWarningsToBeFilterToWarnings.filter(erreur => erreur.severite === 0);
    }
  }

  getMessageLivrableStatus(): string {
    switch (this.livrableStatus) {
      case MESSAGE_STATUS.ORIGINAL_ABSENT.STATUS:
        return MESSAGE_STATUS.ORIGINAL_ABSENT.MESSAGE;
      case MESSAGE_STATUS.DONNEES_STOCKEES.STATUS:
        return MESSAGE_STATUS.DONNEES_STOCKEES.MESSAGE;
      case MESSAGE_STATUS.GENERE.STATUS:
        return MESSAGE_STATUS.GENERE.MESSAGE;
      case MESSAGE_STATUS.GENERE_ERREUR.STATUS:
        return MESSAGE_STATUS.GENERE_ERREUR.MESSAGE;
      case MESSAGE_STATUS.GENERE_WARNING.STATUS:
        return MESSAGE_STATUS.GENERE_WARNING.MESSAGE;
      case MESSAGE_STATUS.FICHIER_RELOOKE_MANUELLEMENT.STATUS:
        return MESSAGE_STATUS.FICHIER_RELOOKE_MANUELLEMENT.MESSAGE;
      default:
        return MESSAGE_STATUS.ORIGINAL_ABSENT.MESSAGE;
    } 
  }
  getFormattedStatus(status: string): string {
    switch(status){
      case SOUS_ETAT_LIVRABLE_MESSAGE.FOND_A_VALIDER_METIER.ETAT:
        return SOUS_ETAT_LIVRABLE_MESSAGE.FOND_A_VALIDER_METIER.MESSAGE;
      case SOUS_ETAT_LIVRABLE_MESSAGE.FORME_A_VALIDER_METIER.ETAT:
        return SOUS_ETAT_LIVRABLE_MESSAGE.FORME_A_VALIDER_METIER.MESSAGE;
      case SOUS_ETAT_LIVRABLE_MESSAGE.FORME_INVALIDE_METIER_CORRIGE.ETAT:
        return SOUS_ETAT_LIVRABLE_MESSAGE.FORME_INVALIDE_METIER_CORRIGE.MESSAGE;
      case SOUS_ETAT_LIVRABLE_MESSAGE.FOND_INVALIDE_METIER_ATTENTE_CORRECTION.ETAT:
        return SOUS_ETAT_LIVRABLE_MESSAGE.FOND_INVALIDE_METIER_ATTENTE_CORRECTION.MESSAGE;
      case SOUS_ETAT_LIVRABLE_MESSAGE.FORME_INVALIDE_METIER_ATTENTE_CORRECTION.ETAT:
        return SOUS_ETAT_LIVRABLE_MESSAGE.FORME_INVALIDE_METIER_ATTENTE_CORRECTION.MESSAGE;
      case SOUS_ETAT_LIVRABLE_MESSAGE.FORME_VALIDE_METIER.ETAT:
        return SOUS_ETAT_LIVRABLE_MESSAGE.FORME_VALIDE_METIER.MESSAGE;
      case SOUS_ETAT_LIVRABLE_MESSAGE.FORME_VALIDE_SI.ETAT:
        return SOUS_ETAT_LIVRABLE_MESSAGE.FORME_VALIDE_SI.MESSAGE;
      case SOUS_ETAT_LIVRABLE_MESSAGE.ARCHIVE.ETAT:
        return SOUS_ETAT_LIVRABLE_MESSAGE.ARCHIVE.MESSAGE;
      case SOUS_ETAT_LIVRABLE_MESSAGE.A_ENVOYER.ETAT:
        return SOUS_ETAT_LIVRABLE_MESSAGE.A_ENVOYER.MESSAGE;
      case SOUS_ETAT_LIVRABLE_MESSAGE.ENVOYE.ETAT:
        return SOUS_ETAT_LIVRABLE_MESSAGE.ENVOYE.MESSAGE;
      case SOUS_ETAT_LIVRABLE_MESSAGE.FOND_VALIDE_SI.ETAT:
        return SOUS_ETAT_LIVRABLE_MESSAGE.FOND_VALIDE_SI.MESSAGE;
      case SOUS_ETAT_LIVRABLE_MESSAGE.EN_RETARD.ETAT:
      case SOUS_ETAT_LIVRABLE_MESSAGE.EN_ATTENTE.ETAT:
        return SOUS_ETAT_LIVRABLE_MESSAGE.EN_RETARD.MESSAGE;
      default:
        return '';
    }
  }

  refresh(params: any): boolean {
    if (params) {
      this.data = params.data;
    }
    return false;
  }

}
