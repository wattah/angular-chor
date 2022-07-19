import { ReferenceDataVO } from './../reference-data-vo';
import { EntityBase } from './../entity-base';
export interface InterventionWifiLocationVO extends EntityBase {
    id: number;
	refWifiLocationType: ReferenceDataVO;
    locationWifiComment: string;
	refWifiConnectionType: ReferenceDataVO;
	connectionWificomment: string;
	isPoe: boolean;
	poeWifiComment: string;
	pointAccessVOId: number;
	autreEmplacement: string;
}
