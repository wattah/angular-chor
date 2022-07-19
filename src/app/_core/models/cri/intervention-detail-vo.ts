import { InterventionNas } from './intervention_nas';
import { InterventionLandLine } from './intervention-landline';
import { InterventionFemtocell } from './intervention-femtocell';
import { InterventionTv } from './intervention-tv';
import { EntityBase } from '.././entity-base';
import { ReferenceDataVO } from '../../models';
import { FibreOptiqueVO } from './fibre-optique-vo';
import { InterventionAdsl } from './intervention-adsl';
import { InterventionMobile } from './intervention-mobile';
import { InterventionSonos } from './intervention-sonos';
import { InterventionWifi } from './intervention-wifi';


export interface InterventionDetailVO extends EntityBase{
		id: number;
		otherLine: string;
		comment: string;
		shadowNumber: string;
		customerNeeds: string;
		inWarranty: boolean;
		refInterventionTypeLabel: string;
		refInterventionDomainLabel: string;
		modalities: ReferenceDataVO[];
		fibreOptique: FibreOptiqueVO[];
		interventionAdsl: InterventionAdsl[];
		impactedLineId: number;
		impactedLineLabel: string;
		refInterventionType: ReferenceDataVO;
		refInterventionDomain: ReferenceDataVO;
		interventionReportId: number;
		interventionMobile: InterventionMobile;
		interventionSonos:InterventionSonos;
		interventionWifi: InterventionWifi;
		interventionDomaine : ReferenceDataVO[];
		interventionTv: InterventionTv[];
		interventionFemtocell: InterventionFemtocell[];
		interventionLandLine: InterventionLandLine[];
		interventionNas: InterventionNas;
		multimediaInfo : string;
	  }
	  
