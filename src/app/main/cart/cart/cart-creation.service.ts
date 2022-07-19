import { Injectable } from '@angular/core';
import { CartSavVO } from '../../../_core/models/models';

import { Person } from '../../../_core/models/person';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { Observable, of } from 'rxjs';
import { ReferenceDataVO } from '../../../_core/models';
import { CONF_ADDRESS_DELIVERY, PUBLIDISPATCH, REFERENCE_DATA_PANIER } from '../cart-constant';
import { PostalAdresseVO } from '../../../_core/models/postalAdresseVO';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { DEFAULT_STRING_EMPTY } from '../../../_core/constants/constants';

@Injectable({
    'providedIn':'root'
})
export class CartCreationService{

      isFromCancel = false;
      cartVO:any;
      cartLightVO:any;
      interlocutors: Person[] = [];
      detailRequestVO: RequestCustomerVO;
      cartSavVO : CartSavVO

//================= CART VO ===================
    /*  getCartVO(): Observable<any[]>{
        console.log('gettt cart from back restore ',Object.assign({}, this.cartVO))
        const tabCart = [];
        tabCart.push(Object.assign({}, this.cartVO));
       return of(tabCart);
       }

      setCartVO(cartVoIn:any){
        this.cartVO = Object.assign({}, cartVoIn);
      }
      
      restoreCart(cartVo){
        console.log('restoreCart ',cartVo);
        this.setCartVO(Object.assign({}, cartVo));
       }
     */
//================= CART LIGHT VO ========
      getCartLightVO(): Observable<any[]>{
        const tabCartLight = [];
        tabCartLight.push(this.cartLightVO);
       return of(tabCartLight);
      }
      setCartLightVO(cartLightVO){
        this.cartLightVO = Object.assign({}, cartLightVO);
      }
          
     restoreCartLight(carLighttVo){
      this.setCartLightVO(carLighttVo);
     }
//================= CART SAV VO ========
      getCartSavVo():Observable<any>{
      return of(this.cartSavVO);
      }

      setCartSavVo( cartSavVO : CartSavVO){
        this.cartSavVO = Object.assign({}, cartSavVO);
      }

      restoreCartSavVo(cartSavVo){
        this.setCartSavVo(cartSavVo);
      }
//==================== DETAIL REQUEST===============
      getDdetailRequestVO() :Observable<RequestCustomerVO>{
        return  of(this.detailRequestVO);
      }
      setDetailRequestVO(detailRequestVO: RequestCustomerVO){
        this.detailRequestVO = Object.assign({}, detailRequestVO);
      }
      restoreDetailRequest(detailRequestVO){
        this.setDetailRequestVO(detailRequestVO);
      }

//==================== INTEROCUTORS ===============
      getInterlocuterus(): Observable<any[]>{
        return of(this.interlocutors);
       }

      setInterlocuteurs(interlocutors: Person[]){
        interlocutors.map((inter=> this.interlocutors.push(Object.assign({}, inter))));
      }
      
      restoreInterlocuteurs(interlocuteurs){
        if(this.interlocutors && this.interlocutors.length){
          this.interlocutors = [];
        }
        this.setInterlocuteurs(interlocuteurs);
      }
    
    formattedListModeDelivery(refs: ReferenceDataVO[]): ReferenceDataVO[] {
       const listReference = [];
       for (const ref of refs) {
         if(ref.key === REFERENCE_DATA_PANIER.PRESTATAIRE_LIVRAISON.key) {
          listReference.push(ref);
         }
       }
       this.getListCoachOrTechniciant(refs).forEach( data => {
          listReference.push(data);
        })
       this.getOtherListRefWithOrder(refs).forEach(data => {
          listReference.push(data);
       })
       return listReference;
    }

    getOtherListRefWithOrder(listRefData: ReferenceDataVO[]): ReferenceDataVO[] {
      const results = [];
        for (const reference of listRefData) {
          if(reference.key === REFERENCE_DATA_PANIER.EVEMENTIEL.key) {
            results.push(reference);
          }
          if(reference.key === REFERENCE_DATA_PANIER.AUTRE.key) {
            results.push(reference);
          }
        }
      return results;
    }

    getListCoachOrTechniciant(listRefData: ReferenceDataVO[]) : ReferenceDataVO[] {
       const childrenCoach = [];
       const childTechnician = [];
       const listRef = [];
       for (const refData of listRefData) {
        if(refData.key.includes(REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH.key)) {
            childrenCoach.push(refData);
         } else if(refData.key.includes(REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN.key)) {
            childTechnician.push(refData);
        }
      }
      listRef.push(this.getParentCoachDelivery(this.sortArrayAlphabetically(childrenCoach)));
      listRef.push(this.getParentTechnicianDelivery(this.sortArrayAlphabetically(childTechnician)));
      return listRef;
    }

    sortArrayAlphabetically(refData: ReferenceDataVO[]): ReferenceDataVO[] {
        return refData.sort(function(a, b) {
          if(a.label < b.label) {
            return -1;
          }
          if(a.label > b.label) {
            return 1;
          }
          return 0
        })
      }
      
 
      getParentCoachDelivery(children: ReferenceDataVO[]): ReferenceDataVO {
        return  {
           id: 0,
           label: REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH.value,
           ordinal: 0,
           active: true,
           dateUpdate: new Date(),
           parent: null,
           children: children,
           list: null,
           key:'',
           logoName: '',
           labelComplement: ''
        }
        
      }

      getParentTechnicianDelivery(children: ReferenceDataVO[]): ReferenceDataVO {
        return {
           id: 0,
           label: REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN.value,
           ordinal: 0,
           active: true,
           dateUpdate: new Date(),
           parent: null,
           children: children,
           list: null,
           key:'',
           logoName: '',
           labelComplement: ''
        }
      }

      formatAddressToDelivery(address: PostalAdresseVO, modeDeliveryKey: ReferenceDataVO, stock: string): PostalAdresseVO {
        if(!isNullOrUndefined(modeDeliveryKey) &&  (modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_AIX.key ||
            modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_AIX.key) &&
            stock === PUBLIDISPATCH) {
            return this.getAddressAfterFomatter(address,
                CONF_ADDRESS_DELIVERY.AIX_LOCATION_ADRESSE,
                CONF_ADDRESS_DELIVERY.AIX_ADRESSE_NAME,
                CONF_ADDRESS_DELIVERY.AIX_LOCATION_POSTAL_CODE,
                CONF_ADDRESS_DELIVERY.AIX_LOCATION_CITY,
                CONF_ADDRESS_DELIVERY.AIX_LOCATION_ADRESSE3);
        } else if(!isNullOrUndefined(modeDeliveryKey) && (modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_PARIS.key ||
          modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_PARIS.key) &&
          stock === PUBLIDISPATCH) {
          return this.getAddressAfterFomatter(address,
            CONF_ADDRESS_DELIVERY.PARNASSE_LOCATION_ADRESSE, 
            CONF_ADDRESS_DELIVERY.PARNASSE_ADRESSE_NAME,
            CONF_ADDRESS_DELIVERY.PARNASSE_LOCATION_POSTAL_CODE,
            CONF_ADDRESS_DELIVERY.PARNASSE_LOCATION_CITY,
            DEFAULT_STRING_EMPTY);
        } else if ( !isNullOrUndefined(modeDeliveryKey) &&  (modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_RIVIERA.key ||
          modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_RIVIERA.key) &&
          stock === PUBLIDISPATCH) {
           return this.getAddressAfterFomatter(address,
              CONF_ADDRESS_DELIVERY.RIVIERA_LOCATION_ADRESSE,
              CONF_ADDRESS_DELIVERY.RIVIERA_ADRESSE_NAME,
              CONF_ADDRESS_DELIVERY.RIVIERA_LOCATION_POSTAL_CODE,
              CONF_ADDRESS_DELIVERY.RIVIERA_LOCATION_CITY,
              DEFAULT_STRING_EMPTY);
        } else if ( !isNullOrUndefined(modeDeliveryKey) &&  (modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_LYON.key ||
          modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_LYON.key) &&
          stock === PUBLIDISPATCH) {
            return this.getAddressAfterFomatter(address, 
              CONF_ADDRESS_DELIVERY.LYON_LOCATION_ADRESSE,
              CONF_ADDRESS_DELIVERY.LYON_ADRESSE_NAME,
              CONF_ADDRESS_DELIVERY.LYON_LOCATION_POSTAL_CODE,
              CONF_ADDRESS_DELIVERY.LYON_LOCATION_CITY,
              DEFAULT_STRING_EMPTY);
        } else if (!isNullOrUndefined(modeDeliveryKey) &&  (modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_LILLE.key ||
          modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_LILLE.key) &&
          stock === PUBLIDISPATCH) {
            return this.getAddressAfterFomatter(address,
              CONF_ADDRESS_DELIVERY.LILLE_LOCATION_ADRESSE,
              CONF_ADDRESS_DELIVERY.LILLE_ADRESSE_NAME,
              CONF_ADDRESS_DELIVERY.LILLE_LOCATION_POSTAL_CODE,
              CONF_ADDRESS_DELIVERY.LILLE_LOCATION_CITY,
              DEFAULT_STRING_EMPTY);
        } else if ( !isNullOrUndefined(modeDeliveryKey) && (modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_ANNECY.key ||
          modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_ANNECY.key) &&
          stock === PUBLIDISPATCH) {
            return this.getAddressAfterFomatter(address, 
              CONF_ADDRESS_DELIVERY.ANNECY_LOCATION_ADRESSE, 
              CONF_ADDRESS_DELIVERY.ANNECY_ADRESSE_NAME,
              CONF_ADDRESS_DELIVERY.ANNECY_LOCATION_POSTAL_CODE,
              CONF_ADDRESS_DELIVERY.ANNECY_LOCATION_CITY,
              CONF_ADDRESS_DELIVERY.ANNECY_LOCATION_ADRESSE3);
        } else if (!isNullOrUndefined(modeDeliveryKey) &&  (modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_RENNES.key ||
          modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_RENNES.key) &&
          stock === PUBLIDISPATCH) {
            return this.getAddressAfterFomatter(address,
              CONF_ADDRESS_DELIVERY.RENNES_LOCATION_ADRESSE,
              CONF_ADDRESS_DELIVERY.RENNES_ADRESSE_NAME,
              CONF_ADDRESS_DELIVERY.RENNES_LOCATION_POSTAL_CODE,
              CONF_ADDRESS_DELIVERY.RENNES_LOCATION_CITY,
              DEFAULT_STRING_EMPTY);
        } else if (!isNullOrUndefined(modeDeliveryKey) &&  (modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_NANTES.key ||
          modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_NANTES.key) &&
          stock === PUBLIDISPATCH) {
            return this.getAddressAfterFomatter(address,
              CONF_ADDRESS_DELIVERY.NANTES_LOCATION_ADRESSE,
              CONF_ADDRESS_DELIVERY.NANTES_ADRESSE_NAME,
              CONF_ADDRESS_DELIVERY.NANTES_LOCATION_POSTAL_CODE,
              CONF_ADDRESS_DELIVERY.NANTES_LOCATION_CITY,
              CONF_ADDRESS_DELIVERY.NANTES_LOCATION_ADRESSE3);
        } else if (!isNullOrUndefined(modeDeliveryKey) &&  (modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_CORSE_SUD.key ||
          modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_CORSE_SUD.key) &&
          stock === PUBLIDISPATCH) {
            return this.getAddressAfterFomatter(address,
              CONF_ADDRESS_DELIVERY.CORSE_SUD_LOCATION_ADRESSE,
              CONF_ADDRESS_DELIVERY.CORSE_SUD_ADRESSE_NAME,
              CONF_ADDRESS_DELIVERY.CORSE_SUD_LOCATION_POSTAL_CODE,
              CONF_ADDRESS_DELIVERY.CORSE_SUD_LOCATION_CITY,
              DEFAULT_STRING_EMPTY);
        } else if ( !isNullOrUndefined(modeDeliveryKey) &&  (modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_NORMANDIE.key ||
          modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_NORMANDIE.key) &&
          stock === PUBLIDISPATCH) {
            return this.getAddressAfterFomatter(address,
              CONF_ADDRESS_DELIVERY.NORMANDIE_LOCATION_ADRESSE, 
              CONF_ADDRESS_DELIVERY.NORMANDIE_ADRESSE_NAME,
              CONF_ADDRESS_DELIVERY.NORMANDIE_LOCATION_POSTAL_CODE,
              CONF_ADDRESS_DELIVERY.NORMANDIE_LOCATION_CITY,
              DEFAULT_STRING_EMPTY);
        } else if (!isNullOrUndefined(modeDeliveryKey) &&  (modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_BORDEAUX.key ||
          modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_BORDEAUX.key) &&
          stock === PUBLIDISPATCH) {
            return this.getAddressAfterFomatter(address,
              CONF_ADDRESS_DELIVERY.BORDEAUX_LOCATION_ADRESSE, 
              CONF_ADDRESS_DELIVERY.BORDEAUX_ADRESSE_NAME,
              CONF_ADDRESS_DELIVERY.BORDEAUX_LOCATION_POSTAL_CODE,
              CONF_ADDRESS_DELIVERY.BORDEAUX_LOCATION_CITY,
              CONF_ADDRESS_DELIVERY.BORDEAUX_LOCATION_ADRESSE3);
        } else if (!isNullOrUndefined(modeDeliveryKey) &&  (modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_TOULOUSE.key ||
          modeDeliveryKey.key === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_TOULOUSE.key) &&
          stock === PUBLIDISPATCH) {
            return this.getAddressAfterFomatter(address,
              CONF_ADDRESS_DELIVERY.TOULOUSE_LOCATION_ADRESSE, 
              CONF_ADDRESS_DELIVERY.TOULOUSE_ADRESSE_NAME,
              CONF_ADDRESS_DELIVERY.TOULOUSE_LOCATION_POSTAL_CODE,
              CONF_ADDRESS_DELIVERY.TOULOUSE_LOCATION_CITY,
              CONF_ADDRESS_DELIVERY.TOULOUSE_LOCATION_ADRESSE3);
        } else {
          return address;
        }
    
      }
    
      getAddressAfterFomatter(address: PostalAdresseVO, location: string, name: string, postalCode: string, city: string,
        addrLine3 : string): PostalAdresseVO {
        return {
          id: address.id,
          title: address.title, 
          firstName: address.firstName, 
          lastName: address.lastName,
          addrLine4: location,
          addrLine3: addrLine3,
          addrLine2: name,   
          addrLine5:  DEFAULT_STRING_EMPTY,
          logisticInfo: address.logisticInfo,
          cedex: address.cedex,
          postalCode: postalCode,
          country: address.country,
          city: city,
          socialTitle: address.socialTitle,
          companyName: address.companyName,
          types: address.types,
          personId : address.personId,
        }
      }

    }
