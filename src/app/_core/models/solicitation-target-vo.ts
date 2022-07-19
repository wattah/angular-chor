import { ReferenceDataVO } from './reference-data-vo';
import { SolicitationVO } from './solicitation-vo';
import { SolicitationCriterionVO } from './solicitation-criterion-vo';

export interface SolicitationTargetVO {
    id: number;
    solicitation: SolicitationVO;
    person: number;
    outputStatus: ReferenceDataVO;
    reason: ReferenceDataVO;
    disableByResponse: boolean;
    disableByCriterion: boolean;
    proactifRdv: number;
    timeLaps: Date;
    isActive: boolean;
    createdAt: Date;
    createdBy: number;
    modifiedAt: Date;
    modifiedBy: number;
    criterions: SolicitationCriterionVO[];
    groupingComplementValue: number;
    groupingType: string;
    groupingLabel: string;
    groupingTypesAddress: string;
    subjectTitleLabel: string;
    subjectCategory: string;
    customerName: string;
    proposedDate: Date;
    typeRdvGenerated: string;
    noMoreSolicitation: boolean;
    interaction: string;
    comment: string;
    lastModifier: string;
  }
