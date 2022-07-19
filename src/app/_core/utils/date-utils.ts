import { CONSTANTS } from '../../../app/_core/constants/constants';
import * as Moment from 'moment-business-days';

import { isNullOrUndefined } from './string-utils';

/**
 *cette méthode permet de calculer les années à partir de la date 
 * @param date 
 */
export function countYearsByDate(date: string): Number {
  if (!isNullOrUndefined(date)) {
    const now = new Date();
    const born = new Date(date);
    return Math.floor((now.getTime() - born.getTime()) / (365 * 24 * 60 * 60 * 1000));
  }
  return 0;
}

/**
 * comprate two dates
 * @param a 
 * @param b 
 */
export function dateComparator ( a: string , b: string): number { 
  if ( a === null && b === null) { return 0; }
  if ( a === null ) { return 1; }
  if ( b === null) { return -1; }
  if ( a === '-' && b === '-') { return 0; }
  if ( a === '-' ) { return 1; }
  if ( b === '-') { return -1; }
  return transformDate(a) - transformDate(b);
}
export function numberComparator ( a: number , b: number): number {
  let valueToReturn = 1;
  if ( !a && !b) { 
    valueToReturn = 0;
  }
  if ( a > b ) { 
    valueToReturn = 1; 
  }
  if ( b > a ) { 
    valueToReturn = -1; 
  }
  if ( b === a ) { 
    valueToReturn = 0;
  }
  return valueToReturn;
}

export function sortTVA ( a: string , b: string ): number {
  const aTVA = getTvaNumberValue(a);
  const bTVA = getTvaNumberValue(a);
  let valueToReturn = 0;
  if ( !aTVA && !bTVA) { 
    valueToReturn = 0;
  }
  if ( aTVA > bTVA ) {
    valueToReturn = 1;
  }
  if ( bTVA > aTVA ) { 
    valueToReturn = -1;
  }
  if ( bTVA === aTVA ) {
    valueToReturn = 0;
  }
  return valueToReturn;
}

export function getTvaNumberValue(tva: string) {
  switch (tva) {
    case CONSTANTS.OLD_TVA_NORMALE:
      return 19.6;
    case CONSTANTS.OLD_TVA_REDUITE:
      return 5.5;
    case CONSTANTS.TVA_NORMALE:
      return 20.0;
    case CONSTANTS.TVA_REDUITE:
      return 7.0;
    case CONSTANTS.TVA_MOYENNE:
      return 10.0;
    default:
      return 0;
  }
}
 
export function transformDate(value: string): any {
  const dateA = value.split(' ');  
  if ( dateA[1] === 'juill.') { dateA[1] = 'juil.'; }
  value = dateA.join(' ');
  return Moment(value, 'DD MMM YYYY HH mm ss', 'fr');
}

export function formateDateWithoutTimeZone(date: Date): Date{
  const newDate = new Date(date);
  return new Date(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate(),  newDate.getUTCHours(), newDate.getUTCMinutes(), newDate.getUTCSeconds());
}

export function getCurrentUTCDate(){
  const date = new Date();
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    
}
