import { PenicheLineDetailsVO } from './peniche-line-details-vo';


export interface PenicheBillCreditComplementaryVO {
    id : number;
    referenceBillNumber : string;
    billAccountNumber : string;
    billNumber : string;
    type : string;
    transmitDate : Date;
    clientNumber : string;
    linesList : PenicheLineDetailsVO[];
    deductionCredit : boolean;
}