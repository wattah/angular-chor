import { Component, OnInit } from '@angular/core';
import { CatalogeService } from '../../../_core/services/http-catalog.service';
import { MasterProductVo } from '../../../_core/models/master-product-vo';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { MasterProductService } from '../master-product.service';
import { NomenclatureVO } from '../../../_core/models/nomenclature-vo';
import { NomenclatureService } from '../../../_core/services/nomenclature.service';
import { ReferenceDataService } from '../../../_core/services';
import { ReferenceDataVO } from '../../../_core/models';
import { ManufacturerService } from '../../../_core/services/manufacturer.service';
import { ManufacturerVO } from '../../../_core/models/manufacturer-vo';
import { PartnerService } from '../../../_core/services/partner.service';
import { PartnerVo } from '../../../_core/models/partner-vo';
import { SubscriptionPeriodicity } from '../../../_core/enum/subscription-periodicity';
import { ACQUISITION, ERROR_MESSAGE_NOT_EXIST_PRODUCT, ERROR_ORANGE_PRODUCT_REFERENCE, 
  LIST_INPUTS_MASTER_PRODUCT_REQUIRED, TVA, TypeData } from '../master-product.constants';
import { AdminProductVO } from '../../../_core/models/admin-product-vo';
import { MasterProduct } from '../../../_core/models/masterProduct/master-product';
import { getEncryptedValue } from '../../../_core/utils/functions-utils';
import { FamilyVO } from '../../../_core/models/family-vo';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { PrixUnitaire } from '../prix-unitaire';


@Component({
  selector: 'app-master-product.',
  templateUrl: './master-product-modification.component.html',
  styleUrls: ['./master-product-modification.component.scss']
})
export class MasterProductModificationComponent extends ComponentCanDeactivate implements OnInit {
  
  form: FormGroup;
  filesDoc: File[] = [];
  filesVis: File[] = [];
  fileInvalidDoc = false;
  fileInvalidVis = false;
  masterProductVO: MasterProductVo = {} as MasterProductVo;
  masterProduct: MasterProduct = {} as MasterProduct;
  masterProductId: number;
  nomenClatures1List: NomenclatureVO[] = [];
  nomenClatures2List: NomenclatureVO[] = [];
  nomenClatures3List: NomenclatureVO[] = [];
  nomenClatures4List: NomenclatureVO[] = [];
  nomenClatures5List: NomenclatureVO[] = [];
  nomenClature1 = new FormControl();
  nomenClature2 = new FormControl();
  nomenClature3 = new FormControl();
  nomenClature4 = new FormControl();
  nomenClature5 = new FormControl();
  categrieTps = new FormControl();
  limitee = new FormControl();
  occurrence = new FormControl();
  categriesTps:ReferenceDataVO[] = [];
  isHardware = false;
  isService = false;
  listManufacturers: ManufacturerVO[] = [];
  listPartners: PartnerVo[] = [];
  listPrefixe: ReferenceDataVO[] = [];
  listUnitesOeuvre: ReferenceDataVO[] = [];
  listFrequenceFacturation: {cle: string, valeur: string}[] = [];
  isLimitFrequenceFacturation = false;
  isNoPrefixe = false;
  productsVO: AdminProductVO[] = [];
  newProductsVO: AdminProductVO[] = [];
  errors: string[] = [];
  submitted;
  errorsAdminProduct: string[] = [];
  isTouchedAdminProduct = false;
  categories: FamilyVO[] = [];
  /**
   * les flags pour la gestion des documents (image, description)
   */
  isChangeDescription = false;
  isDeleteDescription = false;
  isChangeImage = false;
  isDeleteImage = false;
  isSubmit = false;
  isDirtyForm = false;
  productsLife: ReferenceDataVO[] = [];
  productLife = new FormControl();
  listTva: {key: string, value: string}[] = [];
  zero = 0;
  prixUnitaire: PrixUnitaire = {} as PrixUnitaire;
  loading = false;
  constructor(private readonly catalogService: CatalogeService,
              private readonly route: ActivatedRoute,
              private readonly _formBuilder: FormBuilder,
              private readonly masterProductService:MasterProductService,
              private readonly nomenclatureHttpService: NomenclatureService,
              private readonly referenceDataService: ReferenceDataService,
              private readonly manufacturerService: ManufacturerService,
              private readonly partnerService: PartnerService,
              private readonly router: Router,
              private readonly confirmationDialogService: ConfirmationDialogService,
              private readonly activeModal: NgbActiveModal) {
              super();
    }

  ngOnInit() {
    this.canceled = false;
    this.form = this.createFormGroup();
    this.isHardware = true;
    this.isService = true;
    this.masterProductVO = {} as MasterProductVo;
    this.route.data.subscribe(resolversData => {
      this.masterProductVO = resolversData['masterProductVO'];
      this.categories = resolversData['categories'];
      if (!isNullOrUndefined(this.masterProductVO)) {
          this.initProduct(this.masterProductVO.productsVO);
          if(!isNullOrUndefined(this.masterProductVO)) {
          this.initDataPage(this.masterProductVO);
         }
       }
     });
     this.onChangeFormMasterProduct();
    this.masterProductService.prixUnitaire$.subscribe((data)=>{
      this.form.get('devis').setValue(data.isDevis);
    });
  }
  initProduct(products: AdminProductVO[]) : void {
    this.productsVO = [];
    if(!isNullOrUndefined(products)) {
      for(let product of products) {
        this.productsVO.push(product);
      }
    }
  }
  setPrixUnit(products: AdminProductVO[]): void {
    const firstElementProductVO:AdminProductVO = products.shift();
    this.form.get('devis').setValue(firstElementProductVO.prixSurDemande);
    if(!isNullOrUndefined(firstElementProductVO.priceHt)) {
      this.form.get('unitaireht').setValue(parseFloat(String(firstElementProductVO.priceHt)).toFixed(2))
    }
    if(!isNullOrUndefined(firstElementProductVO.ecoTaxe)) {
      this.form.get('unitairetaxe').setValue(firstElementProductVO.ecoTaxe.toFixed(2));
    } else {
      this.form.get('unitairetaxe').setValue(this.zero.toFixed(2));
    }
    this.initTVA(firstElementProductVO.tva);
    const ttc = this.masterProductService.calculePrixUnitaireTTC(firstElementProductVO.priceHt, this.masterProductService.getNumberValueTva(firstElementProductVO.tva));
    this.form.get('unitairettc').setValue(ttc.toFixed(2));
    this.prixUnitaire.isDevis = firstElementProductVO.prixSurDemande;
  }

  initTVA(key: string): void {
    for(let tva of this.listTva) {
      if(tva.key === key) {
        this.form.get('unitaireTva').setValue(tva.value);
        return;
      }
      this.form.get('unitaireTva').setValue(TVA.TVA_NORMALE.value);
    }
  }

  createFormGroup(): FormGroup {
    return this._formBuilder.group({
      libelleInterne: this._formBuilder.control(''),
      libelleClient: this._formBuilder.control(''),
      codeEan: this._formBuilder.control(''),
      refOrange: this._formBuilder.control(null),
      refConstructeur: this._formBuilder.control(''),
      constructeur: this._formBuilder.control(null),
      partenaire: this._formBuilder.control(null),
      wingsm: this._formBuilder.control(false),
      publidispatch: this._formBuilder.control(false),
      dureeGarantie: 0,
      serie: this._formBuilder.control(false),
      prefixe: this._formBuilder.control(''),
      commentaire: this._formBuilder.control(false),
      prestationMesure: this._formBuilder.control(false),
      dureeInterevention: 0,
      deplacement: this._formBuilder.control(false),
      uniteOeuvre: this._formBuilder.control(null),
      frequenceFacturation: this._formBuilder.control(null),
      limitee: this.limitee,
      occurrence: this.occurrence,
      checkMarge: this._formBuilder.control(true),
      prixAcquisition: this._formBuilder.control(''),
      nomenClature1: this.nomenClature1,
      nomenClature2: this.nomenClature2,
      nomenClature3: this.nomenClature3,
      nomenClature4: this.nomenClature4,
      nomenClature5: this.nomenClature5,
      categrieTps: this.categrieTps,
      margeTaux: this._formBuilder.control(null),
      margeValeur: this._formBuilder.control(null),
      productLife: this.productLife,
      devis: false,
      unitaireTva: TVA.TVA_NORMALE.value,
      unitairetaxe: this.zero.toFixed(2),
      unitaireht: this.zero.toFixed(2),
      unitairettc: this.zero.toFixed(2)
    });
  }

  initDataPage(masterProductVo: MasterProductVo): void {
    this.form.setValue({
      libelleInterne: masterProductVo.name,
      libelleClient: masterProductVo.annualReport,
      codeEan: masterProductVo.eanCode,
      refOrange: masterProductVo.orangeProductReference,
      refConstructeur: masterProductVo.partnerProductReference,
      constructeur: null,
      partenaire: null,
      wingsm: masterProductVo.isOnStock,
      publidispatch: masterProductVo.isOnPublidispatchStock,
      dureeGarantie: masterProductVo.warrantyValue,
      serie: masterProductVo.serialRequired,
      prefixe: null,
      commentaire: masterProductVo.commentMandatory,
      prestationMesure: masterProductVo.customizedBenefit,
      dureeInterevention: masterProductVo.interventionDuration,
      deplacement: masterProductVo.travelIncluded,
      uniteOeuvre: null,
      frequenceFacturation: null,
      limitee: this.limitee,
      occurrence: this.occurrence,
      checkMarge: masterProductVo.pricingTypeReal,
      prixAcquisition: !isNullOrUndefined(masterProductVo.acquisitionPriceReal) ? masterProductVo.acquisitionPriceReal.toFixed(2) : null,
      nomenClature1: this.nomenClature1,
      nomenClature2: this.nomenClature2,
      nomenClature3: this.nomenClature3,
      nomenClature4: this.nomenClature4,
      nomenClature5: this.nomenClature5,
      categrieTps: this.categrieTps,
      margeTaux: !isNullOrUndefined(masterProductVo.marginRateReal) ? masterProductVo.marginRateReal.toFixed(2) : null,
      margeValeur: !isNullOrUndefined(masterProductVo.marginValueReal) ? masterProductVo.marginValueReal.toFixed(2) : null,
      productLife: this.productLife,
      unitairettc: this.zero.toFixed(2),
      unitairetaxe: this.zero.toFixed(2),
      devis: false,
      unitaireht: this.zero.toFixed(2),
      unitaireTva:TVA.TVA_NORMALE.value
    });
    this.nomenClatures1List = this.masterProductService.getdefaultListNomenClature1();
    this.listTva = this.masterProductService.getListTva();
    this.initPrixUnitaire();
    this.initNomenClature(masterProductVo);
    this.initCategoriesTps(masterProductVo);
    this.initConstructeur(masterProductVo);
    this.initPartner(masterProductVo);
    this.initLimitee(masterProductVo);
    this.initPrefixe(masterProductVo);
    this.initUniteOeuvre(masterProductVo)
    this.initFrequenceFacturation(masterProductVo);
    this.initDocumentsCatalog(masterProductVo);
    this.isNoPrefixe = this.masterProductVO.serialRequired;
    this.initProductsLife(masterProductVo);
    this.setPrixUnit(masterProductVo.productsVO);
  }

  onchangeCheckPrefixe() {
    this.isNoPrefixe = this.form.get('serie').value;
  }
  initPrixUnitaire(): void {
    this.prixUnitaire.isDevis = false;
    this.prixUnitaire.prixHt = this.zero.toFixed(2);
    this.prixUnitaire.prixTTC = this.zero.toFixed(2);
    this.prixUnitaire.prixTaxe = this.zero.toFixed(2);
    this.prixUnitaire.tva = TVA.TVA_NORMALE.value;
    this.masterProductService.prixUnitaire$.next(this.prixUnitaire);
  }

  initDocumentsCatalog(masterProductVo:MasterProductVo): void {
    if(!isNullOrUndefined(masterProductVo)) {
      this.filesDoc = [];
      this.filesVis = [];
      if(masterProductVo.documentProduct !== '') {
        let blobDocumentCatalog = new Blob([masterProductVo.documentProduct], { type: 'application/pdf' });
        var fileDocumentCatalog = new File([blobDocumentCatalog], masterProductVo.productDescriptionName);
        this.filesDoc.push(fileDocumentCatalog);
      }
      if(masterProductVo.imageProduct !== '') {
        let blobImageCatalog = new Blob([masterProductVo.imageProduct], { type: 'image/jpg' });
        var fileImageCatalog = new File([blobImageCatalog], masterProductVo.productImageName);
        this.filesVis.push(fileImageCatalog);
      }
    }
  }

 save() {
   this.submitted = true;
   this.isSubmit = true;
    this.errors = this.setErrors();
    if(isNullOrUndefined(this.errors) || this.errors.length === 0) {
      const masterProductToSave = this.setMasterProductToSave();
      if(isNullOrUndefined(masterProductToSave.masterProductVO.productsVO) ||
       masterProductToSave.masterProductVO.productsVO.length === 0 ){
         this.openPopupError(ERROR_MESSAGE_NOT_EXIST_PRODUCT.MESSAGE);
      } else {
        this.saveMasterProduct(masterProductToSave);
        this.submitted = true
        this.canceled = false;
      }
    } else {
      window.scroll(0,0);
    }
  }
  
  // permet de recevoir les nouvelles données modifier
  onChangeMasterProduct(masterProductVO: MasterProductVo): void {
    const newMasterProduct = { ...this.masterProduct.masterProductVO, ...masterProductVO };
    this.masterProduct = {
      ...this.masterProduct,
      masterProductVO: newMasterProduct
    };
  }

  setMasterProductToSave(): MasterProduct {
    this.onChangeMasterProduct(this.masterProductVO);
    this.setProductVOWithNewProduct(this.newProductsVO);
    if(this.isService) {
      this.masterProduct.masterProductVO.customizedBenefit = this.form.get("prestationMesure").value;
      this.masterProduct.masterProductVO.interventionDuration = this.form.get("dureeInterevention").value;
      this.masterProduct.masterProductVO.travelIncluded = this.form.get("deplacement").value;
      this.masterProduct.masterProductVO.unitOfWorkId = !isNullOrUndefined(this.form.get("uniteOeuvre").value) ? this.form.get("uniteOeuvre").value.id : null;
      this.masterProduct.masterProductVO.articleClassId = 3172;
      this.masterProduct.masterProductVO.subscriptionPeriodicity =!isNullOrUndefined(this.form.get("frequenceFacturation").value) ? this.form.get("frequenceFacturation").value : null;
      if(this.masterProduct.masterProductVO.subscriptionPeriodicity === SubscriptionPeriodicity.MONTHLY) {
        this.masterProduct.masterProductVO.isRecurrenceLimitee = this.form.get("limitee").value;
        this.masterProduct.masterProductVO.nbOccurrences = this.form.get("occurrence").value;
      }
      this.masterProduct.masterProductVO.isOnStock = false;
      this.masterProduct.masterProductVO.isOnPublidispatchStock = false;
    }
    if(this.isHardware) {
      this.masterProduct.masterProductVO.eanCode = this.form.get("codeEan").value;
      this.masterProduct.masterProductVO.articleClassId = 3171;
      this.masterProduct.masterProductVO.orangeProductReference = this.form.get("refOrange").value !== '' ? this.form.get("refOrange").value : null;
      this.masterProduct.masterProductVO.partnerProductReference = this.form.get("refConstructeur").value;
      this.masterProduct.masterProductVO.partnerId = this.form.get("partenaire").value.id;
      this.masterProduct.masterProductVO.manufacturerId = !isNullOrUndefined(this.form.get("constructeur").value) && this.form.get("constructeur").value !== '--' ? this.form.get("constructeur").value.id : null;
      this.masterProduct.masterProductVO.isOnStock = !isNullOrUndefined(this.form.get("wingsm").value) ?  this.form.get("wingsm").value : false;
      this.masterProduct.masterProductVO.isOnPublidispatchStock = !isNullOrUndefined(this.form.get("publidispatch").value) ? this.form.get("publidispatch").value : false;
      this.masterProduct.masterProductVO.warrantyValue = this.form.get("dureeGarantie").value;
    }
    this.masterProduct.masterProductVO.annualReport = this.form.get("libelleClient").value;
    this.masterProduct.masterProductVO.serialRequired = this.form.get("serie").value;
    this.masterProduct.masterProductVO.commentMandatory = this.form.get("commentaire").value;
    this.masterProduct.masterProductVO.acquisitionPriceReal = this.form.get("prixAcquisition").value;
    this.masterProduct.masterProductVO.marginRateReal = this.form.get("margeTaux").value;
    this.masterProduct.masterProductVO.marginValueReal = this.form.get("margeValeur").value;
    this.masterProduct.masterProductVO.nomenclature = this.form.get("nomenClature5").value;
    this.masterProduct.masterProductVO.tpsCategoryId = !isNullOrUndefined(this.form.get("categrieTps").value) ? this.form.get("categrieTps").value.id : null;
    this.masterProduct.masterProductVO.serialNumberPrefix = this.form.get("prefixe").value === '--' ? null : this.form.get("prefixe").value;
    if(this.isChangeDescription) {
      this.masterProduct.description = this.filesDoc[0];
    }
    if(this.isChangeImage) {
      this.masterProduct.image = this.filesVis[0];
    } 
    if(this.isDeleteImage) {
      this.masterProduct.masterProductVO.productImageName = null;
    }
    if(this.isDeleteDescription) {
      this.masterProduct.masterProductVO.productDescriptionName = null;
    }
    this.masterProduct.masterProductVO.pricingTypeReal = this.form.get("checkMarge").value;
    this.masterProduct.masterProductVO.pricingType = this.form.get("checkMarge").value;
    this.masterProduct.masterProductVO.shortDescription = null;
    this.masterProduct.masterProductVO.longDescription = null;
    this.masterProduct.masterProductVO.quantityBlocked = this.masterProduct.masterProductVO.serialRequired;
    if(this.masterProduct.masterProductVO.subscriptionPeriodicity === SubscriptionPeriodicity.YEARLY ||
      this.masterProduct.masterProductVO.subscriptionPeriodicity === SubscriptionPeriodicity.MONTHLY ) {
      this.masterProduct.masterProductVO.billingCategory = 'SUBSCRIPTION';
    } else if(this.masterProduct.masterProductVO.subscriptionPeriodicity === SubscriptionPeriodicity.ACTE) {
      this.masterProduct.masterProductVO.billingCategory = 'SERVICE';
    }
    this.masterProduct.masterProductVO.name = this.form.get("libelleInterne").value;
    this.masterProduct.masterProductVO.proratedAtBegin = false;
    this.masterProduct.masterProductVO.proratedAtEnd = false;
    this.masterProduct.masterProductVO.productLife = this.getProductLifeToSave();
    return this.masterProduct;
  }

  getProductLifeToSave(): ReferenceDataVO {
    return this.form.get("productLife").value.id === 0 ? null : this.form.get("productLife").value;
  }

  initLimitee(masterProduct: MasterProductVo): void {
    if(masterProduct !== null && masterProduct.subscriptionPeriodicity === SubscriptionPeriodicity.MONTHLY) {
      this.limitee.enable();
      if(!masterProduct.isRecurrenceLimitee) {
        this.occurrence.disable();
      }
      this.limitee.setValue(masterProduct.isRecurrenceLimitee);
      this.occurrence.setValue(masterProduct.nbOccurrences);
    } else {
      this.limitee.disable();
      this.limitee.setValue(false);
      this.initOccurence();
    }
    
  }
  initOccurence(): void {
    this.occurrence.disable();
    this.occurrence.setValue(0);
  }

  onSelectNomenClature(level: number): void {
    this.isHardware = !isNullOrUndefined(this.nomenClature1.value) && this.nomenClature1.value.value === 'B';
    this.isService = !isNullOrUndefined(this.nomenClature1.value) && this.nomenClature1.value.value === 'A';
    switch (level) {
      case 1:
        this.getListNomenClature(this.nomenClature1.value.value,1);
        break;
       case 2: 
        this.getListNomenClature(this.nomenClature2.value.value,2);
        break;
       case 3: 
        this.getListNomenClature(this.nomenClature3.value.value,3);
        break;
       case 4: 
        this.getListNomenClature(this.nomenClature4.value.value,4);
        break;
        default:
       break;
    }
  }

  getListNomenClature(valueParent: string, level: number): void {
    this.nomenclatureHttpService.findByNomenclatureParentValue(valueParent).subscribe(data => {
        if(level === 1) {
          this.nomenClatures2List = data;
          this.nomenClature2.setValue('--');
          this.nomenClature3.setValue('--');
          this.nomenClature4.setValue('--');
          this.nomenClature5.setValue('--');
          this.nomenClatures3List = [];
          this.nomenClatures4List = [];
          this.nomenClatures5List = [];
          if(isNullOrUndefined(valueParent) || valueParent === '--') {
            this.isService = true;
            this.isHardware = true;
          }
        } else if(level === 2) {
          this.nomenClatures3List = data;
          this.nomenClatures4List = [];
          this.nomenClatures5List = [];
          this.nomenClature3.setValue('--');
          this.nomenClature4.setValue('--');
          this.nomenClature5.setValue('--');
        } else if(level === 3) {
          this.nomenClatures4List = data;
          this.nomenClatures5List = [];
          this.nomenClature4.setValue('--');
          this.nomenClature5.setValue('--');
        } else if(level === 4) {
          this.nomenClatures5List = data;
        }
    });
}

  initNomenClature(masterProductVo: MasterProductVo): void {
    if(!isNullOrUndefined(masterProductVo) && !isNullOrUndefined(masterProductVo.nomenclature)) {
       this.selectDefaultAndGetListNomenClature(masterProductVo.nomenclature);
    }
  }

  selectDefaultAndGetListNomenClature(nomenClature: NomenclatureVO): void {
    switch (nomenClature.level) {
         case 5:
         this.initNomenClature5(nomenClature);
         break;
         case 4:
          this.initNomenClature4(nomenClature);
         break;
         case 3:
          this.initNomenClature3(nomenClature);
         break;
         case 2:
          this.initNomenClature2(nomenClature);
         break;
         default:
          break;
       }
  }

  initCategoriesTps(masterProductvo: MasterProductVo): void {
    this.referenceDataService.getReferencesData(TypeData.CATEGORIE_TPS).subscribe(data => {
      this.categriesTps = data;
      if(!isNullOrUndefined(masterProductvo)) {
        this.categrieTps.setValue(this.masterProductService.getReferenceData(masterProductvo.tpsCategoryId,this.categriesTps))
      }
    })
  }

  initNomenClature2(nomenClature: NomenclatureVO): void {
    this.nomenclatureHttpService.findByNomenclatureParentId(nomenClature.parent.id).subscribe(data => {
      this.nomenClatures2List = data;
      for(let nomen of this.nomenClatures2List) {
        if(nomen.id === nomenClature.id) {
          this.nomenClature2.setValue(nomen);
        }
      }
      if(!isNullOrUndefined(nomenClature)) {
        for(let nomen of this.nomenClatures1List) {
          if(nomen.value === nomenClature.parent.value) {
            this.nomenClature1.setValue(nomen);
            if(nomen.value === 'A') {
              this.isService = true;
              this.isHardware = false;
            } else if(nomen.value === 'B') {
              this.isService = false;
              this.isHardware = true;
            }
          }
        }
      }
    });
  }

  initNomenClature3(nomenClature: NomenclatureVO): void {
    this.nomenclatureHttpService.findByNomenclatureParentId(nomenClature.parent.id).subscribe(data => {
      this.nomenClatures3List = data;
      let nomen = nomenClature.parent;
      for(let nomen of this.nomenClatures3List) {
        if(nomen.id === nomenClature.id) {
          this.nomenClature3.setValue(nomen);
        }
      }
      this.initNomenClature2(nomen);
    });
  }

  initNomenClature4(nomenClature: NomenclatureVO): void {
    this.nomenclatureHttpService.findByNomenclatureParentId(nomenClature.parent.id).subscribe(data => {
      this.nomenClatures4List = data;
      let nomen = nomenClature.parent;
      for(let nomen of this.nomenClatures4List) {
        if(nomen.id === nomenClature.id) {
          this.nomenClature4.setValue(nomen);
        }
      }
      this.initNomenClature3(nomen);
    });
  }

  initNomenClature5(nomenClature: NomenclatureVO): void {
    this.nomenclatureHttpService.findByNomenclatureParentId(nomenClature.parent.id).subscribe(data => {
      this.nomenClatures5List = data;
      let nomen = nomenClature.parent;
      for(let nomen of this.nomenClatures5List) {
        if(nomen.id === nomenClature.id) {
          this.nomenClature5.setValue(nomen);
        }
      }
      this.initNomenClature4(nomen);
    });
  }


  initConstructeur(masterProductvo: MasterProductVo): void {
    this.manufacturerService.getAllManufacturers().subscribe(data => {
      this.listManufacturers = data;
      if(!isNullOrUndefined(masterProductvo)) {
        this.form.get('constructeur').setValue(this.masterProductService.getManuFacture(masterProductvo.manufacturerId, this.listManufacturers))
      }
    })
  }

  initPartner(masterProductvo: MasterProductVo): void {
    this.partnerService.getListPartnerOrderByName().subscribe(data => {
      this.listPartners = data;
      if(!isNullOrUndefined(masterProductvo)) {
        this.form.get('partenaire').setValue(this.masterProductService.getPartner(masterProductvo.partnerId, this.listPartners));
      }
    })
  }
  initPrefixe(masterProductvo: MasterProductVo): void {
    this.referenceDataService.getReferencesData(TypeData.PREFIX_NUM_SERIE).subscribe(data => {
      this.listPrefixe = data;
      if(!isNullOrUndefined(masterProductvo) && !isNullOrUndefined(masterProductvo.serialNumberPrefix)) {
        this.form.get('prefixe').setValue(this.masterProductService.getReferenceData(masterProductvo.serialNumberPrefix.id,this.listPrefixe))
      }
    })
  }

  initUniteOeuvre(masterProductvo: MasterProductVo): void {
    this.referenceDataService.getReferencesData(TypeData.UNITE_OEUVRE).subscribe(data => {
      this.listUnitesOeuvre = data;
      if(!isNullOrUndefined(masterProductvo) && !isNullOrUndefined(masterProductvo.serialNumberPrefix)) {
        this.form.get('uniteOeuvre').setValue(this.masterProductService.getReferenceData(masterProductvo.unitOfWorkId,this.listUnitesOeuvre))
      }
    })
  }

  initFrequenceFacturation(masterProductVo: MasterProductVo): void {
    this.listFrequenceFacturation =this.masterProductService.initFrequenceFacturation();
    if(!isNullOrUndefined(masterProductVo)) {
      this.form.get('frequenceFacturation').setValue(this.masterProductService.getFrequenceFacturation(masterProductVo.subscriptionPeriodicity, this.listFrequenceFacturation));
    } 
  }

  onSelectFrequence(): void {
    const frequence = this.form.get('frequenceFacturation').value;
    if(!isNullOrUndefined(frequence) && frequence === SubscriptionPeriodicity.MONTHLY) {
      this.limitee.enable();
    } else {
      this.initLimitee(null);
    }
  }

  checkIsLimit(): void {
    if(!isNullOrUndefined(this.limitee) && this.limitee.value === true) {
      this.occurrence.enable();
    } else {
      this.initOccurence();
    }
  }

  onSelectFileDoc(event: any): void {
    this.filesDoc = [];
    this.filesDoc.push(...event.addedFiles);
    this.isChangeDescription = true;
    this.isDeleteDescription = false;
  }

  onRemoveFileDoc(event: any): void {
    this.filesDoc.splice(this.filesDoc.indexOf(event), 1);
    this.isChangeDescription = true;
    this.isDeleteDescription = true;
  }

  onSelectFileVis(event: any): void {
    this.filesVis = [];
    this.filesVis.push(...event.addedFiles);
    this.isChangeImage = true;
    this.isDeleteImage = false;
  }

  onRemoveFileVis(event: any): void {
    this.filesVis.splice(this.filesVis.indexOf(event), 1);
    this.isChangeImage = true;
    this.isDeleteImage = true;
  }

  getIndexForMarge(value: string): number {
    return this.masterProductService.getIndexByEnum(value);
  }

  onblurEvent(event, inputName: string): void {
    if(event.target.value !== '') {
      this.setPrixUnitaire(inputName, parseFloat(event.target.value).toFixed(2));
    }
  }

  setPrixUnitaire(inputName: string, value: string): void {
    this.prixUnitaire.tva = this.form.get('unitaireTva').value;
    if(inputName === 'unitaireht') {
      this.form.get('unitaireht').setValue(parseFloat(value).toFixed(2));
      this.prixUnitaire.prixHt = value;
      this.prixUnitaire.prixTaxe = this.form.get('unitairetaxe').value;
    } else if(inputName === 'unitairetaxe') {
      this.form.get('unitairetaxe').setValue(parseFloat(value).toFixed(2));
      this.prixUnitaire.prixHt = this.form.get('unitaireht').value;
      this.prixUnitaire.prixTaxe = value;
    }
    this.setTTC();
    this.masterProductService.prixUnitaire$.next(this.prixUnitaire);
  }
  onChangeTva(): void {
    this.prixUnitaire.tva = this.form.get('unitaireTva').value;
    this.setTTC();
    this.masterProductService.prixUnitaire$.next(this.prixUnitaire);
  }

  setTTC(): void {
    const unitaireHt = this.form.get('unitaireht').value;
    let valueTTC = this.masterProductService.calculePrixUnitaireTTC(Number(unitaireHt), Number(this.prixUnitaire.tva));
    this.form.get('unitairettc').setValue(valueTTC.toFixed(2));
  }

  saveMasterProduct(masterProduct: MasterProduct): void {
    this.loading = true;
    this.catalogService.saveMasterProduct(masterProduct).subscribe(data => {
      this.redirectToListCatalog();
    },
    (error) =>  {
      if(error.message.includes(ERROR_ORANGE_PRODUCT_REFERENCE.ERROR)) {
        this.openPopupError(ERROR_ORANGE_PRODUCT_REFERENCE.MESSAGE);
       }
        this.newProductsVO = [];
        this.loading = false;
    },
    () => {
     this.loading = false;
    });
  }

  onChangeForm(formInfo :any) {
    this.errorsAdminProduct = [];
    const { values , dirty, errors } = formInfo;
    this.onChangeMasterProduct(this.masterProductVO);
    if(!isNullOrUndefined(values)) {
      this.newProductsVO = values;
    }

    for(let error of errors) {
      this.errorsAdminProduct.push(error);
    }
    this.isDirtyForm = dirty;
    this.canceled = dirty;
  }

  onChangeFormMasterProduct() {
    if (!isNullOrUndefined(this.form)) {
      this.form.valueChanges.subscribe(() => {
        this.isDirtyForm = this.form.dirty;
        this.canceled = this.form.dirty;
      });
    }
  }

  setProductVOWithNewProduct(values: AdminProductVO[]): void {
    this.masterProduct.masterProductVO.productsVO = [];
   for(let value of values) {
      this.masterProduct.masterProductVO.productsVO.push(value);
     }
  }

  redirectToListCatalog(): void {
    this.router.navigate(
      ['/customer-dashboard',getEncryptedValue(0),'cart','catalog-administration']
    )
  }

  annuler(): void {
    this.canceled = this.isDirtyForm;
    this.submitted = false;
    this.redirectToListCatalog();
  }

  hasError(input: string): boolean {
    const control = this.form.get(input);
    return ((control.touched || this.isSubmit) && (control.value === null ||
            control.value === undefined || control.value === '' || control.value === '--'));
  }

  isPrefixeError(input: string): boolean {
    const control = this.form.get(input);
    const isPrefixe = (input === 'prefixe' && this.isNoPrefixe);
    return ((control.touched || this.isSubmit) && isPrefixe && (control.value === null ||
            control.value === undefined || control.value === '' || control.value === '--'));
  }

  setErrors(): string[] {
    let errors = [];
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.LIBELLE_CLIENT.name)) {
      errors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.LIBELLE_CLIENT.value));
    } 
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.LIBELLE_INTERNE.name)) {
      errors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.LIBELLE_INTERNE.value));
    }
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE1.name)) {
      errors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE1.value));
    }
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE2.name)) {
      errors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE2.value));
    }
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE3.name)) {
      errors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE3.value));
    }
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE4.name)) {
      errors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE4.value));
    }
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE5.name)) {
      errors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE5.value));
    }
    if(this.isPrefixeError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.PREFIXE.name)) {
      errors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.PREFIXE.value));
    }
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.PARTENAIRE.name)) {
      errors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.PARTENAIRE.value));
    }
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.MARGE.name)) {
      errors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.MARGE.value));
    }
    if(this.hasErrorForInputsMarge()) {
      errors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.MARGE_PRICE.value));
    }
    for(let error of this.errorsAdminProduct) {
      errors.push(error);
    }
    return errors;
  }

  hasErrorForInputsMarge(): boolean {
    return ((this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.MARGE_PRICE.name) && this.form.get('checkMarge').value === ACQUISITION.ACQUISITION_PRICE) ||
    (this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.MARGE_TAUX.name) && this.form.get('checkMarge').value === ACQUISITION.MARGIN_RATE) ||
    (this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.MARGE_VALEUR.name) && this.form.get('checkMarge').value === ACQUISITION.MARGIN_VALUE) || this.form.get('checkMarge').value === '') 
  }

  openPopupError(message: string): any {
    const title = 'Erreur';
    const btnOk = 'OK';
    this.confirmationDialogService.confirm(title, message, btnOk,null,'lg', false)
    .then((confirmed) => {
      this.activeModal.close(true)
    })
    .catch(() => console.log('User dismissed )'));
  }

  initProductsLife(masterProductVO: MasterProductVo): void {
      this.referenceDataService.getReferencesData(TypeData.PRODUCT_LIFE).subscribe(data => {
        this.productsLife = data;
        this.productsLife.unshift(this.masterProductService.defaultHyphenInLifeProduct());
        if(!isNullOrUndefined(masterProductVO) && !isNullOrUndefined(masterProductVO.productLife) && !isNullOrUndefined(masterProductVO.productLife.id)) {
          this.productLife.setValue(this.masterProductService.getReferenceData(masterProductVO.productLife.id,this.productsLife))
        } else {
          this.productLife.setValue(this.masterProductService.getReferenceData(0,this.productsLife));
        }
      })
    }
  onchangeDevise(): void {
    this.prixUnitaire.isDevis = this.form.get("devis").value
    this.prixUnitaire.prixHt = this.form.get("unitaireht").value;
    this.prixUnitaire.prixTaxe = this.form.get("unitairetaxe").value;
    this.prixUnitaire.prixTTC = this.form.get("unitairettc").value;
    this.prixUnitaire.tva = this.form.get("unitaireTva").value;
    this.masterProductService.prixUnitaire$.next(this.prixUnitaire);
  }

  floatToIntTva(value: string): number {
    return this.masterProductService.floatToIntTva(value);
  }

}
