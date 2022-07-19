import { Injectable } from '@angular/core';

import { firstNameFormatter } from '../../utils/formatter-utils';
import { CustomerSearchVO } from '../../models/search/customer-search-vo';
import { DisplaySuggestionResult } from '../../models/search/display-suggestion-result';
import { NEW_SEARCH_BAR } from './../../constants/search-constant';
import { CONSTANTS } from '../../constants/constants';
import { ProductSearchVO } from '../../models/search/product-search-vo';
import { DisplaySuggestionResultProduct } from '../../models/search/display-suggestion-result-product';

@Injectable({
  providedIn: 'root'
})
export class SearchBarService {
  
  /**
   * @param customers 
   */
  generateSuggestionDisplayItems(customers: CustomerSearchVO[]): DisplaySuggestionResult[]{
    const result = customers.map(
      (customer: CustomerSearchVO) => this.mappeCustomerToSuggestionResult(customer)
    );
    if (10 <= customers.length) {
      result.push(this.addShowAllItem());
    }
    return result;
  }

  generateSuggestionDisplayItemsForProducts(products: ProductSearchVO[]): DisplaySuggestionResultProduct[]{
    const result = products.map(
      (product: ProductSearchVO) => this.mappeProductToSuggestionResultProduct(product)
    );
    if (10 <= products.length) {
      result.push(this.addShowAllItemProduct());
    }
    return result;
  }

    /**
   * @param product 
   */
     private mappeProductToSuggestionResultProduct(product: ProductSearchVO) {
      const displaySuggestionResultProduct = {} as DisplaySuggestionResultProduct;
      displaySuggestionResultProduct.id = product.id;
      displaySuggestionResultProduct.label = product.label;
      displaySuggestionResultProduct.serialNumIMEI = product.serialNumIMEI;
      displaySuggestionResultProduct.productSourceTable = product.productSourceTable;
      return displaySuggestionResultProduct;
    }

  private addShowAllItem() {
    const displaySuggestionResult: DisplaySuggestionResult = {} as DisplaySuggestionResult;
    displaySuggestionResult.typeItem = 'SHOW_ALL';
    return displaySuggestionResult;
  }

  private addShowAllItemProduct() {
    const displaySuggestionResulProduct: DisplaySuggestionResultProduct = {} as DisplaySuggestionResultProduct;
    displaySuggestionResulProduct.typeItem = 'SHOW_ALL';
    return displaySuggestionResulProduct;
  }
  /**
   * @param customer 
   */
  private mappeCustomerToSuggestionResult(customer: CustomerSearchVO) {
    const displaySuggestionResult = {} as DisplaySuggestionResult;
    displaySuggestionResult.customerId = customer.customerId;
    displaySuggestionResult.nicheIdentifier = customer.nicheIdentifier;
    displaySuggestionResult.displayName = this.getDisplayName(customer);
    const customerTypeWithImage = this.getCustomerTypeWithImage(customer.categoryCustomer , customer.companyCustomerId);
    displaySuggestionResult.pictoFileName = customerTypeWithImage.image;
    displaySuggestionResult.status = this.getStatus(customer.status);
    displaySuggestionResult.typeItem = customerTypeWithImage.type;
    displaySuggestionResult.details = customer.beneficiariesNbr ? `${customer.beneficiariesNbr} ${customer.beneficiariesNbr === 1 ? NEW_SEARCH_BAR.BENEFICIAIRE:NEW_SEARCH_BAR.BENEFICIAIRES}`: null;
    displaySuggestionResult.companyCrmName = customer.companyCrmName;
    displaySuggestionResult.univers = customer.univers;
    console.warn('displaySuggestionResult: ', displaySuggestionResult);
    
    return displaySuggestionResult;
  }

  /**
   * @param categoryCustomer 
   */
  getCustomerTypeWithImage(categoryCustomer: string , companyCustomerId: number): {type:string, image:string} {
    if (!companyCustomerId) {
      if(NEW_SEARCH_BAR.CATEGORY_CUSTOMER.PARTICULAR === categoryCustomer) {
        return {type: CONSTANTS.TYPE_PARTICULAR, image: NEW_SEARCH_BAR.IMAGE.PARTICULAR};
      } else {
        return {type: CONSTANTS.TYPE_COMPANY , image:NEW_SEARCH_BAR.IMAGE.ENTREPRISE};
      }
    } else {
      return {type: CONSTANTS.TYPE_BENEFICIARY , image:NEW_SEARCH_BAR.IMAGE.BENEFICIARY};
    }
  }

  /**
  * @param status 
  */
  getStatus(status: number): string {
    switch(status){
      case 0: return NEW_SEARCH_BAR.STATUS.PROSPECT;
      case 1: return NEW_SEARCH_BAR.STATUS.MEMBRE_ACTIF;
      case 2: return NEW_SEARCH_BAR.STATUS.MEMBRE_RESILIE;
      case 3: return NEW_SEARCH_BAR.STATUS.CONTACT;
      default: throw new Error(NEW_SEARCH_BAR.STATUS.ERROR_STATUS);
    }
  }

  /**
   * @param customer 
   */
  getDisplayName(customer: CustomerSearchVO): string {
    let displayName = '';

    if (customer.categoryCustomer === NEW_SEARCH_BAR.CATEGORY_CUSTOMER.COMPANY) {
      displayName = customer.crmName;
    } else {
      const crmName = customer.crmName? customer.crmName.toUpperCase():'';
      const firstName: string = customer.firstName ? firstNameFormatter(customer.firstName) : '';
      displayName = `${crmName} ${firstName}`;
    }
    return displayName;
  }

}
