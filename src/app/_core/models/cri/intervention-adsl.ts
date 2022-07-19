import { ReferenceDataVO } from './../reference-data-vo';
export interface InterventionAdsl{
    id: number;
	aid: string;
	ndVoip: string;
	isOffrePro: boolean;
	identifiantConnexion: string;
	passwordConnexion: string;
    refLocationType: ReferenceDataVO;
	interventionDetailId: number;
	comment: string;
	sucloc: string;
	autreEmplacement: string;
}
