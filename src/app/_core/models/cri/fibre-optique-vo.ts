import { EntityBase } from '.././entity-base';
import { ReferenceDataVO } from '../../models';
export interface FibreOptiqueVO extends EntityBase {
  /** The id. */
  id: number;
  aid: string;
	ndFictif: string;
	ndVoip: string;
	identConnexion: string;
	mdpConnexion: string;
	slid: string;
	 emplacementPto : ReferenceDataVO;
	 emplacementOnt : ReferenceDataVO;
	mesurePto: string;
	 emplacementLivebox : ReferenceDataVO;
	isCheckedOffrePro : boolean
	interventionDetailId: number;
	numeroPto: string;
	comment: string;
	autreEmplacementPto: string;
	autreEmplacementOnt: string;
	autreEmplacementLivebox: string;
	operateurImmeuble: string;
	nomSite: string;
	ingenierie : ReferenceDataVO;
}
