import { PostalAdresseVO } from './postalAdresseVO';
import { EntityBase } from './entity-base';

export interface SharedDataDeliveryCartVo extends EntityBase {
  stock : string;
  modeDelivery: string;
  recepientNumberContactChangedValue: string;
  coachNameChangedValue : string;
  addresseChangedValue : PostalAdresseVO;
  recepientNameChangedValue: PostalAdresseVO;

 
}
