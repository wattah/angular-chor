import { EntityBase } from './../entity-base';
export interface InterventionLandLine extends EntityBase{
    id: number;
	nd: string;
	dtiLocation: string;
	suplementInfo: string;
	interventionDetailId: number;
	comment: string;
	sucloc: string;
}
