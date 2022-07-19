import { ReferenceDataVO } from './../models';
import { EntityBase } from './../entity-base';
export interface InterventionTv extends EntityBase {
    id: number;
	carteViaccess: string;
	refLocationType: ReferenceDataVO;
	refConnectionType: ReferenceDataVO;
	commentLocation: string;
	commentConnection: string;
	isCanalPlus: boolean;
	suplementinfo: string;
	interventionDetailId: number;
	refDecoderModelType: ReferenceDataVO;
	comment: string;
	autreEmplacement: string;
}
