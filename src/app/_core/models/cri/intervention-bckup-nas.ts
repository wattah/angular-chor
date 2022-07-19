import { EntityBase } from './../entity-base';
export interface InterventionBackupNas extends EntityBase{
    id: number;
	isApple: boolean;
	isWindows: boolean;
	isDsm: boolean;
	description: string;
	compteUserUtilise: string;
	motDePasse: string;
	utilitaireUtilise: string;
	dossierPartage: string;
	interventionNasId: number;
}
