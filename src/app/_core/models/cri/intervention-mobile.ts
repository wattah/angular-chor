import { EntityBase } from './../entity-base';
export interface InterventionMobile extends EntityBase{
    id: number;
	marque: string;
	modele: string;
	capacite: string;
	couleur: string;
	isAssurance: string;
	isRenouvellement: string;
	isSav: boolean;
	interventionDetailId: number;
	numImei: string;
	comment: string;
	otherLine: string;
	impactedLineId: number;
	impactedLinelabel: string;
}
