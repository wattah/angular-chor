import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Frequence, MasterProductService } from '../master-product.service';
import { ACQUISITION, ERROR_MESSAGE_NOT_EXIST_PRODUCT, ERROR_ORANGE_PRODUCT_REFERENCE,
  LABEL_SUBSCRIPTION_PERIODICITY, LIST_INPUTS_MASTER_PRODUCT_REQUIRED, TVA, TypeData } from '../master-product.constants';
import { NomenclatureVO } from '../../../_core/models/nomenclature-vo';
import { ReferenceDataService } from '../../../_core/services';
import { MasterProductVo, ReferenceDataVO } from '../../../_core/models';
import { ManufacturerService } from '../../../_core/services/manufacturer.service';
import { PartnerService } from '../../../_core/services/partner.service';
import { ManufacturerVO } from '../../../_core/models/manufacturer-vo';
import { PartnerVo } from '../../../_core/models/partner-vo';
import { NomenclatureService } from '../../../_core/services/nomenclature.service';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { SubscriptionPeriodicity } from '../../../_core/enum/subscription-periodicity';
import { AdminProductVO } from '../../../_core/models/admin-product-vo';
import { getEncryptedValue } from '../../../_core/utils/functions-utils';
import { FamilyVO } from '../../../_core/models/family-vo';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { CatalogeService } from '../../../_core/services/http-catalog.service';
import { MasterProduct } from '../../../_core/models/masterProduct/master-product';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { PrixUnitaire } from '../prix-unitaire';


@Component({
  selector: 'app-master-product.',
  templateUrl: './master-product-creation.component.html',
  styleUrls: ['./master-product-creation.component.scss']
})
export class MasterProductCreationComponent extends ComponentCanDeactivate implements OnInit {

  form: FormGroup;
  masterProduct: MasterProduct = {} as MasterProduct;
  newProductsVO: AdminProductVO[] = [];
  nomenClatures: NomenclatureVO[] = [];
  nomenClature1 = new FormControl();
  nomenClatures2: NomenclatureVO[] = [];
  nomenClature2 = new FormControl();
  nomenClatures3: NomenclatureVO[] = [];
  nomenClature3 = new FormControl();
  nomenClatures4: NomenclatureVO[] = [];
  nomenClature4 = new FormControl();
  nomenClatures5: NomenclatureVO[] = [];
  nomenClature5 = new FormControl();
  categriesTps:ReferenceDataVO[] = [];
  categrieTps = new FormControl();
  limitee = new FormControl();
  occurrence = new FormControl();
  filesDoc: File[] = [];
  filesVis: File[] = [];
  fileInvalidDoc = false;
  fileInvalidVis = false;
  manufacturers: ManufacturerVO[] = [];
  partners: PartnerVo[] = [];
  prefixes: ReferenceDataVO[] = [];
  unitesOeuvres: ReferenceDataVO[] = [];
  frequencesFacturations: {cle: string, valeur: string}[] = [];
  isHardware = false;
  isService = false;
  isNoPrefixe = false;
  productsVO: AdminProductVO[] = [];
  isSubmit = false;
  @Input()
  categories: FamilyVO[] = [];
  listErrors: string[] = [];
  submitted;
  ListErrorsAdminProduct: string[] = [];
  productLife = new FormControl;
  productsLife: ReferenceDataVO[] = [];
  /**
   * les flags pour la gestion des documents (image, description)
   */
   isChangeDescription = false;
   isDeleteDescription = false;
   isChangeImage = false;
   isDeleteImage = false;
   defaultFrequence: Frequence = {} as Frequence;
   zero = 0;
   listTva: {key: string, value: string}[] = [];
   prixUnitaire: PrixUnitaire = {} as PrixUnitaire;
   loading = false;
  constructor(private readonly _formBuilder: FormBuilder,
    private readonly manufacturerService: ManufacturerService,
    private readonly partnerService: PartnerService,
    private readonly masterProductService:MasterProductService,
    private readonly referenceDataService: ReferenceDataService,
    private readonly nomenclatureService: NomenclatureService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly catalogService: CatalogeService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly activeModal: NgbActiveModal) {
      super();
     }

  ngOnInit() {
    this.getDefaultFrequence();
    this.form = this.createFormGroup();
    this.route.data.subscribe(resolversData => {
      this.categories = resolversData['categories'];
     });
    this.nomenClatures = this.masterProductService.getdefaultListNomenClature1();
    this.listTva = this.masterProductService.getListTva();
    this.initCategoriesTps();
    this.initConstructeur();
    this.initPartner();
    this.initPrefixe();
    this.initUniteOeuvre()
    this.initFrequenceFacturation();
    this.gestionLimit();
    this.initProductsLife();
    this.isHardware = true;
    this.isService = true;
    this.canceled = false;
    this.onChangeForm();
    this.masterProductService.prixUnitaire$.subscribe((data)=>{
      this.form.get('devis').setValue(data.isDevis);
    });
    this.initPrixUnitaire();
  }

  getDefaultFrequence(): void {
   this.defaultFrequence.cle = SubscriptionPeriodicity.ACTE;
   this.defaultFrequence.valeur = LABEL_SUBSCRIPTION_PERIODICITY.ACTE;
  }

  createFormGroup(): FormGroup {
    return this._formBuilder.group({
      libelleClient: this._formBuilder.control(''),
      libelleInterne: this._formBuilder.control(''),
      referenceOrange: this._formBuilder.control(null),
      ean: this._formBuilder.control(''),
      referenceConstructeur: this._formBuilder.control(''),
      partenaire: this._formBuilder.control(null),
      constructeur: this._formBuilder.control(null),
      categrieTps: this.categrieTps,
      wingsm: this._formBuilder.control(false),
      publidispatch: this._formBuilder.control(false),
      occurrence: this.occurrence,
      checkPrix: this._formBuilder.control(false),
      dureeGarantie: 0,
      serie: this._formBuilder.control(false),
      prestationMesure: this._formBuilder.control(false),
      dureeInterevention: 0,
      deplacement: this._formBuilder.control(false),
      uniteOeuvre: this._formBuilder.control(null),
      frequenceFacturation: this._formBuilder.control(this.defaultFrequence.cle),
      limitee: this.limitee,
      checkMarge: this._formBuilder.control(false),
      nomenClature1: this.nomenClature1,
      nomenClature2: this.nomenClature2,
      nomenClature3: this.nomenClature3,
      prefixe: this._formBuilder.control(''),
      commentaire: this._formBuilder.control(false),
      nomenClature4: this.nomenClature4,
      nomenClature5: this.nomenClature5,
      margeT: this._formBuilder.control(null),
      margeV: this._formBuilder.control(null),
      familleT: this._formBuilder.control(''),
      prixAcq: this._formBuilder.control(null),
      unitairetaxe: this.zero.toFixed(2),
      unitairettc: this.zero.toFixed(2),
      productLife: this.productLife,
      devis: this._formBuilder.control(null),
      unitaireTva: TVA.TVA_NORMALE.value,
      unitaireht: this.zero.toFixed(2)
    });
  }

  onchangeCheckPrefixe() {
    this.isNoPrefixe = this.form.get('serie').value;

  }

  initCategoriesTps(): void {
    this.referenceDataService.getReferencesData(TypeData.CATEGORIE_TPS).subscribe(data => {
      this.categriesTps = data;
    });
  }

  initConstructeur(): void {
    this.manufacturerService.getAllManufacturers().subscribe(data => {
      this.manufacturers = data;
    })
  }

  initPartner(): void {
    this.partnerService.getListPartnerOrderByName().subscribe(data => {
      this.partners = data;
    })
  }
  initPrefixe(): void {
    this.referenceDataService.getReferencesData(TypeData.PREFIX_NUM_SERIE).subscribe(data => {
      this.prefixes = data;
    })
  }

  initUniteOeuvre(): void {
    this.referenceDataService.getReferencesData(TypeData.UNITE_OEUVRE).subscribe(data => {
      this.unitesOeuvres = data;
    })
  }

  initFrequenceFacturation(): void {
    this.frequencesFacturations =this.masterProductService.initFrequenceFacturation();
    
  }
  initProductsLife(): void {
    this.referenceDataService.getReferencesData(TypeData.PRODUCT_LIFE).subscribe(data => {
      this.productsLife = data;
      this.productsLife.unshift(this.masterProductService.defaultHyphenInLifeProduct());
      this.productLife.setValue(this.masterProductService.getReferenceData(0,this.productsLife));
    });
  }
  initPrixUnitaire(): void {
    this.prixUnitaire.prixTTC = this.zero.toFixed(2);
    this.prixUnitaire.isDevis = false;
    this.prixUnitaire.prixTaxe = this.zero.toFixed(2);
    this.prixUnitaire.prixHt = this.zero.toFixed(2);
    this.prixUnitaire.tva = TVA.TVA_NORMALE.value; 
    this.masterProductService.prixUnitaire$.next(this.prixUnitaire);
  }
  onSelectFileDoc(event: any): void {
    this.filesDoc = [];
    this.filesDoc.push(...event.addedFiles);
    this.fileInvalidDoc = false;
    this.isChangeDescription = true;
  }

  onRemoveFileDoc(event: any): void {
    this.filesDoc.splice(this.filesDoc.indexOf(event), 1);
    this.fileInvalidDoc = true;
    this.isChangeDescription = false;
  }

  onSelectFileVis(event: any): void {
    this.filesVis = [];
    this.filesVis.push(...event.addedFiles);
    this.fileInvalidVis = false;
    this.isChangeImage = true;
  }

  onSelectNomenClatureWithLevel(level: number): void {
    this.isHardware = !isNullOrUndefined(this.nomenClature1.value) && this.nomenClature1.value.value === 'B';
    this.isService = !isNullOrUndefined(this.nomenClature1.value) && this.nomenClature1.value.value === 'A';
    switch (level) {
      case 1:
        this.getListNomenClatureWithParent(this.nomenClature1.value.value,1);
        break;
       case 2: 
        this.getListNomenClatureWithParent(this.nomenClature2.value.value,2);
        break;
       case 3: 
        this.getListNomenClatureWithParent(this.nomenClature3.value.value,3);
        break;
       case 4: 
        this.getListNomenClatureWithParent(this.nomenClature4.value.value,4);
        break;
        default:
       break;
    }
  }

  getListNomenClatureWithParent(parent: string, level: number): void {
    this.nomenclatureService.findByNomenclatureParentValue(parent).subscribe(data => {
        if(level === 1) {
          this.nomenClatures2 = data;
          this.nomenClatures3 = [];
          this.nomenClatures4 = [];
          this.nomenClatures5 = [];
          if(isNullOrUndefined(parent) || parent === '--') {
            this.isService = true;
            this.isHardware = true;
          }
        } else if(level === 2) {
          this.nomenClatures3 = data;
          this.nomenClatures4 = [];
          this.nomenClatures5 = [];
        } else if(level === 3) {
          this.nomenClatures4 = data;
          this.nomenClatures5 = [];
        } else if(level === 4) {
          this.nomenClatures5 = data;
        }
    });
}

  save() {
    this.isSubmit = true;
    this.submitted = true;
    this.listErrors = this.setListErrors();
    if(isNullOrUndefined(this.listErrors) || this.listErrors.length === 0) {
      const masterProductToSave  = this.setMasterProductToSave();
      if(isNullOrUndefined(masterProductToSave.masterProductVO.productsVO) ||
        masterProductToSave.masterProductVO.productsVO.length === 0) {
          this.openPopupError(ERROR_MESSAGE_NOT_EXIST_PRODUCT.MESSAGE);
      } else {
        this.loading = true;
        this.catalogService.saveMasterProduct(masterProductToSave).subscribe(data => {
        this.redirectToListCatalog();
      },
      (error) =>  {
        if(error.error.message.includes(ERROR_ORANGE_PRODUCT_REFERENCE.ERROR)) {
          this.openPopupError(ERROR_ORANGE_PRODUCT_REFERENCE.MESSAGE);
         }
          this.newProductsVO = [];
          this.loading = false;
      }, () => {
        this.loading = false;
      });
      this.submitted = true
      this.canceled = false;
      }
    } else {
      window.scroll(0,0);
    }
  }

  setProductVOWithNewProduct(values: AdminProductVO[]): void {
    this.masterProduct.masterProductVO.productsVO = [];
   for(let value of values) {
      this.masterProduct.masterProductVO.productsVO.push(value);
     }
  }

  setMasterProductToSave(): MasterProduct {
    this.masterProduct.masterProductVO = {} as MasterProductVo;
    this.setProductVOWithNewProduct(this.newProductsVO);
    this.masterProduct.masterProductVO.name = this.form.get("libelleInterne").value;
    this.masterProduct.masterProductVO.annualReport = this.form.get("libelleClient").value;
    this.masterProduct.masterProductVO.acquisitionPriceReal = this.form.get("prixAcq").value;
    this.masterProduct.masterProductVO.marginRateReal = this.form.get("margeT").value;
    this.masterProduct.masterProductVO.marginValueReal = this.form.get("margeV").value;
    this.masterProduct.masterProductVO.nomenclature = this.form.get("nomenClature5").value;
    this.masterProduct.masterProductVO.serialRequired = this.form.get("serie").value;
    this.masterProduct.masterProductVO.commentMandatory = this.form.get("commentaire").value;
    this.masterProduct.masterProductVO.tpsCategoryId = !isNullOrUndefined(this.form.get("categrieTps").value)  ? this.form.get("categrieTps").value.id : null;
    this.masterProduct.masterProductVO.serialNumberPrefix = this.form.get("prefixe").value !== '' && this.form.get("prefixe").value !== '--' ? this.form.get("prefixe").value : null;
    if(this.isService) {
      this.masterProduct.masterProductVO.articleClassId = 3172;
      this.masterProduct.masterProductVO.customizedBenefit = this.form.get("prestationMesure").value;
      this.masterProduct.masterProductVO.interventionDuration = this.form.get("dureeInterevention").value;
      this.masterProduct.masterProductVO.travelIncluded = this.form.get("deplacement").value;
      this.masterProduct.masterProductVO.unitOfWorkId = !isNullOrUndefined(this.form.get("uniteOeuvre").value) ? this.form.get("uniteOeuvre").value.id : null;
      this.masterProduct.masterProductVO.subscriptionPeriodicity = this.form.get("frequenceFacturation").value;
      if(this.masterProduct.masterProductVO.subscriptionPeriodicity === SubscriptionPeriodicity.MONTHLY) {
        this.masterProduct.masterProductVO.isRecurrenceLimitee = this.form.get("limitee").value;
        this.masterProduct.masterProductVO.nbOccurrences = this.form.get("occurrence").value;
      }
      this.masterProduct.masterProductVO.isOnStock = false;
      this.masterProduct.masterProductVO.isOnPublidispatchStock = false;
    }
    if(this.isHardware) {
      this.masterProduct.masterProductVO.eanCode = this.form.get("ean").value;
      this.masterProduct.masterProductVO.orangeProductReference = this.form.get("referenceOrange").value !== '' ? this.form.get("referenceOrange").value : null;
      this.masterProduct.masterProductVO.partnerProductReference = this.form.get("referenceConstructeur").value;
      this.masterProduct.masterProductVO.manufacturerId = !isNullOrUndefined(this.form.get("constructeur").value) && this.form.get("constructeur").value !== '--' ?  this.form.get("constructeur").value.id : null;
      this.masterProduct.masterProductVO.isOnStock = !isNullOrUndefined(this.form.get("wingsm").value) ? this.form.get("wingsm").value : false;
      this.masterProduct.masterProductVO.isOnPublidispatchStock = !isNullOrUndefined(this.form.get("publidispatch").value) ? this.form.get("publidispatch").value : false;
      this.masterProduct.masterProductVO.warrantyValue = this.form.get("dureeGarantie").value;
      this.masterProduct.masterProductVO.articleClassId = 3171;
      this.masterProduct.masterProductVO.subscriptionPeriodicity = SubscriptionPeriodicity.ACTE;
      this.masterProduct.masterProductVO.billingCategory = 'SERVICE';
    }

    this.masterProduct.masterProductVO.pricingTypeReal = this.form.get("checkMarge").value;
    this.masterProduct.masterProductVO.pricingType = this.form.get("checkMarge").value;
    this.masterProduct.masterProductVO.shortDescription = null;
    this.masterProduct.masterProductVO.longDescription = null;
    this.masterProduct.masterProductVO.partnerId = this.form.get("partenaire").value.id;
    this.masterProduct.masterProductVO.quantityBlocked = this.masterProduct.masterProductVO.serialRequired;
    if(this.masterProduct.masterProductVO.subscriptionPeriodicity === SubscriptionPeriodicity.YEARLY ||
      this.masterProduct.masterProductVO.subscriptionPeriodicity === SubscriptionPeriodicity.MONTHLY ) {
      this.masterProduct.masterProductVO.billingCategory = 'SUBSCRIPTION';
    } else if(this.masterProduct.masterProductVO.subscriptionPeriodicity === SubscriptionPeriodicity.ACTE) {
      this.masterProduct.masterProductVO.billingCategory = 'SERVICE';
    }
    this.masterProduct.masterProductVO.proratedAtBegin = false;
    this.masterProduct.masterProductVO.proratedAtEnd = false;
    this.masterProduct.masterProductVO.recurrent = false;
    if(this.isChangeDescription) {
      this.masterProduct.description = this.filesDoc[0];
    }
    if(this.isChangeImage) {
      this.masterProduct.image = this.filesVis[0];
    }
    this.masterProduct.masterProductVO.id = 0;
    this.masterProduct.masterProductVO.productLife = this.getProductLifeToSave();
    return this.masterProduct;
  }

  getProductLifeToSave(): ReferenceDataVO {
    return this.form.get("productLife").value.id === 0 ? null : this.form.get("productLife").value;
  }

  onRemoveFileVis(event: any): void {
    this.filesVis.splice(this.filesVis.indexOf(event), 1);
    this.fileInvalidVis = true;
    this.isChangeImage = false;
  }

  onSelectFrequenceFacturation(): void {
    const frequence = this.form.get('frequenceFacturation').value;
    if(!isNullOrUndefined(frequence) && frequence === SubscriptionPeriodicity.MONTHLY) {
      this.limitee.enable();
    } else {
      this.gestionLimit();
    }
  }

  gestionLimit(): void {
    this.limitee.disable();
    this.limitee.setValue(false);
    this.gestionOccurence();
  }
  gestionOccurence(): void {
    this.occurrence.disable();
    this.occurrence.setValue(0);
  }
  checkLimit() {
    if(!isNullOrUndefined(this.limitee) && this.limitee.value === true) {
      this.occurrence.enable();
    } else {
      this.gestionOccurence();
    }
  }

  onblurEvent(event, inputName: string): void {
    if(event.target.value !== '') {
      this.form.get(inputName).setValue(parseFloat(event.target.value).toFixed(2));
      this.setPrixUnitaire(inputName, parseFloat(event.target.value).toFixed(2));
    }
  }
  setPrixUnitaire(name: string, value: string): void {
    this.prixUnitaire.tva = this.form.get('unitaireTva').value;
    if(name === 'unitaireht') {
      this.prixUnitaire.prixHt = value
      this.prixUnitaire.prixTaxe = this.form.get('unitairetaxe').value;
    } else if (name === 'unitairetaxe') {
      this.prixUnitaire.prixTaxe = value;
      this.prixUnitaire.prixHt = this.form.get('unitaireht').value;
    }
    this.setPrixUnitaireTTC();
    this.masterProductService.prixUnitaire$.next(this.prixUnitaire);
  }
  setPrixUnitaireTTC(): void {
    const ht = this.form.get('unitaireht').value;
    let ttc = this.masterProductService.calculePrixUnitaireTTC(Number(ht), Number(this.prixUnitaire.tva));
    this.form.get('unitairettc').setValue(ttc.toFixed(2));
  }

  hasError(input: string): boolean {
    const control = this.form.get(input);
    return ((control.touched || this.isSubmit) && (control.value === null ||
         control.value === undefined || control.value === '' ||
          control.value === '--'));
  }

  redirectToListCatalog(): void {
    this.router.navigate(
      ['/customer-dashboard',getEncryptedValue(0),'cart','catalog-administration']
    )
  }

  annuler(): void {
    this.canceled = true;
    this.submitted = false;
    this.redirectToListCatalog();
  }

  setListErrors(): string[] {
    this.listErrors = [];
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.LIBELLE_CLIENT.name)) {
      this.listErrors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.LIBELLE_CLIENT.value));
    } 
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.LIBELLE_INTERNE.name)) {
      this.listErrors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.LIBELLE_INTERNE.value));
    }
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE1.name)) {
      this.listErrors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE1.value));
    }
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE2.name)) {
      this.listErrors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE2.value));
    }
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE3.name)) {
      this.listErrors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE3.value));
    }
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE4.name)) {
      this.listErrors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE4.value));
    }
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE5.name)) {
      this.listErrors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.NOMENCLATURE5.value));
    }
    if(this.isPrefixeError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.PREFIXE.name)) {
      this.listErrors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.PREFIXE.value));
    }
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.MARGE.name)) {
      this.listErrors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.MARGE.value));
    }
    if(this.hasError(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.PARTENAIRE.name)) {
      this.listErrors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.PARTENAIRE.value));
    }
    if(this.hasErrorForInputsMarge()) {
      this.listErrors.push(this.masterProductService.setErrorText(LIST_INPUTS_MASTER_PRODUCT_REQUIRED.MARGE_PRICE.value));
    }
    for(let error of this.ListErrorsAdminProduct) {
      this.listErrors.push(error);
    }
    return this.listErrors;
  }

  hasErrorForInputsMarge(): boolean {
    return  (this.hasErrorMarge("prixAcq") ||
             this.hasErrorMarge("margeV") ||
             this.hasErrorMarge("margeT"));
  }

  hasErrorMarge(input: string): boolean {
    const control = this.form.get(input);
    return (control.touched || this.isSubmit) && (this.form.get('checkMarge').value === false ||   
    (this.hasError(input) && this.form.get('checkMarge').value === this.getMargeChange(input)));
  }

  isPrefixeError(input: string): boolean {
    const control = this.form.get(input);
    const isPrefixe = (input === 'prefixe' && this.isNoPrefixe);
    return ((control.touched || this.isSubmit) && isPrefixe && (control.value === null ||
            control.value === undefined || control.value === '' || control.value === '--'));
  }

  getMargeChange(input: string) : string {
    let value = '';
    switch (input) {
      case 'prixAcq': value = ACQUISITION.ACQUISITION_PRICE; break;
      case 'margeV': value = ACQUISITION.MARGIN_VALUE; break;
      case 'margeT': value =  ACQUISITION.MARGIN_RATE; break;
    }
    return value;
  }

  onChangeFormAdmin(formInfo :any) {
    const { values , dirty, errors } = formInfo;
    if(!isNullOrUndefined(values)) {
      this.newProductsVO = values;
    }
    this.ListErrorsAdminProduct = [];
    for(let error of errors) {
      this.ListErrorsAdminProduct.push(error);
    }
    this.canceled = dirty;
  }

  onChangeForm() {
    if (!isNullOrUndefined(this.form)) {
      this.form.valueChanges.subscribe(() => {
        this.canceled = this.form.dirty;
      });
    }
  }

  openPopupError(message: string): any {
      const title = 'Erreur';
      const btnOkText = 'OK';
      this.confirmationDialogService.confirm(title, message, btnOkText,null,'lg', false)
      .then((confirmed) => {
        this.activeModal.close(true)
      })
      .catch(() => console.log('User dismissed )'));
    }

    floatToIntTva(value: string): number {
      return this.masterProductService.floatToIntTva(value);
    }
    onchangeDevise(): void {
      this.prixUnitaire.prixTTC = this.form.get("unitairettc").value;
      this.prixUnitaire.prixHt = this.form.get("unitaireht").value;
      this.prixUnitaire.prixTaxe = this.form.get("unitairetaxe").value;
      this.prixUnitaire.tva = this.form.get("unitaireTva").value;
      this.prixUnitaire.isDevis = this.form.get("devis").value;
      this.masterProductService.prixUnitaire$.next(this.prixUnitaire);
    }

    onChangeTva(): void {
      this.prixUnitaire.tva = this.form.get('unitaireTva').value;
      this.setPrixUnitaireTTC();
      this.masterProductService.prixUnitaire$.next(this.prixUnitaire);
    }
}
