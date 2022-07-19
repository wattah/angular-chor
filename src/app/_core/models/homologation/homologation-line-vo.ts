import { HomologationItemVO } from './homologation-item-vo';

export interface HomologationLineVO extends HomologationItemVO {
  lineNumber: string;
  forfait: string;
  isLineTransfer: boolean;
  lineOrigin: string;
  rio: string;
  refLineHolder: string;
  lineUser: string;
  untokenizeIBAN: string;
}
