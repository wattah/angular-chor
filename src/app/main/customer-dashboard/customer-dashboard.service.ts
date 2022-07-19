import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CONSTANTS, COLOR_TYPE_CUSTOMER } from '../../_core/constants/constants';
import { isNullOrUndefined } from '../../_core/utils/string-utils';

@Injectable({
  providedIn: 'root'
})
export class CustomerDashboardService {
  
  private customerId$ = new BehaviorSubject(null);
  
  // this subject modify the value of type customer (particular or beneficary) to display the right css-class and infos in 'fiche 360'
  private currentTypeCustomer$ = new BehaviorSubject(CONSTANTS.TYPE_PARTICULAR);

  constructor() {}

  /**
	 * cette méthode permet de verifier si la personne est un apporteur ou fournisseur
	 * @param businessProvider
	 * @param supplier
	 */
  CheckSupplierBusinesProvider(businessProvider: boolean, supplier: boolean): string {
    let resultat = '';
    if (!isNullOrUndefined(businessProvider) && businessProvider === true && !isNullOrUndefined(supplier) && supplier === true) {
      resultat = 'Apporteur / Fournisseur';
    } else if (!isNullOrUndefined(businessProvider) && businessProvider === true) {
      resultat = 'Apporteur';
    } else if (!isNullOrUndefined(supplier) && supplier === true) {
      resultat = 'Fournisseur';
    }
    return resultat;
  }
 /**
   * cette méthode d'afficher la photo du membre sinon l'avatar qui lui corespond 
   * @param title 
   * @param photo 
   */
  profilPicture(title: string, photo: string, isEntreprise: boolean): string {
    let resultat = '';
    if (!isNullOrUndefined(photo)) {
      resultat = 'data:image/jpg;base64,' + photo;
    } else if (isEntreprise) {
      resultat = CONSTANTS.AVATAR_ENTREPRISE;
    } else if (!isEntreprise) {
      if (!isNullOrUndefined(title) && title === 'MME' ) {
        resultat = CONSTANTS.AVATAR_MME;
      } else if (!isNullOrUndefined(title) && title === 'M' ) {
        resultat = CONSTANTS.AVATAR_M;
      } else if (!isNullOrUndefined(title) && title === 'UNKNOWN') {
        resultat = CONSTANTS.AVATAR_UNKNOWN;
      }
    }
    return resultat;
  }

  /**
	 * Transformateur du job
	 * @param businessSectorRef
	 */
  businessSecteurRefFormatter(businessSectorRef: string): string {
    return !isNullOrUndefined(businessSectorRef) ? businessSectorRef.split(',').join('/') : '';
  }

  changeCurrentTypeCustomer(typeCustomer: string): void {
    this.currentTypeCustomer$.next(typeCustomer);
  } 

  getCurrentTypeCustomer(): string {
    return this.currentTypeCustomer$.getValue();
  }

  setCustomerId( customerId: number): void {
    this.customerId$.next(customerId);
  }

  getCustomerId(): BehaviorSubject<number> {
    return this.customerId$;
  }

  getClassEnvByTypeCustomer(): string {
    return 'env-' + COLOR_TYPE_CUSTOMER[this.currentTypeCustomer$.getValue()];
  }

  getClassBadgeByTypeCustomer(): string {
    return 'badge-' + COLOR_TYPE_CUSTOMER[this.currentTypeCustomer$.getValue()];
  }
}
