import { ReferenceDataVO } from './../reference-data-vo';
import { EntityBase } from './../entity-base';
export interface InterventionComptesUsersNas extends EntityBase{
    id: number;
    isUser: boolean;
    isAdmin: boolean;
	nom: string;
	login: string;
	password: string;
	refNasMusique: ReferenceDataVO[];
	refNasPhotos: ReferenceDataVO[];
	refNasVideos: ReferenceDataVO[];
	interventionNasId: number;
	email: string;
}
