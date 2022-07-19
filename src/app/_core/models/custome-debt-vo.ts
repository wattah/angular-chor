import { EntityBase } from './entity-base';

export interface CustomerDebt extends EntityBase {
  dateRecouvrement: Date;
}
