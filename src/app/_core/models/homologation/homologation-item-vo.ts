import { EntityBase } from '../entity-base';

export interface HomologationItemVO extends EntityBase {
  id: number;
  homologationId: number;
  hasThirdPayer: boolean;
  thirdPayerName: string;
  thirdPayerCompanyName: string;
  paymentMethod: string;
  options: string[];
  cbAmexToken: string;
  cbAmexDateFin: Date;
  ibanTokenCodeIban: string;
  ibanTokenCodeBanque: string;
  ibanTokenCodeGuichet: string;
  ibanTokenNumeroCompte: string;
  ibanTokenCleRib: string;
  ibanTitulaireCompte: string;
}
