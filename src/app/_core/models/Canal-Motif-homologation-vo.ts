import { EntityBase } from './entity-base';
import { AcquisitionCanalVO } from './acquisition-canal-vo';

export interface CanalMotifHomologation extends EntityBase {

    customerId: string;
    membershipReasonId: number;
    membershipReason2Id: number;
    membershipReasonComment: string;
    refParnasseKnowledgeId: number;
    acquisitionsCanaux: AcquisitionCanalVO[];
  }