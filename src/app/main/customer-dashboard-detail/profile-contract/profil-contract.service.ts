import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { STATUS_CUSTOMER, } from '../../../_core/constants/constants';

import { isNullOrUndefined } from '../../../_core/utils/string-utils';

@Injectable({
  providedIn: 'root'
})
export class ProfilContractService {
 
  /**
  * true: consulation
  * false: modification
  */  

  isProspectOrContact$ = new BehaviorSubject(false);
  consultationModePage$ = new BehaviorSubject(true);

  ITEM_STATUS_CONTACT: {label: string, ordinal: number, key: string};
  ITEM_STATUS_PROSPECT: {label: string, ordinal: number, key: string};
  ITEM_STATUS_ACTIVE: {label: string, ordinal: number, key: string};
  ITEM_STATUS_INACTIVE: {label: string, ordinal: number, key:string};

  constructor() {
    this.setConsultationModeInLocalStorage(true);
    this.consultationModePage$.next(this.getConsultationModeFromLocalStorage());
  }

  updateConsultationModePage(newMode: boolean): void {
    this.consultationModePage$.next(newMode);
    this.setConsultationModeInLocalStorage(newMode);
  }

  getConsultationModePage(): BehaviorSubject<boolean> {
    return this.consultationModePage$;
  }

  getConsultationModeFromLocalStorage(): boolean {
    return localStorage.getItem('mode_consultation_profil').toLowerCase() === 'true'; 
  }

  setConsultationModeInLocalStorage(mode: boolean): void {
    localStorage.setItem('mode_consultation_profil', mode.toString());
  }

  getIsProspectOrContact(): BehaviorSubject<boolean> {
    return this.isProspectOrContact$;
  }

  setIsProspectOrContact(isProOrCon: boolean): void {
    this.isProspectOrContact$.next(isProOrCon);
  }

  formatLabel(label: string, type: string): string {
    if ( isNullOrUndefined(label)) { 
      return 'Inconnu'; 
    }
    
    const levelInfluenceLabel = {
      'ref_customer_knowledge_choise_of5_answer_unknow': {
        'levelInfluence': 'Inconnu',
        'accessibility': 'Inconnu',
        'voyageur': 'Inconnu',
        'potentiel': 'Inconnu'
      },
      'ref_customer_knowledge_choise_of5_answer_0': {
        'levelInfluence': 'Pas d\'influence',
        'accessibility': 'Pas accessible',
        'voyageur': 'Sédentaire (<10% à l\'étranger)',
        'potentiel': 'Aucun potentiel'
      },
      'ref_customer_knowledge_choise_of5_answer_1': {
        'levelInfluence': 'Réseau personnel',
        'accessibility': 'Atteignable et activable',
        'voyageur': 'Petit voyageur (10% à 30% à l\'étranger) ',
        'potentiel': 'Petit potentiel'
      },
      'ref_customer_knowledge_choise_of5_answer_2': {
        'levelInfluence': 'Réseau médiatique & décideur',
        'accessibility': 'Accessible',
        'voyageur': 'Grand voyageur (40% à 50% à l\'étranger) ',
        'potentiel': 'Moyen potentiel'
      },
      'ref_customer_knowledge_choise_of5_answer_3': {
        'levelInfluence': 'Réseau sensible',
        'accessibility': 'Actif',
        'voyageur': 'Surtout à l\'étranger (>70% à l\'étranger)',
        'potentiel': 'Fort potentiel'
      }                   
    };
    return levelInfluenceLabel[label] [type] ? levelInfluenceLabel[label] [type] : levelInfluenceLabel[0][0];
  }

  formattedLabelPotentielCooptation(ordinal: number): string {      
    if ( ordinal === 1 ) {
      return 'Aucun potentiel';
    }
    if ( ordinal > 1 && ordinal < 6 ) {
      return 'Petit potentiel';
    }
    if ( ordinal >= 6 && ordinal <= 11 ) {
      return 'Moyen potentiel';
    }
    if ( ordinal === 12 ) {
      return 'Fort potentiel';
    }  
    return 'Inconnu';
  }

  getCustomerStatus(ordinal: number) : string {
    let statusStr = '';
    if(ordinal === STATUS_CUSTOMER.STATUS_CONTACT_ID.id) {
      statusStr = STATUS_CUSTOMER.STATUS_CONTACT_ID.value;
    } else if (ordinal === STATUS_CUSTOMER.STATUS_CLIENT_INACTIF_ID.id) {
      statusStr = STATUS_CUSTOMER.STATUS_CLIENT_INACTIF_ID.value;
    } else if (ordinal === STATUS_CUSTOMER.STATUS_PROSPECT_ID.id) {
      statusStr = STATUS_CUSTOMER.STATUS_PROSPECT_ID.value;
    } else if (ordinal === STATUS_CUSTOMER.STATUS_CLIENT_ACTIF_ID.id) {
      statusStr = STATUS_CUSTOMER.STATUS_CLIENT_ACTIF_ID.value;
    } else {
      statusStr = STATUS_CUSTOMER.STATUS_ALL_ID.value;
    }
    return statusStr;
  }

  getListStatus(ordinal: number): Array<{id: number, value: string}> {
    const arrayStatus = [];
  if(ordinal === STATUS_CUSTOMER.STATUS_CONTACT_ID.id || ordinal === STATUS_CUSTOMER.STATUS_PROSPECT_ID.id) {
    arrayStatus.push(STATUS_CUSTOMER.STATUS_PROSPECT_ID);
    arrayStatus.push(STATUS_CUSTOMER.STATUS_CONTACT_ID);
    arrayStatus.push(STATUS_CUSTOMER.STATUS_CLIENT_ACTIF_ID);
  } else if (ordinal === STATUS_CUSTOMER.STATUS_CLIENT_ACTIF_ID.id) {
    arrayStatus.push(STATUS_CUSTOMER.STATUS_CLIENT_ACTIF_ID);
    arrayStatus.push(STATUS_CUSTOMER.STATUS_CLIENT_INACTIF_ID);
  } else if (ordinal === STATUS_CUSTOMER.STATUS_CLIENT_INACTIF_ID.id) {
    arrayStatus.push(STATUS_CUSTOMER.STATUS_CONTACT_ID);
    arrayStatus.push(STATUS_CUSTOMER.STATUS_PROSPECT_ID);
    arrayStatus.push(STATUS_CUSTOMER.STATUS_CLIENT_INACTIF_ID);
  } else {
    arrayStatus.push(STATUS_CUSTOMER.STATUS_CONTACT_ID);
    arrayStatus.push(STATUS_CUSTOMER.STATUS_PROSPECT_ID);
    arrayStatus.push(STATUS_CUSTOMER.STATUS_CLIENT_ACTIF_ID);
    arrayStatus.push(STATUS_CUSTOMER.STATUS_CLIENT_INACTIF_ID);
  }
    return arrayStatus;
  }

  getAsterix(isNotRequired): string {
    if(isNotRequired) {
      return '';
    }
    return '*';
  }
  
}
