import { RequestVO } from './request/crud/request';
import { RecapCartItemVo } from './recap-cart-Item-vo';
import { PostalAdresseVO } from './postalAdresseVO';

/**
 * fsmail
 */
export interface RecapCartVo {

    idCart: number;
    request: RequestVO;
    items: RecapCartItemVo[];
	/**
	 * Remise Totale du panier
	 */
	totalDiscount: string;
	
	/**
	 * Total mensuel du panier
	 */
	 monthlyTotal: string;
	/**
	 * Total annuel du panier
	 */
	
	annualTotal: string;
	
	/**
	 * Total ponctuel du panier

	 */
     punctualTotal: string;
	
	/**
	 * Total du panier
	 */
	cartTotal: string;
	
	/**
	 * Stock
	 */
	stockToUse: string;
	
	/**
	 * Label Mode de livraison
	 */
	deliveringModeLabel: string;
	
	/**
	 * le nom du Client
	 */
    customerName: string;
  
  /**
   * l'adresse du destinataire
   */
  deliveryPostalAddressNewVo: PostalAdresseVO;
	
  /**
   * le numéro de contact du destinataire
   */
   recepientNumberContact: string;
  
  /**
   * le nom du coach affecté à la demande
   */
  
   coachName: string;

   calculateMargePourcent: string;

   calculateMargeEuro: string; 

}