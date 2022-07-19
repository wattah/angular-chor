import { CONSTANTS } from './../../../../_core/constants/constants';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable({
    'providedIn':'root'
})
export class FormStoreManagementService {
    forms: Array<FormGroup> = new Array<FormGroup>();
    chosenParkItems: Array<any> = new Array<any>();
    serialFieldhasChanged: Array<boolean> = new Array<any>();
    cartItems: any;
    cart: any;
    private readonly changeTab$: Subject<boolean> = new Subject();
    private readonly changeVisibleActionsOnArticle$: Subject<boolean> = new Subject();
    private readonly changeCartCalule$: Subject<any> = new Subject();

    public tabChangeNotification(){
        return this.changeTab$;
    }

    public onTabChange(changingTab: boolean){
        this.changeTab$.next(changingTab);
    }

    public changeVisibleActionsOnArticleNotification(){
        return this.changeVisibleActionsOnArticle$;
    }

    public onChangeVisibleActionsOnArticle(visible: boolean){
        this.changeVisibleActionsOnArticle$.next(visible);
    }

    public changeCartCaluleNotification(){
        return this.changeCartCalule$;
    }

    public onChangeCartCalule(cart: any){
        this.changeCartCalule$.next(cart);
    }

    calculateTotalPriceTtc(item) {
        return this.formatPrice(
          (this.getTvaNumberValue(item.tauxTVA) / 100 + 1) *
            this.getTotalPriceHt(item)
        );
    }

    getTvaNumberValue(tva: string) {
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
      formatPrice(marginReal: any) {
        return Math.round(marginReal * 100) / 100;
    }

    getTotalPriceHt(item: any) {
        let price = 0;
        if (item.quantity > 0) {
          if (item.product && item.product.discountIncluded) {
            price = (item.unitPriceHt - item.discount) * item.quantity;
          } else if (isNaN(item.discount) || item.discount === 0) {
            price = item.unitPriceHt * item.quantity;
          } else {
            price = (item.unitPriceHt - item.discount) * item.quantity;
          }
        }
        return price;
    }
    public getParentLabelFromNomenclatureByLevel(item: any, level: number) {
        if(item && item.nomenclature){
          let parent = item.nomenclature.parent;
          while (parent.level !== level) {
            parent = parent.parent;
          }
          return parent.nomenclatureLabel;
        }
        return '-'
    }

  public getParentByLevel(item: any) {
    if(item && item.family && item.family.parent){
      return item.family.parent.parent;
    }
    return {};
  }
}
