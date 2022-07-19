import { FamilyVO } from "./family-vo";

export interface AdminProductVO {
  id: number;
  discountPercent: number;
  showingAnnualReport: boolean;
  purchasePrice: number;
  priceHt: number;
  showingPortal: boolean;
  status: string;
  warrantyLabel: string;
  family: FamilyVO;
  included: boolean;
  ismodified: boolean;
  discountFree: boolean;
  tva: string;
  purchasePriceReal: number;
  pricingType: string;
  pricingTypeReal: string;
  isWarranty: boolean;
  ecoTaxe: number;
  discountHt: number;
  blocked: boolean;
  libelleFacture: string;
  fixedMarginRate: number;
  fixedMarginRateReal: number;
  prixSurDemande: boolean;
  discountIncluded: boolean;
  discountLabel: string;
  customerTarget: string;
}