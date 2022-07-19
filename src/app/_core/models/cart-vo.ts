import { RequestVO } from './request/crud/request';
import { CartItemVO } from './cart-item-vo';
import { ReferenceDataVO } from './reference-data-vo';
import { UserVo } from './user-vo';
import { CommandOrderVo } from './command-order-vo';
import { PostalAdresseVO } from './postalAdresseVO';

export interface CartVO {
  id: number;
  createdAt: Date;
  modifiedAt: Date;
  statusModifiedAt: Date;
  request: RequestVO;
  items: CartItemVO[];
  userId: number;
  modifiedById: number;
  status: string;
  billAccountId: string;
  quotationDescription: string;
  billNumber: string;
  parkItemId: number;
  interventionOnLine: boolean;
  quotationPostalAddressId: number;
  deliveryPostalAddressId: number;
  useOfferServiceCounter: boolean;
  orderId: number;
  margin: number;
  marginReal: number;
  orderStatus: string;
  deliveringModeRef: ReferenceDataVO;
  dateAndTimeToAvoid: string;
  desiredDate: Date;
  refDesiredTime: ReferenceDataVO;
  contactForDelivery: string;
  contactMobilePhoneNumber: string;
  confirmationSMS: string;
  coachToNotify: UserVo;
  coachNotificationParnassePhoneNumber: string;
  title: string;
  commandOrders: CommandOrderVo[];
  stockToUse: string;
  deliveryToParnasse: boolean;
  deliveryToRiviera: boolean;
  taskWellClosed: boolean;
  isTaskAutomaticClose: boolean;
  isPrioritized: boolean;
  calculateMargePourcent: string;
  calculateMargeEuro: string;
  deliveryPostalAddressNewVo : PostalAdresseVO;
  arrow: string;
  quotationPostalAddressNewVo : PostalAdresseVO;
  billAccountNicheIdentifiant : string;
  /**
   * @auther fsmail
   * Recover : Ce champs est  propre ) l'objet CARTSAV
   * il est ajouté uniquement pour envoyer ça valeur  depuis le Child (DELIVERY)
   * au Parent (Cart-creation ) afin de le setter dans l'objet cartSav envoyé depuis 
   * le child (SAV) au au Parent (Cart-creation )
   */
  isRecover : boolean;
  isBlocked: boolean;
  }
