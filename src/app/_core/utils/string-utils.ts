import { map } from 'rxjs/operators';
import { DEFAULT_STRING_EMPTY_VALUE } from '../constants/constants';

export function sentenceCase(str): string {
  // Replace first char of each sentence (new line or after '.\s+') to
  // UPPERCASE
  return lowerCase(str).replace(/(^\w)|\.\s+(\w)/gm, upperCase);
}

export function capitalize(str: string): string {
  return isNullOrUndefined(str) || str === '' ? '' : str[0].toUpperCase() + str.substr(1);
}

/**
 * Capitalize first letter
 * @param str
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to Json Array Object
 * @param str
 */
export function stringToArrayObject(str: string): any[] {
  const result: any[] = [];
  if (!isNullOrUndefined(str)) {
    str.split(';').forEach(item => {
      const val = stringToJsonObject(item);
      result.push(val);
    });
  }
  return result;
}

/**
 * Check if value is null or undefined
 * @param obj
 */
export function isNullOrUndefined(obj: any): boolean {
  return typeof obj === 'undefined' || obj === null;
}

export function isNumber(value: string | number): boolean {
   return ((value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
}

/**
 * Get default string empty value
 */
export function getDefaultStringEmptyValue(str: string): string {
  return isNullOrUndefined(str) || (isString(str) && str.trim().length === 0) ? DEFAULT_STRING_EMPTY_VALUE : str;
}

function lowerCase(str): string {
  return str.toLowerCase();
}

function upperCase(str): string {
  return str.toUpperCase();
}

/**
 * Convert string to Json Object
 * @param str
 */
function stringToJsonObject(str: string): any {
  const result: any = {};
  if (!isNullOrUndefined(str)) {
    str.split(',').map(item => {
      if (!isNullOrUndefined(item)) {
        const keyVal: any[] = item.split(':');
        if (!isNullOrUndefined(keyVal) && keyVal.length === 2 && !isNullOrUndefined(keyVal[0]) && !isNullOrUndefined(keyVal[1])) {
          result[keyVal[0].trim()] = keyVal[1].trim();
        }
      }
    });
  }
  return result;
}

/**
 * Returns if a value is a string
 * @param value
 */
function isString(value: any) {
  return typeof value === 'string' || value instanceof String;
}
/**
 * 
 * @param val convert str to boolean
 */
export function stringToBoolean(val: string) {
  const a = {
    'true': true,
    'false': false
  };
  return a[val];
}


export function StringReplaceAll( source:string, find:string, replacement:string ) : String{
  return source.split(find).join(replacement);
}

export  function getDefault(str:string, fallback:string):string {
  return (str != null && str.trim().length > 0) ? str.trim() : fallback;
}

export function formatPhoneNumber(phoneNumberString) {
  const cleaned = (String(phoneNumberString)).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `( ${match[1]} )  ${match[2]} - ${match[3]}`;
  }
  return null
}

export function compareStrings (a: string, b: string): number {
  const nameA = a.toUpperCase(); // ignore upper and lowercase
  const nameB = b.toUpperCase(); // ignore upper and lowercase

  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

export const random = ()=> crypto.getRandomValues(new Uint32Array(1))[0]/2**32;

export function generateRandomString(length) {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(random() * charactersLength));
  }
  return result;
}

export function isEmpty(str: string): boolean {
  return (!str || 0 === str.length);
}

export function emailIsValid(email : string) : boolean {
    if(!isNullOrUndefined(email)){
      const patternEmail = new RegExp('^([a-z]+[0-9]*[.-]?[a-z0-9]+)+([.-]?[a-z0-9]+)*@([a-z0-9]+[-.]?[a-z0-9]+)+([.-]?[a-z0-9]+)*\.[a-z]+$');
        return patternEmail.test(email);
    }
    return false;
}

/**
   * This function check if the format of emails is valid or not, if one is not valid 
   * we push its index in indexOfInvalidEmails to show the error in the right input
*/
export function checkListOfEmailsIsValid(listOfEmails) : number[] {
  let index = 0;
  let indexOfInvalidEmails = [];
  let mailValid : boolean;
  listOfEmails.map(row =>  {
    mailValid = emailIsValid(row.value.mail);
    if(!mailValid) {
      indexOfInvalidEmails.push(index);
    }
    index++;
  });
  return indexOfInvalidEmails;
}

/**
   * This function check if the index of the input exists in indexOfInvalidEmails list to show or not the error
*/
export function checkEmailIsValidToShowError(indexOfInvalidEmails, index){
  if(indexOfInvalidEmails.length !== 0 && indexOfInvalidEmails.includes(index)){
    return false;
  }
  return true;
}
