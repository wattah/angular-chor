import { CART_STATUS, CONSTANTS } from '../constants/constants';
import { NEW_SEARCH_BAR } from '../constants/search-constant';
import { CartIconClass, CartColor, OrderStatus, Stocks } from './../enum/cart.enum';
import { fullNameFormatter } from './formatter-utils';
import { isNullOrUndefined } from './string-utils';

export function getCartIconClass(cartColor: string, cartStatus: string): string {
  switch (cartColor) {
    case CartColor.BLUE:
      return CartIconClass.CART_BLUE;
    case CartColor.GREY:
      if (cartStatus === OrderStatus.DELIVERED || cartStatus === OrderStatus.DELIVERED_TBV ) {
        return CartIconClass.CART_BLUE_PRN;
      }
      if (cartStatus === OrderStatus.MATERIAL_AVAILABLE || cartStatus === OrderStatus.MATERIAL_AVAILABLE_TBV ) {
        return CartIconClass.CART_GREEN_PRN;
      }
      return CartIconClass.CART;
    case CartColor.GREEN:
      return CartIconClass.CART_GREEN;
    case CartColor.ORANGE:
      return CartIconClass.CART_ORANGE;
    case CartColor.RED:
      return CartIconClass.CART_RED;
    case CartColor.YELLOW:
      return CartIconClass.CART_YELLOW;
    case CartColor.WARNING:
      return CartIconClass.CART_WARNING;        
    case CartColor.PINK:
      return CartIconClass.CART_PINK;  
    default:
      return CartIconClass.CART;
  }
}

/**
 * Encrypte a value
 * @param value
 */
export function getEncryptedValue(value: number)  {
  const encryValue = '';
  return btoa(value + encryValue);
  
}

/**
 * Decrypte a value
 * @param value
 */
export function getDecryptedValue(value: string) {
  const encryValue = '';
  return Number(atob(value + encryValue));
}
export enum CartStatusListLabel {
  CART_STATUTS_LIST_LABEL_BLUE_BLACK = 'Livraison OK (Parnasse)',
  CART_STATUTS_LIST_LABEL_GREEN_BLACK = 'matériel mise a dispo',
  CART_STATUTS_LIST_LABEL_GREEN= 'Expédition OK',
  CART_STATUTS_LIST_LABEL_ORANGE= 'Expédition OK, à vérifier',
  CART_STATUTS_LIST_LABEL_GREY= " Pas d'ordre envoyé ",
  CART_STATUTS_LIST_LABEL_PINK= 'Ordre pris en compte',
  CART_STATUTS_LIST_LABEL_YELLOW = 'Ordre envoyé',
  CART_STATUTS_LIST_LABEL_BLUE = 'Livraison OK',
  CART_STATUTS_LIST_LABEL_WARNING = 'Warning',
  CART_STATUTS_LIST_LABEL_RED = 'Livraison KO'
  
}

export function getCartLabel(cartColor: string, orderStatus: string): string {
  if (cartColor === null) {
    return null;
  }
  if (orderStatus !== null && cartColor === CartColor.GREY 
    && (orderStatus === OrderStatus.DELIVERED || orderStatus === OrderStatus.DELIVERED_TBV )) {
    return CartStatusListLabel.CART_STATUTS_LIST_LABEL_BLUE_BLACK;
  } else if (orderStatus !== null && cartColor === CartColor.GREY && 
      (orderStatus === OrderStatus.MATERIAL_AVAILABLE || orderStatus === OrderStatus.MATERIAL_AVAILABLE_TBV )) {
    return CartStatusListLabel.CART_STATUTS_LIST_LABEL_GREEN_BLACK;
  } 
  switch (cartColor) {
    case CartColor.BLUE:
      return CartStatusListLabel.CART_STATUTS_LIST_LABEL_BLUE;
    case CartColor.GREY:
      return CartStatusListLabel.CART_STATUTS_LIST_LABEL_GREY;
    case CartColor.ORANGE:
      return CartStatusListLabel.CART_STATUTS_LIST_LABEL_ORANGE;
    case CartColor.PINK:
      return CartStatusListLabel.CART_STATUTS_LIST_LABEL_PINK;
    case CartColor.WARNING:
      return CartStatusListLabel.CART_STATUTS_LIST_LABEL_WARNING;
    case CartColor.RED:
      return CartStatusListLabel.CART_STATUTS_LIST_LABEL_RED;
    case CartColor.YELLOW:
      return CartStatusListLabel.CART_STATUTS_LIST_LABEL_YELLOW;
    case CartColor.GREEN:
      return CartStatusListLabel.CART_STATUTS_LIST_LABEL_GREEN;
    default:
       return null;
  }

}

export function formatNumber(nombre: number): string {
  if (nombre < 10) {
    return `00000000${nombre}`;
  } else if ( nombre < 100 && nombre > 9 ) {
    return `0000000${nombre}`;
  } else if (nombre < 1000 && nombre > 99) {
    return `000000${nombre}`;
  } else if (nombre < 10000 && nombre > 999) {
    return `00000${nombre}`;
  } else if (nombre < 100000 && nombre > 9999) {
    return `0000${nombre}`;
  } else if (nombre < 1000000 && nombre > 9999) {
    return `000${nombre}`;
  } else if (nombre < 10000000 && nombre > 99999) {
    return `00${nombre}`;
  } else if (nombre < 100000000 && nombre > 999999) {
    return `0${nombre}`;
  }
  return nombre.toString();    
}

/**
 * permet d'afficher icon pour le panier 
 * @param cartColor 
 * @param stockToUse 
 * @returns 
 */
export function getCartIconRenderer(cartColor: string, stockToUse): string {
  let currentPanier;
  let result = '';
  const isPubli = isNullOrUndefined(stockToUse) || stockToUse === Stocks.PUBLIDISPATCH; 
     if(cartColor.toLowerCase() === 'grey' || cartColor.toLowerCase() === 'warning'){
      currentPanier = CART_STATUS.filter(statutPanier => 
        (cartColor != null && statutPanier.data !== null && 
        statutPanier.data.toLowerCase() === cartColor.toLowerCase()));
     }else{
      currentPanier = CART_STATUS.filter(statutPanier => 
        (cartColor != null && statutPanier.data !== null && 
        (isPubli ? statutPanier.data.toLowerCase() === cartColor.toLowerCase() : statutPanier.data.toLowerCase() === cartColor.toLowerCase().concat("2"))));  
     }    
    if(currentPanier != null && currentPanier.length >0){
      result = `<span class='icon ${currentPanier[0].icone}' ></span>`; 
    }
    return result
}

export function getTypeCustomer(categoryCustomer: string , companyCustomerId: number): string {
  if (isNullOrUndefined(companyCustomerId)) {
    if(NEW_SEARCH_BAR.CATEGORY_CUSTOMER.PARTICULAR === categoryCustomer) {
      return CONSTANTS.TYPE_PARTICULAR ;
    } else {
      return CONSTANTS.TYPE_COMPANY ;
    }
  } else {
    return CONSTANTS.TYPE_BENEFICIARY;
  }
}


export function getImageByTypeCustomer(categoryCustomer: string , companyCustomerId: number): string {
  if (isNullOrUndefined(companyCustomerId)) {
    if(NEW_SEARCH_BAR.CATEGORY_CUSTOMER.PARTICULAR === categoryCustomer) {
      return NEW_SEARCH_BAR.IMAGE.PARTICULAR;
    } else {
      return NEW_SEARCH_BAR.IMAGE.ENTREPRISE;
    }
  } else {
    return NEW_SEARCH_BAR.IMAGE.BENEFICIARY;
  }
}


export function getPersonNameOfCustomer(categoryCustomer: string,crmName: string, firstName : string, lastName: string, title: string = null ): any {
  if ( NEW_SEARCH_BAR.CATEGORY_CUSTOMER.COMPANY === categoryCustomer) {
    return crmName;
  } else {
    return fullNameFormatter(title, firstName, lastName);
  }
}

