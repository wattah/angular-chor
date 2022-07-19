import { InterventionSonosDetail } from './intervention-sonos-detail';
import { ReferenceDataVO } from './../reference-data-vo';
import { EntityBase } from './../entity-base';
export interface InterventionSonos extends EntityBase{
    id: number;
	isTplink: boolean;
	refTplinkLocationType: ReferenceDataVO;	
	tplinkLocationComment: string;
    identifiantSonos: string;
	passwordSonos: string;
	isBoot: boolean;
	refBootLocationType: ReferenceDataVO;	
	bootLocationComment: string;  
	interventionSonosDetail: InterventionSonosDetail[];
	interventionDetailId: number;  
	comment: string;
	adresseIp: string;
	autreEmplacement: string;
}
