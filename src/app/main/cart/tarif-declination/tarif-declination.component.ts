import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {FormBuilder,FormGroup,FormArray, FormControl } from '@angular/forms';
import { AdminProductVO } from '../../../_core/models/admin-product-vo';
import { FamilyVO } from '../../../_core/models/family-vo';
import { CatalogeService } from '../../../_core/services/http-catalog.service';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { CUSTOMER_TARGET, LIST_INPUTS_ADMIN_PRODUCT_REQUIRED, PRODUCT_BLOCKED, PRODUCT_STATUS, TVA } from '../master-product.constants';
import { MasterProductService } from '../master-product.service';
import { PrixUnitaire } from '../prix-unitaire';

const CONTROLE = "controls";
const ITEMS = "items";
@Component({
  selector: 'app-tarif-declination',
  templateUrl: './tarif-declination.component.html',
  styleUrls: ['./tarif-declination.component.scss']
})
export class TarifDeclinationComponent implements OnInit, OnChanges {

  @Input()
  productsVO: AdminProductVO[] = [];
  @Input()
  categories: FamilyVO[] = [];
  prixUnitaire: PrixUnitaire = {} as PrixUnitaire;
  productStatus: {key: string, value: string}[] = [];
  productBlocked: {key: string, value: string}[] = [];
  listTva: {key: string, value: string}[] = [];
  categorie = new FormControl();
  status = new FormControl();
  blocked = new FormControl();
  unitaireTva = new FormControl();
  zero = 0;
  incluse = false;
  @Input()
  isSubmit = false;
  @Output() changeForm = new EventEmitter<Object>();
  familySelected: FamilyVO = {} as FamilyVO;
  showcontent = true;
  orderForm: FormGroup;
  items: FormArray;
  id ="";
  loading = false;
  constructor(private formBuilder: FormBuilder,
    private readonly masterProductService: MasterProductService,
    private readonly catalogService: CatalogeService) {
      this.orderForm = new FormGroup({
        items: new FormArray([])
      });
      this.masterProductService.prixUnitaire$.subscribe((data)=>{
        this.prixUnitaire = data;
        if(this.prixUnitaire.isDevis) {
          this.orderForm.get(ITEMS)[CONTROLE].forEach((element, index) => {
            this.orderForm.get(ITEMS)[CONTROLE][index][CONTROLE].unitaireTva.setValue(data.tva);
            element.get('remiseinclus').disable();
            element.get('remiseinclus').setValue(false);
            element.get('remiseht').disable();
            element.get('prixinclus').disable();
            element.get('prixinclus').setValue(false);
            element.get('offert').disable();
            element.get('offert').setValue(false);
          })
        } else {
          this.orderForm.get(ITEMS)[CONTROLE].forEach((element, index) => {
            element.get('remiseinclus').enable();
            element.get('remiseht').enable();
            element.get('prixinclus').enable();
            element.get('offert').enable();
            this.setPrixHtAndTTC(data.prixHt, index, data.tva)
            this.orderForm.get(ITEMS)[CONTROLE][index][CONTROLE].unitaireht.setValue(data.prixHt);
            this.orderForm.get(ITEMS)[CONTROLE][index][CONTROLE].unitairetaxe.setValue(data.prixTaxe);
            this.orderForm.get(ITEMS)[CONTROLE][index][CONTROLE].unitaireTva.setValue(data.tva);
            this.orderForm.get(ITEMS)[CONTROLE][index][CONTROLE].devis.setValue(data.isDevis);
          })
        }
      });
  }
     
  ngOnChanges(changes: SimpleChanges): void {
    this.onChangeForm();
  }
  ngOnInit(): void {
    this.setListProductStatus();
    this.setListProductBlocked();
    this.listTva = this.masterProductService.getListTva();
    if(!this.isSubmit) {
        if(!isNullOrUndefined(this.productsVO) && this.productsVO.length !== 0) {
        this.productsVO.forEach(product => {
          this.addDeclinationWithProductOrNull(product);
        })
      } else {
        this.addDeclinationWithProductOrNull(null);
      }
    }
    this.onChangeForm();
  }

  setListProductStatus(): void {
    this.productStatus = [];
    this.productStatus.push(PRODUCT_STATUS.ACTIVE);
    this.productStatus.push(PRODUCT_STATUS.INACTIVE);
  }

  setListProductBlocked(): void {
    this.productBlocked = [];
    this.productBlocked.push(PRODUCT_BLOCKED.FALSE);
    this.productBlocked.push(PRODUCT_BLOCKED.TRUE);
  }

  showHideAccordion(ids:any){    
    if(this.id === ids){
      this.id='';
    }else {
      this.id=ids;
    }
  }

createItem(product: AdminProductVO): FormGroup {
  if(product !== null) {
    return this.formBuilder.group({
      id: product.id,
      categorie: this.formBuilder.control(this.categorie.value),
      status: this.formBuilder.control(this.status.value),
      blocked: this.formBuilder.control(this.blocked.value),
      devis:this.formBuilder.control({value: product.prixSurDemande, disabled: true}),
      prixinclus:this.formBuilder.control(product.included),
      offert:this.formBuilder.control(product.discountFree),
      unitaireht: !isNullOrUndefined(product.priceHt) ? this.formBuilder.control(parseFloat(String(product.priceHt)).toFixed(2)): this.formBuilder.control(null),
      unitairetaxe:!isNullOrUndefined(product.ecoTaxe) ? product.ecoTaxe.toFixed(2) :  this.zero.toFixed(2),
      unitaireTva: this.formBuilder.control(this.unitaireTva.value),
      unitairettc:this.formBuilder.control(this.getPrixUnitaireTTC(product)),
      libellefacture:this.formBuilder.control(product.libelleFacture),
      remiseinclus:this.formBuilder.control({value: product.discountIncluded, disabled: this.isRemiseIncluse(product)}),
      remiseht: product.discountIncluded && !isNullOrUndefined(product.discountHt) ? this.formBuilder.control(parseFloat(String(product.discountHt)).toFixed(2)) : this.zero.toFixed(2),
      remisettc: product.discountIncluded ? this.formBuilder.control(this.calculeRemiseTTC(product.discountHt, this.masterProductService.getNumberValueTva(product.tva))): null,
      netttc: product.discountIncluded ? this.formBuilder.control(this.calculePrixNetTTC(Number(this.getPrixUnitaireTTC(product)), Number(this.calculeRemiseTTC(product.discountHt, this.masterProductService.getNumberValueTva(product.tva))))): null,
      factureremise: product.discountIncluded ? this.formBuilder.control(product.discountLabel) : null,
      garantieinclus:this.formBuilder.control(product.isWarranty),
      libellegarantie: product.isWarranty ? this.formBuilder.control(product.warrantyLabel) : null,
      showcontent:true,
      family: product.family
     });
  } else {
    return this.formBuilder.group({
      categorie: '',
      status: PRODUCT_STATUS.ACTIVE.value,
      blocked:PRODUCT_BLOCKED.FALSE.value,
      devis: this.formBuilder.control({value: this.prixUnitaire.isDevis, disabled: true}),
      prixinclus:false,
      offert:false,
      unitaireht:Number(this.prixUnitaire.prixHt).toFixed(2),
      unitairetaxe:Number(this.prixUnitaire.prixTaxe).toFixed(2),
      unitaireTva:this.prixUnitaire.tva,
      unitairettc:Number(this.prixUnitaire.prixTTC).toFixed(2),
      libellefacture:'',
      remiseinclus: this.formBuilder.control({value: false, disabled:  this.prixUnitaire.isDevis}),
      remiseht:this.formBuilder.control({value: this.zero.toFixed(2), disabled:  this.prixUnitaire.isDevis}),
      remisettc:this.formBuilder.control({value: this.zero.toFixed(2), disabled:  this.prixUnitaire.isDevis}),
      netttc:this.formBuilder.control({value: this.zero.toFixed(2), disabled:  this.prixUnitaire.isDevis}),
      factureremise:'',
      garantieinclus: false,
      libellegarantie:'',
      showcontent:true, 
      id: 0,
      family: this.familySelected
     });
  }
  
}

initCategorie(id: number): void {
  for(let family of this.categories) {
    if(family.id === id) {
      this.categorie.setValue(family);
      return ;
    }
  }
}

getPrixUnitaireTTC(product: AdminProductVO): string {
  return this.calculePrixUnitaireTTC(product.priceHt, this.masterProductService.getNumberValueTva(product.tva));
}

calculePrixUnitaireTTC(prixHt: number , tva: number): string {
  let value = (prixHt * (1+ (tva / 100)));
  return value.toFixed(2);
}

calculeRemiseTTC(remiseHT: number, tva): string {
  let value = (remiseHT * (1+ (tva / 100)));
  return value.toFixed(2);
}

calculePrixNetTTC(prixUnitaireTTC: number, remiseTTC: number): string {
  let value = prixUnitaireTTC - remiseTTC;
  return value.toFixed(2);
}

initTVA(key: string): void {
  for(let tva of this.listTva) {
    if(tva.key === key) {
      this.unitaireTva.setValue(tva.value);
      return;
    }
    this.unitaireTva.setValue(TVA.TVA_NORMALE.value);
  }
}

initProductStatus(cle: string): void {
  for(let status of this.productStatus) {
    if(status.key === cle) {
      this.status.setValue(status.value);
      return;
    }
    this.status.setValue(PRODUCT_STATUS.ACTIVE.value);
  }

  
}

initProductBlocked(isBloked: boolean): void { 
    if(isBloked) {
      this.blocked.setValue(PRODUCT_BLOCKED.TRUE.value);
    } else {
      this.blocked.setValue(PRODUCT_BLOCKED.FALSE.value);
  }
}

addDeclinationWithProductOrNull(product: AdminProductVO): void {
  if(product === null) {
    if(isNullOrUndefined(this.items)) {
      this.items = this.orderForm.get(ITEMS) as FormArray;
    }
    this.items.push(this.createItem(null));
  } else {
    this.items = this.orderForm.get(ITEMS) as FormArray;
    if(!isNullOrUndefined(product.family) && !isNullOrUndefined(product.family.parent)) {
      this.initCategorie(product.family.parent.parent.id)
    }
    this.initProductStatus(product.status);
    this.initProductBlocked(product.blocked);
    this.initTVA(product.tva);
    this.items.push(this.createItem(product));
  }  
}

deleteDeclination(i): void {
  this.items.removeAt(i)
}

categorieValue(i): string{
  const control = this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].categorie;
  if(control.value.name !== '--') {
    return control.value.name;
  }
  return ''; 
  
}

showOrHide(item){
  return item.controls.showcontent.value;
}

openAccordion(i): void{
  i.controls.showcontent.value = !i.controls.showcontent.value 
}

  onChangePrix(i: number, inputName: string): void {
    if(this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].devis.value === true && inputName === 'devis') {
      this.isDevis(i);
    } else if(this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].prixinclus.value === true && inputName === 'prixinclus' ) {
      this.isInclut(i);
    } else if(this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].offert.value === true && inputName === 'offert' ) {
      this.isOffert(i);
    } else {
      this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].offert.enable();
      this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].prixinclus.enable();
      this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitaireht.enable();
      this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitairetaxe.enable();
      this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].factureremise.enable();
      this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remiseinclus.enable();
      this.prixUnitaire.isDevis = false;
      this.masterProductService.prixUnitaire$.next(this.prixUnitaire);
    }
   }

   isOffert(i): void {
    this.prixUnitaire.isDevis = false;
    this.masterProductService.prixUnitaire$.next(this.prixUnitaire);
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].devis.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitaireht.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].prixinclus.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].offert.enable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitairetaxe.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].factureremise.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remiseinclus.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remiseinclus.setValue(false);
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].prixinclus.setValue(false);
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].devis.setValue(false);
   }

   isInclut(i): void {
    this.prixUnitaire.isDevis = false;
    this.masterProductService.prixUnitaire$.next(this.prixUnitaire);
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].devis.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].offert.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitaireht.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].prixinclus.enable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitairetaxe.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].factureremise.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remiseinclus.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remiseinclus.setValue(false);
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].devis.setValue(false);
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].offert.setValue(false);
   }

   isDevis(i): void {
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitaireht.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].prixinclus.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].offert.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitairetaxe.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].factureremise.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remiseinclus.disable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remiseinclus.setValue(false);
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].prixinclus.setValue(false);
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].offert.setValue(false);
    this.prixUnitaire.isDevis = true;
    this.masterProductService.prixUnitaire$.next(this.prixUnitaire);
   }

   onblurEvent(event, i, inputName: string): void {
    const tva = this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitaireTva.value;
     if(inputName === 'unitaireht' && event.target.value !== '') {
       this.setPrixHtAndTTC(event.target.value, i, tva);
     } else if(inputName === 'unitairetaxe' && event.target.value !== '') {
       this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitairetaxe.setValue(parseFloat(event.target.value).toFixed(2));
     } else if(inputName === 'remiseht' && event.target.value !== '') {
      const remiseht = parseFloat(event.target.value).toFixed(2);
      this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remiseht.setValue(remiseht);
      if(isNullOrUndefined(remiseht) || remiseht === this.zero.toFixed(2)) {
        this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remisettc.setValue(this.zero.toFixed(2));
        this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].netttc.setValue(this.zero.toFixed(2));
      } else {
        let remiseTTC = this.calculeRemiseTTC(Number(remiseht), tva);
        this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remisettc.setValue(remiseTTC);
        let prixUnitaireTTC = this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitairettc.value;
        let prixTTC = this.calculePrixNetTTC(Number(prixUnitaireTTC), Number(remiseTTC));
        this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].netttc.setValue(prixTTC);
      }
     }
   }

   setPrixHtAndTTC(value, i: string, tva): void {
    const unitaireHt = parseFloat(value).toFixed(2);
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitaireht.setValue(unitaireHt);
    let valueTTC = this.calculePrixUnitaireTTC(Number(unitaireHt), tva);
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitairettc.setValue(valueTTC);
   }

   floatToIntTva(value: string): number {
     return this.masterProductService.floatToIntTva(value);
   }

   onChangeIncluseRemise(i): void {
    if(this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remiseinclus.value === true) {
       this.isIncluse(i);
    } else {
      this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remiseht.disable();
      this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].factureremise.disable();
    }
   }

   isIncluse(i): void {
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remiseht.enable();
    this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].factureremise.enable();
   }

   isDisabledRemise(i): boolean {
     return (this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remiseinclus.value === true &&
      this.prixUnitaire.isDevis === false) ? false : true;
   }

   isOfferOrInclusOrDevis(i): boolean {
    return this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].offert.value === true || 
           this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].prixinclus.value === true ||
           this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].devis.value === true
  }

   onChangeIncluseGarantie(i): void {
    if(this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].garantieinclus.value === true) {
        this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].libellegarantie.enable();
    } else {
      this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].libellegarantie.disable();
    }
   }

   isDisabledGarantie(i): boolean {
     return this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].garantieinclus.value === true ? false : true;
    }

    onChangeTva(i): void {
      const tva = this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitaireTva.value;
      const prixUnite = this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitaireht.value;
      if(isNullOrUndefined(prixUnite) || prixUnite === this.zero.toFixed(2)) {
        this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitairettc.setValue(this.zero.toFixed(2));
      } else {
        let valueTTC = this.calculePrixUnitaireTTC(Number(prixUnite), tva);
        this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitairettc.setValue(valueTTC);
      }
      const remiseht = this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remiseht.value;
      if(isNullOrUndefined(remiseht) || remiseht === this.zero.toFixed(2)) {
        this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remisettc.setValue(this.zero.toFixed(2));
        this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].netttc.setValue(this.zero.toFixed(2));
      } else {
        let remiseTTC = this.calculeRemiseTTC(Number(remiseht), tva);
        this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].remisettc.setValue(remiseTTC);
        let prixUnitaireTTC = this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].unitairettc.value;
        let prixTTC = this.calculePrixNetTTC(Number(prixUnitaireTTC), Number(remiseTTC));
        this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].netttc.setValue(prixTTC);
      }
    }

    onChangeForm() {
      if (!isNullOrUndefined(this.orderForm)) {
        this.orderForm.valueChanges.subscribe(() => {
          this.changeForm.emit({
            values: this.setListAdminProductVO(this.orderForm.value),
            dirty: this.orderForm.dirty,
            errors: this.setErrors()
          });
        });
      }
    }

    setListAdminProductVO(forms: any): AdminProductVO[] {
      let admins = [];
      forms.items.forEach((admin, index) => {
        this.productsVO.forEach(product =>  {
          if( product.id === admin.id) {
              admins.push(this.setAdminProductVO(product, admin, product.id));
           }
        });
        let productVO: AdminProductVO = {} as AdminProductVO;
        if(admin.id === 0) {
           admins.push(this.setAdminProductVO(productVO, admin, 0));
        }
      });
      return admins;
    }

    setAdminProductVO(product: AdminProductVO, admin: any, id: number): AdminProductVO {
              product.showingAnnualReport = false;
              product.prixSurDemande = this.prixUnitaire.isDevis;
              product.included = isNullOrUndefined(admin.prixinclus) ? false : admin.prixinclus;
              product.discountFree = isNullOrUndefined(admin.offert) ? false : admin.offert;
              product.priceHt = admin.unitaireht;
              product.libelleFacture = admin.libellefacture;
              product.discountIncluded = isNullOrUndefined(admin.remiseinclus) ? false : admin.remiseinclus;
              product.customerTarget = CUSTOMER_TARGET.ANY.key;
              product.status = this.masterProductService.getStatusProduct(admin.status);
              product.blocked = admin.blocked === 'oui' ? true : false ;
              product.showingPortal = true;
              product.discountHt = admin.remiseht === null ? this.zero.toFixed(2) : admin.remiseht;
              product.discountLabel = product.discountIncluded ? admin.factureremise : '';
              product.isWarranty = isNullOrUndefined(admin.garantieinclus) ? false : admin.garantieinclus;
              product.warrantyLabel = product.isWarranty ? admin.libellegarantie : '';
              product.id = id;
              product.family = admin.family;
              product.tva = this.masterProductService.getKeyTvaByNum(admin.unitaireTva);
              product.ecoTaxe = admin.unitairetaxe;
              return product;
    }

    isValidateInputWithTouchedOrSubmit(input: string, index): boolean {
      const control = this.orderForm.get(ITEMS)[CONTROLE][index].get(input);
      return ((this.isSubmit || control.touched) && 
               (control.value === null ||
                control.value === undefined ||
                control.value === '' || control.value === '--'));
    }

    isValidateInput(input: string, index): boolean {
      const control = this.orderForm.get(ITEMS)[CONTROLE][index].get(input);
      return   (control.value === null ||
                control.value === undefined ||
                control.value === '' || control.value === '--');
     }

     isValidLibelleFactureGarantieOrRemise(input: string, index): boolean {
       const control = this.orderForm.get(ITEMS)[CONTROLE][index].get(input);
       let isRequired = false;
       if(input === LIST_INPUTS_ADMIN_PRODUCT_REQUIRED.LIBELLE_FACTURE_GARANTIE.name) {
         isRequired = !this.isDisabledGarantie(index);
       } else if(input === LIST_INPUTS_ADMIN_PRODUCT_REQUIRED.LIBELLE_FACTURE_REMISE.name) {
         isRequired = !this.isDisabledRemise(index);
       }
       return isRequired && (control.value === null ||
        control.value === undefined ||
        control.value === '' )
     }

    setErrors(): string[] {
      let errors = [];
      if(!isNullOrUndefined(this.orderForm.value)) {
        for(let index = 0; index < this.orderForm.value.items.length; index++) {
          if(this.isValidateInput(LIST_INPUTS_ADMIN_PRODUCT_REQUIRED.CATEGORIE.name,index) && !errors.includes(this.masterProductService.setErrorText(LIST_INPUTS_ADMIN_PRODUCT_REQUIRED.CATEGORIE.value))) {
            errors.push(this.masterProductService.setErrorText(LIST_INPUTS_ADMIN_PRODUCT_REQUIRED.CATEGORIE.value));
          } 
          if(this.isValidateInput(LIST_INPUTS_ADMIN_PRODUCT_REQUIRED.LIBELLE_FACTURE.name, index) && !errors.includes(this.masterProductService.setErrorText(LIST_INPUTS_ADMIN_PRODUCT_REQUIRED.LIBELLE_FACTURE.value))) {
             errors.push(this.masterProductService.setErrorText(LIST_INPUTS_ADMIN_PRODUCT_REQUIRED.LIBELLE_FACTURE.value));
          }
          if(this.isValidLibelleFactureGarantieOrRemise(LIST_INPUTS_ADMIN_PRODUCT_REQUIRED.LIBELLE_FACTURE_GARANTIE.name, index) && !errors.includes(this.masterProductService.setErrorText(LIST_INPUTS_ADMIN_PRODUCT_REQUIRED.LIBELLE_FACTURE_GARANTIE.value))) {
              errors.push(this.masterProductService.setErrorText(LIST_INPUTS_ADMIN_PRODUCT_REQUIRED.LIBELLE_FACTURE_GARANTIE.value));
          }
          if(this.isValidLibelleFactureGarantieOrRemise(LIST_INPUTS_ADMIN_PRODUCT_REQUIRED.LIBELLE_FACTURE_REMISE.name, index) && !errors.includes(this.masterProductService.setErrorText(LIST_INPUTS_ADMIN_PRODUCT_REQUIRED.LIBELLE_FACTURE_REMISE.value))) {
            errors.push(this.masterProductService.setErrorText(LIST_INPUTS_ADMIN_PRODUCT_REQUIRED.LIBELLE_FACTURE_REMISE.value));
          }
        }
      }
      return errors;
    }

    changeCategory(i): void {
      const category = this.orderForm.get(ITEMS)[CONTROLE][i].get("categorie");
      const family = this.orderForm.get(ITEMS)[CONTROLE][i].get("family");
      if(!isNullOrUndefined(category.value)) {
        this.loading = true;
        this.catalogService.getUnderFamilyWithCategory(category.value.id, category.value.name).subscribe(data => {
          family.setValue(data);
        },
         (error) => {
          console.error(error);
          this.loading = false;
         },
         () => {
          this.loading = false;
        })
      }
      
    }

  isValidForDelete(i): boolean {
    return this.orderForm.get(ITEMS)[CONTROLE][i][CONTROLE].id.value === 0;
  }

  isRemiseIncluse(product: AdminProductVO): boolean {
    return product.prixSurDemande || product.included ||
           product.discountFree;
  }
}
