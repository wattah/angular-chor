import { RecapCartItemVo } from './../models/recap-cart-Item-vo';
import { isNullOrUndefined } from './../../_core/utils/string-utils';
import { CONSTANTS } from './../../_core/constants/constants';
import { RecapCartVo } from './../models/recap-cart-vo';
import { Injectable } from '@angular/core';
import { CartVO } from './../models/models';

@Injectable({
    'providedIn':'root'
})
export class CalculeCartPricesService{
    public cart : CartVO;
    public deletedItems: any;
    public recalculatePrices(cartVO: any) {
		const recapCartVo = {} as RecapCartVo;
        recapCartVo.idCart = cartVO.id;
        if(cartVO.request && cartVO.request.cartItems  && cartVO.request.cartItems.length>0){
            let cartItems = cartVO.request.cartItems;
            cartItems = cartItems.filter((item) =>
            isNullOrUndefined(item.deletingDate)
          );
            recapCartVo.items = this.mappeToItems(cartItems);
            recapCartVo.annualTotal = this.numberWithTwoDigits(this.calculToTalBySubscriptionPeriodicity(cartItems,"YEARLY"));
            recapCartVo.monthlyTotal = this.numberWithTwoDigits(this.calculToTalBySubscriptionPeriodicity(cartItems,"MONTHLY"));
            recapCartVo.punctualTotal = this.numberWithTwoDigits(this.calculToTalBySubscriptionPeriodicity(cartItems,"ACTE"));
            recapCartVo.calculateMargePourcent = this.numberWithTwoDigits(this.getCartMargeReelle(cartItems, true));
            recapCartVo.calculateMargeEuro = this.numberWithTwoDigits(this.getCartMargeReelle(cartItems, false));
            recapCartVo.cartTotal = this.numberWithTwoDigits(this.calculCartToTalTTC(cartItems));
            recapCartVo.totalDiscount = this.calculToTalDiscount(cartItems);
        }
        recapCartVo.request = cartVO.request;
        recapCartVo.stockToUse = cartVO.stockToUse;
		recapCartVo.deliveryPostalAddressNewVo = cartVO.deliveryPostalAddressNewVo;
        recapCartVo.recepientNumberContact = cartVO.contactMobilePhoneNumber;
        if(!isNullOrUndefined(cartVO.coachToNotify) && !isNullOrUndefined(cartVO.coachToNotify.lastName)
         && !isNullOrUndefined(cartVO.coachToNotify.firstName)){
            const firstName =cartVO.coachToNotify.firstName ;
            const lastName =cartVO.coachToNotify.lastName.toUpperCase();
            recapCartVo.coachName = `${firstName} ${ lastName }` 
         }
         if(!isNullOrUndefined(cartVO.deliveringModeRef)){
            recapCartVo.deliveringModeLabel = cartVO.deliveringModeRef.label;
         }

		return recapCartVo;
    }
    

    mappeToItems(cartItems: any): RecapCartItemVo[] {
        const finalItems = [];
        const productsLabele = cartItems.map(item=>item.productLabel);
        const uniqueNames= this.getUniqueNamesFromCarItems(productsLabele);
        uniqueNames.forEach(
            (name)=>{
                const clone = cartItems.slice();
                const items = clone.filter((cartItem)=> cartItem.productLabel === name);
                const item = {} as RecapCartItemVo;
                item.cartItemId = items[0].id;
                item.labelCartItem = items[0].productLabel;
                item.quantiteCartItem = items.reduce((sum, current) => sum + parseInt(current.quantity), 0);
                let ttcPrice = 0;
                items.forEach(
                    (item)=> ttcPrice += this.calculPriceTTC(item)
                );
                item.totalePriceCartItem = Number(this.numberWithTwoDigits(ttcPrice));
                finalItems.unshift(item);
            }
        );
        return finalItems;
    }
    private getUniqueNamesFromCarItems(productsLabele: any) {
        const uniqueNames = [];
        productsLabele.forEach((name) => {
            if (!uniqueNames.includes(name)) {
                uniqueNames.push(name);
            }
        });
        return uniqueNames;
    }

    getQuantityByProductName(cartItems: any , productLabel: string , productsLabele): number {
        const cartItemsClone = cartItems.slice();
        if(!productsLabele.includes(productLabel)){
            productsLabele.push(productLabel);
            return cartItemsClone.filter((cartItem)=> cartItem.productLabel === productLabel ).length;
        }
        return 0;
    }
    numberWithTwoDigits(price: number): string {
       return (Math.round(price * 100) / 100).toFixed(2);
    }
    getCartMargeReelle(cartItems: any, wantedpurcent: boolean) {
        let totalPAchat = 0;
		let totalPVente = 0;
		cartItems.forEach(
            (item)=>{
                ({ totalPAchat, totalPVente } = this.calculate(item, totalPAchat, totalPVente));
            }
        );
	
        const marge = (totalPVente-totalPAchat);
		if(wantedpurcent){
            return this.calculateWithWantedPurcent(marge ,totalPVente , totalPAchat);
		}else{
			return marge;
		}

    }
    calculateWithWantedPurcent(marge ,totalPVente , totalPAchat ) {
        if(totalPVente>0){
            return (marge * 100)/ totalPVente;
        }else{
           return totalPAchat === 0 ?  0.0:-100.0;
        }
    }
    private calculate(item: any, totalPAchat: number, totalPVente: number) {
        const unitPriceHt = !item.unitPriceHt ? 0.0 : item.unitPriceHt;
        const discount = !item.discount ? 0.0 : item.discount;
        const quantity = !item.quantity ? 0.0 : item.quantity;
        const acquisitionPriceReal = !item.acquisitionPriceReal ? 0.0 : item.acquisitionPriceReal;
        if (item && isNullOrUndefined(item.deletingDate)) {
            const pVente = (unitPriceHt - discount) * quantity;
            const pAchat = acquisitionPriceReal * quantity;
            totalPAchat += pAchat;
            totalPVente += pVente;
        }
        return { totalPAchat, totalPVente };
    }

    calculToTalDiscount(cartItems: any): any {
        let sommeDiscount= 0;
		cartItems.forEach(
            (item)=>{
                if(item && item.discount) {
                    sommeDiscount += parseInt(item.discount);
                }
            }); 
		return sommeDiscount;
    }
    calculCartToTalTTC(cartItems: any): any {
        let cartTotal = 0.0;
		cartItems.forEach(
            (cartItemVO)=>{
                cartTotal += this.calculPriceTTC(cartItemVO);
            }
        ) 
		return cartTotal;
    }
    calculToTalBySubscriptionPeriodicity(cartItems: any, subscriptionPeriodicity: string): any {
        let totalBySubscriptionPeriodicity = 0.0;
		cartItems.forEach(
            (cartItemVO)=>{
                if (
                cartItemVO && cartItemVO.product && cartItemVO.product.masterProduct && subscriptionPeriodicity===cartItemVO.product.masterProduct.subscriptionPeriodicity
                ) {
            totalBySubscriptionPeriodicity = totalBySubscriptionPeriodicity + this.calculPriceTTC(cartItemVO);
        }
    })

    return totalBySubscriptionPeriodicity;
    }
    calculPriceTTC(cartItemVO: any): number {
        const totalPriceHt = this.calculPriceHT(cartItemVO);
		const tauxTVA =this.getTvaNumberValue(cartItemVO.tauxTVA);
		return (tauxTVA/ 100 + 1) * totalPriceHt;
    }
    calculPriceHT(cartItemVO: any) {
        const unitPriceHt = cartItemVO.unitPriceHt;
		let price  = unitPriceHt;
		const discount = cartItemVO.discount;
		const quantity = cartItemVO.quantity;
		if (quantity > 0) {
			if(cartItemVO.product && cartItemVO.product.discountIncluded) {
				price = (unitPriceHt - discount) * quantity;
			} else if (!discount || discount === 0) { 
				price = unitPriceHt * quantity;
			} else {
				price = (unitPriceHt - discount) * quantity;
			}
		}
		return price;
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
	
}
