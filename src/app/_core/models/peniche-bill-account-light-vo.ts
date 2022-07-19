import { PenicheBillAccountLineVO } from './peniche-bill-account-line-vo';

export interface PenicheBillAccountLightVO extends Comparable<PenicheBillAccountLightVO> {
    billAccountUniverse: string;
    billAccountIdentifier: string;
    billAccountStatus: string;
    billAccountBalance: number;
    billAccountName: string;
    billAccountAlias: string;
    billAccountRecurrent: boolean;
    billAccountBillingDay: number;
    billAccountPaymentMode: string;
    billAccountPayerTitle: string;
    billAccountPayerLastName: string;
    billAccountPayerFirstName: string;
    billAccountPayerCompany: string;
    billAccountTitularTitle: string;
    billAccountTitularLastName: string;
    billAccountTitularFirstName: string;
    billAccountTitularCompany: string;
    billAccountTitularAddress: string;
    billAccountPayerAddress: string;
    billAccountTvaExemption: boolean;
    billAccountLines: PenicheBillAccountLineVO[];
    billAccountNicheIdentifiant: string;
    billAccountRecurrentLabel: string;
    paymentModeLabel: string;
    payerName: string;
  }
  
export interface Comparable<T> {
  id: number;
}
