import { EntityBase } from './../entity-base';
export interface InterventionAutreStNas extends EntityBase{
    id: number;
	interventionNasId: number;
	autreStation: string;
	autrePort: string;
}
