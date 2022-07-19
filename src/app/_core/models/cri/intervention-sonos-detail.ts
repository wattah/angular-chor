import { EntityBase } from './../entity-base';
import { ReferenceDataVO } from './../reference-data-vo';
export interface InterventionSonosDetail extends EntityBase{
    id: number;
	refSonosType: ReferenceDataVO;
	refSonosConnectionType: ReferenceDataVO;
	complementInfo: string;
	interventionSonosId: number;
	adresseIp: string;
}
