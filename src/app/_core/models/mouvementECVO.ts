import { EntityBase } from './entity-base';

export interface MouvementECVO extends EntityBase {

/**
 * Type du compte de facturation
 */
   universCF:string;
	/**
  * numéro du compte
  */
	numCptfact: string;

	/** date du mouvement */
	dateMouvement: Date;

	/** date du dernière mis à jour */
	dateMaj: Date;

	/** numéro du document */
	numberMouvement: string;

	/** Libellé */
	labelMouvement: string;

	/** Montant initial */
	initialAmountTTC: number;

	/** Montant restant */

	remainingAmount: number;

	/** Type de mouvement */

	methodPaiment: string;

	typeMouvement: string;


	factureFileName : string;

	arrow: string;

}
