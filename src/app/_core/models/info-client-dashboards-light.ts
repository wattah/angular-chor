import { EntityBase } from './entity-base';

/**
 * Contient les données pour afficher une fiche client
 */
export interface InfoClientDashboardsLight extends EntityBase {
  
  dateSignature: string;
  datePaiement: string;
  dateNaissance: string;
  dateProchainRDV: string;
  nbrTotalSAV: Number;
  nbrTotalHome: Number;
  nbrTotalHumeurMembre: Number;
  nbrTotalRemplacementMobile: Number;
  nbrTotalRecouvrement: Number;
  age: Number;
  ageInscri: Number;
  moisInscri: Number;
  nbrTotalEvenement: Number;
  nbrTotalInsatisfaction: Number;
  nbrTotalInteraction: number;
  isEntreprise: boolean;
  interactionId: number;
  interactionRequestId: number;  
}
