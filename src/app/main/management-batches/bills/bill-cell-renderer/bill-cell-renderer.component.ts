import { Component } from '@angular/core';
import { STATUT_LIVRABLE, SOUS_ETAT_LIVRABLE_MESSAGE, MESSAGE_STATUS, UNIVERS_PENICHE } from './../../../../_core/constants/constants';
import { PenicheLigneErreurAndWariningResponseVO } from './../../../../_core/models/peniche-ligne-erreur-response-vo';
import { HistorqueLivrable } from './../../../../_core/models/historque-livrable';
import { isNullOrUndefined } from './../../../../_core/utils/string-utils';

@Component({
  selector: 'app-bill-cell-renderer',
  templateUrl: './bill-cell-renderer.component.html',
  styleUrls: ['./bill-cell-renderer.component.scss']
})
export class BillCellRendererComponent {


  isAvoirComplementaire = false;
  listLignesAssocie: string[] = [];
  messageStatus: string;
  status: string;
  etat: string;
  SEPARATEUR_WEB_SERVICES = ';;';
  FIELD_SEPARATEUR_WEB_SERVICES = '!!';
  errorsAndWarnings: PenicheLigneErreurAndWariningResponseVO[] = [];
  errors: PenicheLigneErreurAndWariningResponseVO[] = [];
  warnings: PenicheLigneErreurAndWariningResponseVO[]=[];
  historiquesStatuts: string;
  historiques: HistorqueLivrable[] = [];
  controles: string[] = [];
  LOCAL_STATUT_LIVRABLE = STATUT_LIVRABLE;
  isMobile = false;

  data: any;
  agInit(params: any): void {
    if (params) {
      this.data = params.data;
      this.isMobile = params.data.univers === UNIVERS_PENICHE.MOBILE.code;
      this.listLignesAssocie = this.data.dossiers;
      this.status = this.data.livrableStatus;
      this.messageStatus = this.getMessageStatus();
      this.isAvoirComplementaire = this.data.avoirComplementaire;
      this.etat = this.getEtat(this.data.status);
      this.errorsAndWarnings = this.data.erreurs;
      this.filterErrorsAndWarnings();
      this.historiquesStatuts = this.data.historiquesStatuts;
      this.historiques = this.getHistoriquesStatus();
      this.controles = this.getListControles(this.data.controles);
    }
  }

  getMessageStatus(): string {
    switch (this.status) {
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

  getEtat(etat: string): string {
    switch(etat){
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
      default:
        return '';
    }
  }

   private filterErrorsAndWarnings(): void {
    if (this.errorsAndWarnings &&
       this.errorsAndWarnings.length !== 0 &&
       !isNullOrUndefined(this.data) &&
       !isNullOrUndefined(this.data.erreurs)) {
      const erreursAndWarningsToBeFilterToErreurs =  this.data.erreurs.slice();
      const erreursAndWarningsToBeFilterToWarnings =  this.data.erreurs.slice();
      this.errors = erreursAndWarningsToBeFilterToErreurs.filter(error => error.severite === 1);
      this.warnings = erreursAndWarningsToBeFilterToWarnings.filter(error => error.severite === 0);
    }
  }

   getHistoriquesStatus(): HistorqueLivrable[] {
    if(this.historiquesStatuts){
      const listHistoriquesStatuts = this.historiquesStatuts.split(this.SEPARATEUR_WEB_SERVICES);
      return listHistoriquesStatuts.map(
        (historiquesStatuts) => this.getHistorique(historiquesStatuts)
      );
    }
    return [];
  }

  getHistorique(values: string): HistorqueLivrable {
    const historiqueLivrable = {} as HistorqueLivrable;
    const historiques = values.split(this.FIELD_SEPARATEUR_WEB_SERVICES);
    if(historiques && historiques.length !== 0){
      historiqueLivrable.date = historiques[0];
      historiqueLivrable.time =  historiques[1];
      historiqueLivrable.status = this.getEtat(historiques[2]);
    }
    return historiqueLivrable;
  }

   getListControles(values: string): string[] {
    if(values && values.length !== 0){
      return values.split(this.SEPARATEUR_WEB_SERVICES);
    }
    return [];
  }
}
