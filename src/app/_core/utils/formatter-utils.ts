import { CONTRAT_STATUTS } from '../constants/constants';
import { isNullOrUndefined } from './string-utils';

/**
 *Transformateur de l'identifiant niche.
 * @param nicheIdentifier
 */
export function nicheIdentifierTransformer(nicheIdentifier: string): string {
  let nicheIdTransformed = '-';
  if (!isNullOrUndefined(nicheIdentifier) && nicheIdentifier.length === 9) {
    nicheIdTransformed = nicheIdentifier
      .substr(0, 6)
      .replace(/(\d{2})/g, '$1 ')
      .replace(/(^\s+|\s+$)/, '');
    nicheIdTransformed += ' ' + nicheIdentifier.substr(6);
  }
  return nicheIdTransformed;
}
/**
 *Concatenation de la civilité nom et prénom
 * @param firstName,title,lastName
 */
export function fullNameFormatter(title: string, firstName: string, lastName: string, separator = ' '): string {
  return (
    `${isNullOrUndefined(title) ? '' : titleFormatter(title)} ${isNullOrUndefined(lastName) ? '' : lastName.toUpperCase()}${separator}${(isNullOrUndefined(firstName) || firstName.length === 0 ) ? '' : firstNameFormatter(firstName)}`
  );
}

/**
 *Transformateur de la civilité
 * @param title
 */
function titleFormatter(title: string): string {
  let result = 'UNKNOWN';
  if (title === 'M') {
    result = 'M.';
  } else if (title === 'MME') {
    result = 'Mme';
  }
  return result;
}

/**
 *Transformateur de la civilité en mettant pour la valeur UNKNOWN le trait d'union
 * @param title
 */
export function titleFullFormatter(title: string): string {
  if (!isNullOrUndefined(title) && title.trim().length  !== 0) {
    let result;
    if (title === 'M') {
      result = 'M.';
    } else if (title === 'MME') {
      result = 'Mme';
    } else {
      result = '-';
    }
    return result;
  }
  return null;
}

/**
 *Transformateur du firstName :
 *      1)  pour un prénom simple : on met la première lettre du prénom au majuscule
 *      2)  pour un prénom composé de deux parties liées par un trait d'union : on met la première lettre
 *              de chaque partie en majuscule
 *      3)  pour un prénom composé de parties non lié par un trait : on met la première lettre
 *              de chaque partie en majuscule
 * @param firstName
 */
export function firstNameFormatter(firstName: string): string {
  if (!isNullOrUndefined(firstName) && firstName.trim().length  !== 0) {
    let result = '';
    //cas de trait d'union dans le prénom
    const res = firstName.split('-');
    if (res.length > 1) {
      let i = 0;
      for (const item of res) {
        if (i > 0) {
          result += '-';
        }
        result += item[0].toUpperCase() + item.substr(1).toLowerCase();
        i++;
      }
      return result;
    }

    //cas d'espace dans le prénom
    const resSpace = firstName.split(' ');
    if (resSpace.length > 1) {
      let i = 0;
      for (const item of resSpace) {
        if (!item) {
          continue;
        }
        if (i > 0) {
          result += ' ';
        }
        result += item[0].toUpperCase() + item.substr(1).toLowerCase();
        i++;
      }
      return result;
    }
    return firstName[0].toUpperCase() + firstName.substr(1).toLowerCase();
  }
  return null;
}

/**
 * qui permet de formatter l'offre Forfait 
 */
export function formatForfait(value: string): string {
  let result = null;
  if (!isNullOrUndefined(value) && value.trim().length !== 0) { 
    result = value.replace(/Forfait |F. /i, '');
  } else {
    result = '-';
  }
  return result;
}

/**
 * qui permet de formatter adrresse 
 */
export function formatAdrresseAssocie(value: string ): string {
  let result = null;
  if (!isNullOrUndefined(value) && value.trim().length !== 0) { 
    const pattern: RegExp = /\|{1,}/g;
    result = value.replace(pattern, '\n');
  }
  return result;
}
/**
 * qui permet de une string en majuscule 
 */
export function toUpperCase(str: string): string {
	 if (!isNullOrUndefined(str) && str.trim().length !== 0) {
  return str.toUpperCase();
  }
  return null;
}

export function forfaitComparator( f1: string, f2: string): number {
  console.log(f1, formatForfait(f1), f2, formatForfait(f2), formatForfait(f1).localeCompare(formatForfait(f2)));
  return formatForfait(f1).localeCompare(formatForfait(f2));
}

export function getHighLightText(text: string, searchPattern: string, classToApply = 'highLightedText') {
  const re = new RegExp(`(${ searchPattern })`, 'ig');
  if(isNullOrUndefined(text) || text.trim().length === 0) {
    return text;
  }
  return text.replace(re, `<span class="${classToApply}" >$&</span>`);
}

export function formatterStatut(value: string): string {
  if(value === CONTRAT_STATUTS.INACTIVE.key) {
    return value.replace(CONTRAT_STATUTS.INACTIVE.key, CONTRAT_STATUTS.INACTIVE.label);
  } else if (value === CONTRAT_STATUTS.ACTIVE.key) {
    return value.replace(CONTRAT_STATUTS.ACTIVE.key, CONTRAT_STATUTS.ACTIVE.label);
  } else if (value === CONTRAT_STATUTS.PROSPECT.key) {
    return value.replace(CONTRAT_STATUTS.PROSPECT.key, CONTRAT_STATUTS.PROSPECT.label);
  } else if(value ===  CONTRAT_STATUTS.CONTACT.key) {
    return value.replace(CONTRAT_STATUTS.CONTACT.key, CONTRAT_STATUTS.CONTACT.label);
  } else {
    return '-';
  }
}

