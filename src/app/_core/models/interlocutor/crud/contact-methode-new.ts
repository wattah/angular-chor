import { CmPostalAddressVO } from '../../cm-postaladdress-vo';
import { ReferenceDataVO } from '../../reference-data-vo';

export class ContactMethodNew {
    typeKey: string;
    types: ReferenceDataVO[];
    value: string;
    refMediaKey: string;
    addressPostal: CmPostalAddressVO;
    isPro: boolean;
    idCm: number;
    personId: number;
    constructor(idCm: number, type: string, value: string, refKey: string, address: CmPostalAddressVO, isPro: boolean) {
        this.typeKey = type;
        this.value = value;
        this.refMediaKey = refKey;
        this.addressPostal = address;
        this.isPro = isPro;
        this.idCm = idCm;
    }
    
}
