import { Injectable } from "@angular/core";
import { SubscriptionPeriodicity } from "../../_core/enum/subscription-periodicity";
import { ReferenceDataVO } from "../../_core/models/reference-data-vo";
import { NomenclatureVO } from "../../_core/models/nomenclature-vo";
import { NomenclatureService } from "../../_core/services/nomenclature.service";
import { isNullOrUndefined } from "../../_core/utils/string-utils";
import { ManufacturerVO } from "../../_core/models/manufacturer-vo";
import { PartnerVo } from "../../_core/models/partner-vo";
import { ACQUISITION, CUSTOMER_TARGET, LABEL_SUBSCRIPTION_PERIODICITY, 
    PRODUCT_BLOCKED, PRODUCT_STATUS, TVA } from './master-product.constants';
import { Subject } from "rxjs";
import { PrixUnitaire } from "./prix-unitaire";

@Injectable({
    providedIn:'root'
})
export class MasterProductService {

    constFrequence = {} as {cle: string, valeur: string};
    prixUnitaire$: Subject<PrixUnitaire> = new Subject();
    constructor(private readonly nomenclatureHttpService: NomenclatureService) {
        
    }

    getdefaultListNomenClature1(): NomenclatureVO[] {
        let nomenClatures1List: NomenclatureVO[] = [];
       
        let nomenClatureService = {} as NomenclatureVO;
        let nomeClatureMaterials = {} as NomenclatureVO;
         nomenClatureService.label = 'Services';
         nomenClatureService.value = 'A';
         nomeClatureMaterials.label = 'Matériels';
         nomeClatureMaterials.value = 'B';
        nomenClatures1List.push(nomenClatureService);
        nomenClatures1List.push(nomeClatureMaterials);
        return nomenClatures1List;
    }
    setTousToNomenClature(): NomenclatureVO {
        let nomenClatureDefault = {} as NomenclatureVO;
         nomenClatureDefault.label = 'Tous';
         nomenClatureDefault.id = -1;
        return nomenClatureDefault;
    }
 
  getListNomenClature(valueParent: string): NomenclatureVO[] {
      let dataNomenClature = [];
      this.nomenclatureHttpService.findByNomenclatureParentValue(valueParent).subscribe(data => {
          dataNomenClature = data;
      });
      return dataNomenClature;

  }

  initFrequenceFacturation(): {cle: string, valeur: string}[] {
    let frequenceActe:Frequence = {} as Frequence;
    let frequenceMonthly:Frequence = {} as Frequence;
    let frequenceYearly:Frequence = {} as Frequence;
    const listFrequenceFacturation:Frequence[] = [];
    frequenceActe.cle = SubscriptionPeriodicity.ACTE;
    frequenceActe.valeur = LABEL_SUBSCRIPTION_PERIODICITY.ACTE;
    listFrequenceFacturation.push(frequenceActe);
    frequenceMonthly.cle = SubscriptionPeriodicity.MONTHLY;
    frequenceMonthly.valeur = LABEL_SUBSCRIPTION_PERIODICITY.MONTHLY;
    listFrequenceFacturation.push(frequenceMonthly);
    frequenceYearly.cle = SubscriptionPeriodicity.YEARLY;
    frequenceYearly.valeur = LABEL_SUBSCRIPTION_PERIODICITY.YEARLY;
    listFrequenceFacturation.push(frequenceYearly);
    return listFrequenceFacturation;
  }

  getFrequenceFacturation(cle: string, listFrequence: Frequence[]): string {
      if(!isNullOrUndefined(listFrequence)) {
          for(let frequence of listFrequence) {
              if(cle === frequence.cle) {
                  return frequence.cle;
              }
          }
      }
      return null;
  }

  getReferenceData(id: number, listRefs: ReferenceDataVO[]): ReferenceDataVO {
    if(!isNullOrUndefined(listRefs)) {
      for(let referenceData of listRefs) {
        if(referenceData.id === id) {
          return referenceData;
        }
      }
    }
    return null;
  }

  getManuFacture(id: number, listManuFactures: ManufacturerVO[]): ManufacturerVO {
      if(!isNullOrUndefined(listManuFactures)) {
          for(let manu of listManuFactures) {
              if(manu.id === id) {
                  return manu
              }
          }
      }
      return null;
  }

  getPartner(id: number, listPartners: PartnerVo[]) : PartnerVo {
      if(!isNullOrUndefined(listPartners))  {
          for(let partner of listPartners) {
              if(partner.id === id) {
                  return partner;
              }
          }
      }
      return null;
  }

  getNomenClature(nCode: string, listNomenClature: NomenclatureVO[]): NomenclatureVO {
      if(!isNullOrUndefined(listNomenClature)) {
        for(let nomen of listNomenClature) {
            if(nomen.value === nCode) {
                return nomen;
            }
        }
      } 
      return null;
  }

    getIndexByEnum(enumName:String):number
		{
			let index : number;
			switch (enumName) {
				case ACQUISITION.ACQUISITION_PRICE: index = 0; break;
				case ACQUISITION.MARGIN_RATE: index = 1; break;
				case ACQUISITION.MARGIN_VALUE: index = 2; break;
			}
			return index;
		}

        getNumberValueTva(key: string) {
            let value = 0;
            switch(key) {
                case TVA.TVA_NORMALE.key: value = 20.0; break;
                case TVA.OLD_TVA_NORMALE.key: value = 19.6; break;
                case TVA.OLD_TVA_REDUITE.key: value = 5.5; break;
                case TVA.TVA_REDUITE.key: value = 7.0; break;
                case TVA.TVA_MOYENNE.key: value = 10.0; break;
            }
           return value;
        }

        getPrixUnitaireTTC(product: any): number {
            if(product){
                let tva = 'productTva' in product ? product.productTva:product.tva;
                return this.calculePrixUnitaireTTC(product.priceHt, this.getNumberValueTva(tva));
            }
            return 0;
        }

        calculePrixUnitaireTTC(prixHt: number , tva: number): number {
            let value = (prixHt * (1+ (tva / 100)));
            return Number(value.toFixed(2));
        }

        calculePrixNetTTC(prixUnitaireTTC: number, remiseTTC: number): string {
            let value = prixUnitaireTTC - remiseTTC;
            return value.toFixed(2);
        }

        calculeRemiseTTC(remiseHT: number, tva): number {
            let value = (remiseHT * (1+ (tva / 100)));
            return Number(value.toFixed(2));
        }
        

        getCustomerTarget(value: string) {
            let key = '';
            switch(value) {
                case CUSTOMER_TARGET.ANY.value: key = CUSTOMER_TARGET.ANY.key; break;
                case CUSTOMER_TARGET.MEMBER.value: key = CUSTOMER_TARGET.MEMBER.key; break;
                case CUSTOMER_TARGET.NOT_MEMBER.value: key = CUSTOMER_TARGET.NOT_MEMBER.key; break;
            }
            return key;
        }

        getStatusProduct(value: string): string {
            let key = '';
            switch(value) {
                case PRODUCT_STATUS.ACTIVE.value: key = PRODUCT_STATUS.ACTIVE.key; break;
                case PRODUCT_STATUS.INACTIVE.value: key = PRODUCT_STATUS.INACTIVE.key; break;
            }
            return key;
        }
        getKeyBlocked(value: string): boolean {
            let key = false;
            switch(value) {
                case PRODUCT_BLOCKED.FALSE.value: key = false ; break;
                case PRODUCT_BLOCKED.TRUE.value: key = true ; break;
            }
            return key;
        }

        setErrorText(name: string): string {
            return `le champ ${name} est obligatoire`;
          }

          getKeyTvaByNum(num: string): string {
            let key = '';
            switch(num) {
                case TVA.TVA_NORMALE.value : key = TVA.TVA_NORMALE.key; break;
                case TVA.OLD_TVA_NORMALE.value : key = TVA.OLD_TVA_NORMALE.key; break;
                case TVA.OLD_TVA_REDUITE.value : key = TVA.OLD_TVA_REDUITE.key; break;
                case TVA.TVA_REDUITE.value : key = TVA.TVA_REDUITE.key; break;
                case TVA.TVA_MOYENNE.value : key = TVA.TVA_MOYENNE.key; break;
                case TVA.NO_TVA.value : key = TVA.NO_TVA.key; break;
            }
           return key;
          }
          getListTva(): Objet[] {
            let listTva = [];
            listTva.push(TVA.TVA_NORMALE);
            listTva.push(TVA.TVA_MOYENNE);
            listTva.push(TVA.TVA_REDUITE);
            listTva.push(TVA.NO_TVA);
            listTva.push(TVA.OLD_TVA_NORMALE);
            listTva.push(TVA.OLD_TVA_REDUITE);
            return listTva;
          }
          floatToIntTva(value: string): number {
            if(value === "20.0" || value === "10.0" || value === "7.0") {
              return Number(value) | 0;
            }
            return Number(value);
          }
          defaultHyphenInLifeProduct(): ReferenceDataVO {
            let ref: ReferenceDataVO = {} as ReferenceDataVO;
            ref.label = "--";
            ref.id = 0;
            return ref;
          }
}

export interface Frequence {
    cle: string;
    valeur: string;
}

export interface Objet {
    key: string;
    value: string;
}