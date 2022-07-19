import { CustomerRecoveryVO } from './customer-recovery-vo';
import { PenicheBillAccountLightVO } from './peniche-bill-account-light-vo';

export interface PenicheCustomerResponseVO {
  trigramme: string;
  identifier: string;
  typology: string;
  billReport: boolean;
  status: string;
  title: string;
  lastName: string;
  firstName: string;
  society: string;
  siren: string;
  address2: string;
  address3: string;
  address4: string;
  address5: string;
  address6: string;
  cedex: string;
  deliveryInfo: string;
  orasId: number;
  inseeId: string;
  rivoliId: string;
  streetNumber: number;
  streetExtension: string;
  streetType: string;
  streetName: string;
  geocodeX: number;
  geocodeY: number;
  country: string;
  city: string;
  zipCode: string;
  alias: string;
  nicheAdmissionDate: string;
  terminationDate: string;
  billingDay: number;
  billingTime: number;
  timeBeforeBilling: number;
  mailNotification: string;
  idMailNotification: number;
  mailOldNotification: string;
  idMailOldNotification: number;
  typeEnvoi: PenicheTypeEnvoiLivrable;
  billAccounts: PenicheBillAccountLightVO[];
  recoveryData: CustomerRecoveryVO;
}

export class PenicheTypeEnvoiLivrable {
  static  MAIL = "MAIL";
  static  MANUEL = "MANUEL";
  static  PAPIER_AUTO = "PAPIER_AUTO";
  static  ANNULE = "ANNULE";
}
