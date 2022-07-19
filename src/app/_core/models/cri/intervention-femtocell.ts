import { EntityBase } from './../entity-base';
export interface InterventionFemtocell extends EntityBase {
    id: number;
	ndBeneficiaire: string;
	emplacementFemtocell: string;
	interventionDetailId: number ;
	otherNumbersTitulaire: string[];
	numImei: string;
	comment: string;
	impactedLineId: number;
	impactedLineLabel: string;
	otherLine: string;
}
