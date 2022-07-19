import { EntityBase } from './entity-base';

export interface InfoCustomerHomologation extends EntityBase {

    idCustomer: number;
    nicheIdentifier: string;
    statutCustomer: string;
    idPerson: number;
    firstName: string;
    lastName: string;
    companyName: string;
    crmName: string;
    idRefMembershipReason2: number;
    keyRefMembershipReason2: string;
    labelRefMembershipReason2: string;
    idRefParnasseKnowledge: number;
    keyRefParnasseKnowledge: string;
    labelRefParnasseKnowledge: string;    
    idRefMembershipReason: number;
    keyRefMembershipReason: string;
    labelRefMembershipReason: string;
    membershipReasonComment: string;
  }