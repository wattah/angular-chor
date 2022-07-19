import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'src/app/_core/utils/string-utils';

@Injectable({
  providedIn: 'root'
})
  export class ParcServiceDetailService {
  constructor() {}

  unitePriceTTC(unitPrice: number , tva: number): String {
    if (!isNullOrUndefined(unitPrice) && !isNullOrUndefined(tva)) {
      const unitePriceTTC: number = Math.round(unitPrice * ( 100 + tva)) / 100;
      const result = Number(unitePriceTTC).toFixed(2);
      const str: String = String(result);
      return str.replace('.', ',');
    }
  }

  remiseTtc(remise: number , tva: number): String {
    if (!isNullOrUndefined(remise) && !isNullOrUndefined(tva)) {
      const discountTtc: number = Math.round(remise * ( 100 + tva)) / 100;
      const result = Number(discountTtc).toFixed(2);
      const str: String = String(result);
      return str.replace('.', ',');
    } 
  }

  priceTTCAllIncluses(unitePrice: number, remise: number, tva: number): String {
    if (!isNullOrUndefined(remise) && !isNullOrUndefined(unitePrice) && !isNullOrUndefined(tva)) {
      const remiseTtc: number = Math.round((unitePrice - remise) * ( 100 + tva)) / 100;
      const result = Number(remiseTtc).toFixed(2);
      const str: String = String(result);
      return str.replace('.', ',');
    }  
  }
}
