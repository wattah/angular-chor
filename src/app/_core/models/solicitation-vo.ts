import { SolicitationCriterionVO } from './solicitation-criterion-vo';

export interface SolicitationVO {
    id: number;
    title: string;
    subject: number;
    startDate: Date;
    endDate: Date;
    description: string;
    isAutomatic: boolean;
    isMarketingCampaign: boolean;
    document: number;
    isStartRdv: boolean;
    createdAt: Date;
    createdBy: number;
    modifiedAt: Date;
    modifiedBy: number;
    criterions: SolicitationCriterionVO[];
    categorySolicitation: string;
    typeRdvGenerated: string[];
}
