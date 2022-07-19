import { HomologationItemVO } from './homologation-item-vo';

export interface HomologationServiceVO extends HomologationItemVO {
  offer: string;
  contractCode: string;
}
