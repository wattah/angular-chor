import { EntityBase } from '.././entity-base';
import { ReferenceDataVO } from '../../models';



export interface InterventionHardwareVO extends EntityBase{
		id: number;
		isInstalled: boolean;
		comment: string;
		interventionReportId: number;
		refInterventionHardware: ReferenceDataVO;
		serialNumber: string;
		quantity: number;
	
	}