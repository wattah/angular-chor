import { HomologationParticipantAdresseVO } from './homologation-participant-adresse-vo';

export interface HomologationParticipantVO {
  id: number;
  title: string;
  lastname: string;
  firstname: string;
  companyName: string;
  phoneNumber: string;
  mail: string;
  mailForBilling: string;
  prehomologationDecision: boolean;
  prehomologationComment: string;
  prehomologationDecisionDate: Date;
  homologationDecision: boolean;
  homologationComment: string;
  homologationDecisionDate: Date;
  commiteeSelectionRequest: boolean;
  commiteeSelectionDate: Date;
  siren: string;
  adressesList: HomologationParticipantAdresseVO[]; 
}
