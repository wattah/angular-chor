import { ReferenceDataVO } from './reference-data-vo';
import { EntityBase } from './entity-base';

export interface CmPostalAddressVO extends EntityBase {
  idContactMethode: number;
  title: string;
  firstName: string;
  lastName: string;
  addrLine4: string;
  addrLine3: string;
  addrLine2: string;
  addrLine5: string;
  addrLine6: string;
  logisticInfo: string;
  cedex: string;
  orasId: number;
  postalCode: string;
  city: string;
  country: string;
  companyName: string;
  socialTitle: ReferenceDataVO;
  refCountry: ReferenceDataVO;
  streetName: string;
  streetExtension: string;
  streetNumber: number;
  streetType: string;
  geoCodeX: number;
  geoCodeY: number;
  inseeCode: string;
  rivoliCode: string;
  hexacleVoie: string;
  hexacleNumero: string;
  active: boolean;
  id: number;
  description: string;
  personId: number;
  typeKey: string;

}

