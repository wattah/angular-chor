import { EntityBase } from './entity-base';
import { PenicheLigneErreurAndWariningResponseVO } from './peniche-ligne-erreur-response-vo';
export interface LivrableVO extends EntityBase{

    /** id du livrable */
    livrableId : number;

    /** Type de livrable. */
	type: string;

	/** Date du livrable. */
	date: string;

	/** flag d'archivage. */
	archive: boolean;

	/** Nom du fichier. */
	fichier: string;

	/** Url de download du fichier. */
	url: string;

	/** Numero du livrable. */
	numero: string;

	/** Univers, pour les CR, univers = "CRFA". */
	univers: string;

	/** Numéro de client niche. */
	clientIdentifier: string;

	/** Numéro de compte de facture, vide pour les CR. */
	billAccountIdentifier: string;

	/** The main line. */
	mainLine: string;

	/** Statut du livrable. */
	status: string;

	/** Historique des status, séparés par ';;', du plus ancien au plus récent. */
	historiquesStatuts: string;

	/** Liste des contrôles ayant échoués, séparés par ';;'. */
	controles: string;

	/** Tranche de facturation du compte de facturation associé. */
	jourFacturation: number;

	/** Délai de facturation définies sur le client associé. */
	prioriteFacturation: number;

	/** Adresse mail de notification. */
	mailNotification: string;

	/** The send cancelled. */
	sendCancelled: boolean;

	/** The date send cancelled. */
	dateSendCancelled: Date;

	/** The send status. */
	sendStatus: string;

	/** The justification controle. */
	justificationControle: string;

	/** The bill amount. */
    billAmount:number;
    
    dejaPayee: boolean;

    livrableStatus: string;

    label: string;

    dossiers: string[];

    erreurs: PenicheLigneErreurAndWariningResponseVO[];

    avoirComplementaire: boolean;

    avoir: boolean;

    fichierOriginal: string;

    libelleErreurTraitement: string;

	libelleWarningTraitement : string;

	idCompteFacturation : number;

	arrow:string;
	
	paymentMethod : string

}