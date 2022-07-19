import { EntityBase } from './entity-base';
import { NestedOfferVO } from './nested-offer-vo';

export interface CustomerParcLigneDetailVO extends EntityBase {


	idCustomerParkItem: number ;
 	/**
	 * Libellé de l'offre.
	 */
	libelleContract: string ;

		/**
	 * Niche ContractStatus;
	 */
	 status: string;
	
	/**
	 * Code Etat de dossier
	 */
	  codeStateDoss: string;


	/**
	 * universe (FIXE INTERNET MOBILE)
	 */
	  universe: string;
	
	/**
	 * Numéro de la ligne.
	 */
	numLine: string ;
	
	/**
	 * Numéro du client
	 */	
	numClient: string ;
	
	/**
	 * Numéro ADV
	 */
	numAdv: string ;
	
	/**
	 * Status Dossier
	 */
	stateDoss: string ;
	
	/**
	 * Date de création 
	 */
	 dateCreation: string ;
	
	/**
	 * Date de début de souscription
	 */
	dateEngageBegin: string ;

	/**
	 * Libellé de migration
	 * Offre à venir
	 */
	nextOfferLibelle: string ;
	
	/**
	 * Date de migration.
	 */
	nextOfferDate: string ;
	
	/**
	 * Numéro Carte Sim Principal
	 */
	numSimCard: string ;
	
	/**
	 * Numéro IMSI Carte Sim Principal
	 */
	numImsi: string ;
	
	/**
	 * Code puk1.
	 */
  keyPuk1: string ;
	
	/**
	 * Code puk2.
	 */
	keyPuk2: string ;
	
	/**
	 * Date renouvelement SIM
	 */
	dateChangeSim: string ;
	
	/**
	 * Type Sim Cart Sim Principale et secondaire
	 */
    typeSimCard: string ;

    /**
	 * Numéro Carte Sim Secondaire
	 */
    numSubSimCard: string ;
    
    /**
     *  Numéro IMSI Carte Sim Secondaire
     */
    numTelSubCard: string ;

    /**
     * Code puk Carte Sim Secondaire
     */
    keyPukSub1: string ;
	
	/**
	 * Code puk 2 Carte Sim Secondaire
	 */
	keyPukSub2: string ;

	offers: NestedOfferVO[];

	name: string;

	addressInstallation: string;

	numIpLine: string;

	bss: string;

	webserviceIdentifier: string;
/**
 * code forfait
 */
	 codeContract: string;

}
