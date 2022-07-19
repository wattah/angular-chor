import { NotificationService } from './../../../_core/services/notification.service';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { CustomerService } from './../../../_core/services';
import { getCustomerIdFromURL } from '../../../main/customer-dashboard/customer-dashboard-utils';
import { Location } from '@angular/common';
import { CustomerParkItemVO } from './../../../_core/models/customer-park-item-vo';
import { CatalogeService } from './../../../_core/services/http-catalog.service';
import { AuthTokenService } from './../../../_core/services/auth_token';
import { BillCriteriaVO } from './../../../_core/models/BillCriteriaVO';
import { BillingService } from './../../../_core/services/billing.service';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { BeneficiaryVO } from './../../../_core/models/beneficiaryVO';
import { CONSTANTS } from './../../../_core/constants/constants';
import { HardwareParkItemService } from './../hardware-park-item.service';
import {
  startWith,
  map,
  tap,
  switchMap
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CustomersLight } from './../../../_core/models/customers_light';
import {
  CustomerFullVO,
  CustomerVO,
  PenicheBillAccountLightVO,
  CustomerHardwareParkItemVO,
  FacturationLineVO,
  ProductVO
} from './../../../_core/models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { ParcLigneService } from './../../../_core/services/parc-ligne.service';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CSS_CLASS_NAME } from '../../../_core/constants/constants';
import { getEncryptedValue, getDecryptedValue } from '../../../_core/utils/functions-utils';

@Component({
  selector: 'app-hardware-park-item-creation',
  templateUrl: './hardware-park-item-creation.component.html',
  styleUrls: ['./hardware-park-item-creation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HardwareParkItemCreationComponent extends ComponentCanDeactivate implements OnInit {
  /**********************************************************************************************
   *  NB: pour les methodes métiers qui peuvent etre partagé  (appel recurrent , filtre , ect)  *
   *  doivent etre developées dans un service (../hardware-park-item.service.ts)                                                  *
   *********************************************************************************************/
  maximumDiscount = 0;
  form: FormGroup = this._formBuilder.group({
    radio: this._formBuilder.control('oui'),
    category: this._formBuilder.control('', Validators.required),
    serviceOrMateriel: this._formBuilder.control('', Validators.required),
    contract: this._formBuilder.control('--'),
    beneficiarie: this._formBuilder.control('--'),
    buyingDate: this._formBuilder.control(new Date(), Validators.required),
    realizationDate: this._formBuilder.control(''),
    associetedLine: this._formBuilder.control(null),
    installationAddress: this._formBuilder.control(null),
    comment: this._formBuilder.control(''),
    serielNumber: this._formBuilder.control(''),
    wordingBill: this._formBuilder.control('', Validators.required),
    unitPricHT: this._formBuilder.control('', Validators.required),
    discount: this._formBuilder.control(''),
    quantity: this._formBuilder.control(1, Validators.required),
    tva: this._formBuilder.control(null),
    startBilling: this._formBuilder.control(new Date(), Validators.required),
    invoiceAlreadyPaid: this._formBuilder.control(''),
  });
  submitted = false;
  customerId;
  categories;
  isEntreprise = false;
  filteredCategory: Observable<Array<string>>;
  filteredContract: Observable<Array<string>>;
  filteredBeneficiarie: Observable<Array<string>>;
  filteredServiceOrMateriel: Observable<Array<ProductVO>>;
  categoriesAsString: Array<string>;
  products: Array<ProductVO>;
  isProduct = false;
  isOffreAndService = false;
  isElse = false;
  recurrentCategory = 'Non';
  accountBilling = null;
  inValidFormular = false;
  severalCustomerTit: CustomersLight[];
  parkItems: CustomerParkItemVO[];
  fullCustomer: CustomerFullVO;
  beneficiaries: Array<BeneficiaryVO> = [];
  billAccounts: PenicheBillAccountLightVO[];
  contract: CustomersLight;
  category;
  htPrice = '0.00';
  ttcPrice = '0.00';
  showFacturation = true;
  customerHardwareParkItemVO: CustomerHardwareParkItemVO;
  beneficiarie: BeneficiaryVO;
  product: ProductVO;
  serialRequired = false;
  quantityBlocked = false;
  columnDefs = [
    {
      headerName: 'Catégorie',
      headerTooltip: 'Catégorie',
      field: 'billAccountRecurrent',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      valueGetter: (params) =>
        this.getBillAccountRecurrentLabel(params.data.billAccountRecurrent),
      width: 220,
      checkboxSelection: true,
    },
    {
      headerName: 'N° de compte',
      headerTooltip: 'N° de compte',
      field: 'billAccountIdentifier',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 180,
      autoHeight: true,
    },
    {
      headerName: 'Mode de règlement',
      headerTooltip: 'Mode de règlement',
      field: 'billAccountPaymentMode',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      valueGetter: (params) =>
        this.getPaymentModeLabel(params.data.billAccountPaymentMode),
      autoHeight: true,
      width: 220,
    },
    {
      headerName: 'Payeur',
      headerTooltip: 'Payeur',
      field: 'payeur',
      valueGetter: (params) => this.getPayerName(params.data),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 240,
    },
    {
      headerName: 'Adresse',
      headerTooltip: 'Adresse',
      field: 'billAccountPayerAddress',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 260,
    },
  ];
  rowData;
  previousUrl: string;
  isBeneficiary: boolean;
  listProduct: Array<ProductVO>;
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly parcLigneService: ParcLigneService,
    private readonly route: ActivatedRoute,
    private readonly hardwareParkItemService: HardwareParkItemService,
    private readonly billingService: BillingService,
    private readonly authTokenService: AuthTokenService,
    private readonly catalogeService: CatalogeService,
    private readonly location: Location,
    private readonly customerService: CustomerService,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    this.isEntreprise = this.itIsAnEntreprise();
    this.isBeneficiary = this.itIsBeneficiary();
    this.retrieveData();
    this.doHideFieldsByCategoryName();
    this.doFilterCategory();
    this.doFilterBeneficiaries();
    this.getProductByCategoryAndContractStatus();
    this.itIsWithFacturation();
    this.observeCategory();
  }
  observeCategory() {
    this.form.get('category').valueChanges
      .pipe(
        tap((category)=> this.category = category),
        tap(()=> this.form.get('serviceOrMateriel').setValue('')),
        switchMap(() => {
          this.listProduct = [];
          this.products = [];
          const status = this.getStatus();
          const caterotyId = this.category ? this.category.id : 0;
          return this.catalogeService.getProductsByCriteria(caterotyId, 'ACTIVE', ' ', status, this.customerId);
        }),
        map(this.sortProduct())
      ).subscribe(
        (products)=>{
          this.listProduct = products;
          this.products = products;
        }
      );
  }
  private retrieveData() {
    this.route.data.subscribe((resolvedData) => {
      this.categories = resolvedData['categories'];
      this.categories.sort((c1 , c2)=>this.alphabeticSort(c1.name , c2.name));
      this.categoriesAsString = this.categories.map((category) => category.name);
      this.parkItems = resolvedData['parkItems'];
      this.ifItIsAnEntroprise(resolvedData);
      this.hardwareParkItemService.categories = this.categories;
    });
  }

  itIsAnEntreprise(): boolean {
    return this.route.snapshot.queryParamMap.get('typeCustomer') === 'company';
  }

  private itIsBeneficiary(): boolean {
    return this.route.snapshot.queryParamMap.get('typeCustomer') === 'beneficiary';
  }
  
  private ifItIsAnEntroprise(resolvedData) {
    this.customerId = getCustomerIdFromURL(this.route);
    if (this.isEntreprise) {
      this.fullCustomer = resolvedData['fullCustomer'];
      this.beneficiaries = this.buildRecepientsLightList();
      this.beneficiaries.sort((b1 , b2)=>this.alphabeticSort(b1.label , b2.label));
      this.severalCustomerTit = resolvedData['severalCustomerTit'];
      this.severalCustomerTit = this.severalCustomerTit.map((contract) => {
        contract.offre =
        isNullOrUndefined(contract.offre) || contract.offre === '-' ? CONSTANTS.AUCUNE_OFFRE : contract.offre;
        return contract;
      });
      this.severalCustomerTit.sort((contractA, contractB) => this.alphabeticSort(contractA.offre, contractB.offre));
      this.hardwareParkItemService.severalCustomerTit = this.severalCustomerTit;
      this.hardwareParkItemService.beneficiaries = this.beneficiaries;
      const nichIdentifiants = [];
      nichIdentifiants.push(this.severalCustomerTit[0].nichIdentifiant);
      this.getBillAccounts(nichIdentifiants);
      this.doFilterContracts();
      this.form.get('contract').setValidators([Validators.required , this.generalValidator()]);
      this.form.get('contract').updateValueAndValidity();
      this.form.get('beneficiarie').setValidators([Validators.required , this.generalValidator()]);
      this.form.get('beneficiarie').updateValueAndValidity();
    }else{
      this.customerService.getCustomer(this.customerId).subscribe(
        (customer)=>{
          const nichIdentifiants = [];
          nichIdentifiants.push(customer.nicheIdentifier);
          if(this.isBeneficiary){
            const companyNiche = sessionStorage.getItem('companyNiche');
            nichIdentifiants.push(companyNiche);
            this.getBillAccounts(nichIdentifiants);
          }else{
            this.getBillAccounts(nichIdentifiants);
          }
        }
      );
    }
  }

  alphabeticSort(contractA: string, contractB: string) {
    if (
      contractA.toUpperCase() > contractB.toUpperCase()
    ) {
      return 1;
    }
    if (
      contractA.toUpperCase() < contractB.toUpperCase()
    ) {
      return -1;
    }
    return 0;
  }

  private doHideFieldsByCategoryName() {
    this.form.get('category').valueChanges.subscribe((category) => {
      if (this.categoriesAsString.includes(category)) {
        this.isProduct = category === 'Produit';
        this.isOffreAndService = category === 'Offre et service';
        this.recurrentCategory = this.isOffreAndService ? 'Oui' : 'Non';
        this.isElse = category !== 'Offre et service' && category !== 'Produit';
      }
    });
  }

  private doFilterCategory() {
    this.filteredCategory = this.form.get('category').valueChanges.pipe(
      startWith(''), 
      map((category) => category
      ? this.hardwareParkItemService._filterCategory(category)
      : this.categories.slice())
      );
  }

  private doFilterBeneficiaries() {
    this.filteredBeneficiarie = this.form.get('beneficiarie').valueChanges.pipe(
      startWith(''), 
      map((beneficiary) => beneficiary
      ? this.hardwareParkItemService._filterBeneficiary(beneficiary)
      : this.beneficiaries.slice())
      );
  }

  private getProductByCategoryAndContractStatus() {
    this.form.get('serviceOrMateriel').valueChanges.pipe(
      tap(()=>this.rowData = this.billAccounts),
      switchMap((text) => {
        if(text && text.length === 0){
          return of(this.listProduct)
        }
      return of(
        this.listProduct ? this.listProduct.slice().filter(product=> product.name.toLowerCase().indexOf(text.toLowerCase())!== -1):[]
      )
    }),
     map(this.sortProduct())
  ).subscribe(
    (products)=>{
      if(this.category){
        this.products = products
      }
    }
  );
}

  private sortProduct(): (value: any[], index: number) => any[] {
    return (product) => {
      product.sort((p1 , p2) => {
        return p1.name.trim() < p2.name.trim() ? -1 : 1;
      });
      return product;
    };
  }

  private itIsWithFacturation() {
    this.form
      .get('radio')
      .valueChanges.subscribe(
        (data) => {
          this.showFacturation = data === 'oui'
          if(this.showFacturation){
            this.accountBilling = null;
          }else{
            this.accountBilling = {} as PenicheBillAccountLightVO;
          }
        }
        );
  }

  private doFilterContracts() {
     this.filteredContract= this.form.get('contract').valueChanges.pipe(
      startWith(''),
      map((contract) =>
        contract
          ? this.hardwareParkItemService._filterContract(contract)
          : this.severalCustomerTit.slice()
      )
    );
  }

  getStatus() {
    if (this.contract && this.contract.statut) {
      if (this.contract.statut === 'ACTIVE') {
        return 'MEMBER';
      } else {
        return 'NOT MEMBER';
      }
    }
    return 'ANY';
  }
  getBillAccounts(nichIdentifiants) {
    const billCriteria = {} as BillCriteriaVO;
    billCriteria.trigram = 'PAR';
    billCriteria.customersNumber = nichIdentifiants;
    this.accountBilling = null;
    this.callBillAccountService(billCriteria);
  }
  callBillAccountService(billCriteria: BillCriteriaVO) {
    this.billingService.getBillAccounts(billCriteria).subscribe((data) => {
      this.billAccounts = data;
      this.rowData = this.billAccounts;
    });
  }
  getParkItems(customerId: string) {
    this.parcLigneService.getParkItemsFull(customerId).subscribe((data) => {
      this.parkItems = data;
    });
  }

  onRowSelected(cf){
    this.accountBilling = cf;
  }
  onSaveParcElement() {
    this.inValidFormular = !this.form.valid;
    if (this.form.valid) {
      this.prepareCustomerHardwardParkItemVO();
      this.parcLigneService
        .createCustomerHardwareParkItem(this.customerHardwareParkItemVO)
        .subscribe((data) => {
          this.goBack();
          this.submitted = true;
        });
    }
  }
  goBack(): void {
    this.location.back();
  }
  prepareCustomerHardwardParkItemVO() {
    this.customerHardwareParkItemVO = {} as CustomerHardwareParkItemVO;
    this.customerHardwareParkItemVO.createdAt = new Date();
    this.customerHardwareParkItemVO.createdById = this.authTokenService.applicationUser.coachId;
    this.customerHardwareParkItemVO.status = 'ACTIF';
    this.customerHardwareParkItemVO.serial = this.form.get(
      'serielNumber'
    ).value;
    this.customerHardwareParkItemVO.toInvoice = this.showFacturation;
    this.customerHardwareParkItemVO.alreadyPaidInvoice =
      this.form.get('invoiceAlreadyPaid').value !== '';
    if (this.contract) {
      this.customerHardwareParkItemVO.customerId = this.contract.id;
    }else{
      this.customerHardwareParkItemVO.customerId = getDecryptedValue(this.customerId);
    }
    this.customerHardwareParkItemVO.category = this.form.get('category').value.name;
    this.customerHardwareParkItemVO.comments = this.form.get('comment').value;
    if (this.beneficiarie) {
      this.customerHardwareParkItemVO.customerBeneficeryId = this.beneficiarie.id;
    } else {
      this.customerHardwareParkItemVO.customerBeneficeryId = getDecryptedValue(this.customerId);
    }
    this.customerHardwareParkItemVO.product = this.product;
    this.customerHardwareParkItemVO.productLabel = this.product.name;
    this.customerHardwareParkItemVO.productId = this.product.id;
    this.customerHardwareParkItemVO.recurrent =
      this.recurrentCategory === 'Oui';
    this.customerHardwareParkItemVO.unreferencedProductCategory = this.category;
    if(this.product && this.product.articleClassLabel === 'Produit'){
      this.customerHardwareParkItemVO.subscriptionDate = this.form.get(
        'buyingDate'
      ).value;
    }else{
      this.customerHardwareParkItemVO.subscriptionDate = this.form.get(
        'startBilling'
      ).value;
    }

    this.customerHardwareParkItemVO.terminatedAt = this.form.get(
      'realizationDate'
    ).value;
    this.customerHardwareParkItemVO.terminatedById = this.authTokenService.applicationUser.coachId;
    const associetedLine = this.form.get('associetedLine').value;
    if (associetedLine) {
      this.customerHardwareParkItemVO.associatedLineId = this.form.get(
        'associetedLine'
      ).value.id;
      this.customerHardwareParkItemVO.associatedLineIdentifier = this.form.get(
        'associetedLine'
      ).value.webServiceIdentifier;
    }
    if (this.showFacturation) {
      const facturationLine = this.prepareFacturationInformation();
      this.customerHardwareParkItemVO.facturationLine = facturationLine;
      this.customerHardwareParkItemVO.billAccountIdentifier = this.accountBilling.billAccountIdentifier;
      this.customerHardwareParkItemVO.billAccountNicheIdentifier = this.accountBilling.billAccountNicheIdentifiant;
    }
  }
  prepareFacturationInformation() {
    const facturationLine = {} as FacturationLineVO;
    facturationLine.label = this.form.get('wordingBill').value;
    facturationLine.quantity = this.form.get('quantity').value;
    facturationLine.unitPrice = this.form.get('unitPricHT').value;
    facturationLine.tva =
      this.form.get('tva').value === null ? 20 : this.form.get('tva').value;
    const discount = this.form.get('discount').value;
    if(discount && discount.length !== 0){
      facturationLine.remise = discount;
    }else{
      facturationLine.remise = 0;
    }
    return facturationLine;
  }

  buildRecepientsLightList() {
    const beneficiaries: Array<BeneficiaryVO> = [];
    if (
      isNullOrUndefined(this.fullCustomer) ||
      isNullOrUndefined(this.fullCustomer.holderContracts)
    ) {
      return beneficiaries;
    }

    this.fullCustomer.holderContracts.forEach((currentHolder: CustomerVO) => {
      const currentOffer = currentHolder.offerLabel;
      beneficiaries.push(
        this.buildRecepientLineLightByRole(
          currentHolder,
          CONSTANTS.PERSON_CUSTOMER_TITU
        )
      );
      currentHolder.customerAffiliates.forEach((currentMember: CustomerVO) => {
        currentMember.offerLabel = currentOffer;
        beneficiaries.push(
          this.buildRecepientLineLightByRole(
            currentMember,
            CONSTANTS.PERSON_CUSTOMER_BEN
          )
        );
      });
    });
    return beneficiaries;
  }

  public buildRecepientLineLightByRole(customer: CustomerVO, role: string) {
    let beneficiariesLabel = '';
    const beneficiary: BeneficiaryVO = {} as BeneficiaryVO;
    if (customer.id != null) {
      if (role === CONSTANTS.PERSON_CUSTOMER_TITU) {
        beneficiariesLabel = `${this.getStringOrDefault(
          customer.customerCrmName
        )} -  ${
          customer.offerLabel && customer.offerLabel !== '-' ? customer.offerLabel : 'Aucune offre !'
        }`;
        if (this.isValidCustomer(customer)) {
          beneficiariesLabel += ` ( ${this.getStringOrDefault(
            customer.customerAffiliates[0].customerFullName
          )} )`;
        }
      } else {
        beneficiariesLabel = `${this.getStringOrDefault(
          customer.customerFullName
        )} - ${
          customer.offerLabel && customer.offerLabel !== '-' ? customer.offerLabel : 'Aucune offre !'
        }`;
      }
    }

    beneficiary.label = beneficiariesLabel;
    beneficiary.id = customer.id;
    beneficiary.holderId = customer.companyCustomerId;
    beneficiary.nicheIdentifier = customer.nicheIdentifier;

    return beneficiary;
  }

  private isValidCustomer(customer: CustomerVO) {
    return (
      customer.offerLabel !== CONSTANTS.PARNASSE_PLURIEL &&
      customer.offerLabel !== CONSTANTS.PARNASSE_POUR_UN_GROUPE &&
      customer.offerLabel !== CONSTANTS.PARNASSE_POUR_UN_GROUPE_V2 &&
      customer.offerLabel !== CONSTANTS.PARNASSE_POUR_VOUS &&
      this.isContainsOneElement(customer.customerAffiliates) &&
      (isNullOrUndefined(customer.companyCustomerId) ||
        customer.companyCustomerId === 0)
    );
  }

  getStringOrDefault(str: string): string {
    if (isNullOrUndefined(str) || str.length === 0) {
      return '';
    }
    return str;
  }

  isContainsOneElement(list: Array<any>) {
    return list && list.length === 1;
  }

  getBillAccountRecurrentLabel(billAccountRecurrent: boolean) {
    if (billAccountRecurrent) {
      return CONSTANTS.ACCOUNT_CONSULT_RECC_ACCOUNT;
    }
    return CONSTANTS.ACCOUNT_CONSULT_NOT_RECC_ACCOUNT;
  }

  getPaymentModeLabel(billAccountPaymentMode: string) {
    if (!isNullOrUndefined(billAccountPaymentMode)) {
      return this.getLabel(billAccountPaymentMode);
    }
    return '';
  }
  getLabel(billAccountPaymentMode: string) {
    switch (billAccountPaymentMode) {
      case 'PRELEVEMENT':
        return 'Prélévement SEPA';
      case 'CHEQUE':
        return 'Chèque';
      case 'VIREMENT':
        return 'Virement';
      case 'CB':
        return 'Carte bancaire';
      case 'AMEX':
        return 'American Express';
      case 'PRELEVEMENT_AMEX':
        return 'Prélévement AMEX';
      case 'PRELEVEMENT_CB':
        return 'Prélévement CB';
      default:
        return '';
    }
  }

  getPayerName(billAccount: PenicheBillAccountLightVO) {
    if (!isNullOrUndefined(billAccount.billAccountPayerTitle)) {
      if (billAccount.billAccountPayerTitle === 'PM') {
        return billAccount.billAccountPayerCompany;
      } else {
        let name = '';
        if (!isNullOrUndefined(billAccount.billAccountPayerLastName)) {
          name += `${billAccount.billAccountPayerLastName} `;
        }
        if (!isNullOrUndefined(billAccount.billAccountPayerFirstName)) {
          name += `${billAccount.billAccountPayerFirstName}`;
        }
        return name;
      }
    }
    return '';
  }

  getPriceTtcAllInclusive(product: ProductVO): number {
    let discount = 0;
    if (product.discountIncluded) {
      discount = product.discountHt;
    }
    return (
      (this.getTvaNumberValue(product.tva) / 100 + 1) *
      (product.priceHt - discount)
    );
  }

  getTvaNumberValue(tva: string) {
    switch (tva) {
      case CONSTANTS.OLD_TVA_NORMALE:
        return 19.6;
      case CONSTANTS.OLD_TVA_REDUITE:
        return 5.5;
      case CONSTANTS.TVA_NORMALE:
        return null;
      case CONSTANTS.TVA_REDUITE:
        return 7.0;
      case CONSTANTS.TVA_MOYENNE:
        return 10.0;
      default:
        return 0;
    }
  }

  onChoseContract(contract) {
    if (!isNullOrUndefined(contract)) {
      this.contract = contract;
      this.parkItems = [];
      this.form.get('associetedLine').setValue(null);
      this.getParkItems(getEncryptedValue(this.contract.id));
      const nichIdentifiants = [];
      nichIdentifiants.push(contract.nichIdentifiant);
      this.getBillAccounts(nichIdentifiants);
    }
  }

  calculatePrice(): void {
    let unitPriceHT = this.form.get('unitPricHT').value;
    let discount = this.form.get('discount').value;
    discount = isNullOrUndefined(discount) ? '0':discount;
    const quantity = this.form.get('quantity').value;
    let tva = this.form.get('tva').value;
    tva = tva === null ? 20 : tva;
    unitPriceHT = this.cleanNumber(unitPriceHT.toString());
    discount = this.cleanNumber(discount.toString());
    const priceHt = (unitPriceHT - discount) * quantity;
    const priceTtc = priceHt * (1 + tva / 100);
    this.htPrice = (Math.round(priceHt * 100) / 100).toFixed(2);
    this.ttcPrice = (Math.round(priceTtc * 100) / 100).toFixed(2);
  }
  maxDiscount(unitPriceHT: number): any {
    if(unitPriceHT && unitPriceHT > 0){
      return unitPriceHT;
    }
    return 0;
  }
  cleanNumber(cleanedNumber: any) {
    cleanedNumber = cleanedNumber.replace(',', '.');
    cleanedNumber = cleanedNumber.replace(' ', '');
    return cleanedNumber;
  }

  onChoseBeneficiarie(beneficiarie) {
    this.beneficiarie = beneficiarie;
  }
  onChoseProduct(product) {
    this.product = product;
    this.quantityBlocked = this.product.quantityBlocked;
    this.form.get('unitPricHT').setValue(this.product.priceHt);
    this.maximumDiscount = this.maxDiscount(this.product.priceHt);
    this.form.get('wordingBill').setValue(this.product.libelleFacture);
    this.form.get('tva').setValue(this.getTvaNumberValue(this.product.tva));
    if(this.product && this.product.serialRequired && this.product.serialRequired === true){
      this.serialRequired = this.product.serialRequired;
      this.form.get('serielNumber').setValidators([Validators.required]);
      this.form.get('serielNumber').updateValueAndValidity();
    }
    const discount = isNullOrUndefined(this.product.discountHt) ? 0:this.product.discountHt;
    this.form.get('discount').setValue(discount);
    this.form.get('discount').setValidators(this.discountValidator(this.maximumDiscount));
    this.form.get('discount').updateValueAndValidity();
    this.calculatePrice();  
    this.doFilterAccounts(this.product.recurrent);
  }
  doFilterAccounts(recurrent: boolean) {
    if(recurrent){
      const billAccountClone = this.billAccounts.slice();
      this.rowData = billAccountClone.filter((account)=>this.isReccurentAccount(account));
    }
  }
  isReccurentAccount(account: PenicheBillAccountLightVO): unknown {
    return (account.billAccountUniverse === 'SERVICE' &&
            account.billAccountRecurrent === true) ||
            account.billAccountUniverse === 'SERVICE';
  }

  annuler(){
    this.canceled = true;
    const dashboard = '/customer-dashboard'
    this.previousUrl = this.notificationService.notifyPreviousUrl();
    if(this.previousUrl.includes('particular') || !this.isEntreprise){
      if(this.previousUrl.includes('see-all')){
        this.router.navigate(
          [dashboard ,  this.customerId , 'see-all','parc-services'],
          {queryParamsHandling: 'merge'}
        );
      }else{
        this.router.navigate(
          [dashboard, 'particular' ,  this.customerId],
          {queryParamsHandling: 'merge'}
        );
      }
    }else{
      if(this.previousUrl.includes('see-all')){
        this.router.navigate(
          [dashboard , this.customerId , 'see-all' , 'parc-services'],
          {queryParamsHandling: 'merge'}
        );
      }else{
        this.router.navigate(
          [dashboard , 'entreprise' , this.customerId],
          {queryParamsHandling: 'merge'}
        );
      }
    }
  }
   discountValidator(maximumDiscount: number){
    return (control: AbstractControl):{[key: string]: boolean} | null => {
    if(!isNullOrUndefined(control.value) && (isNaN(control.value) || control.value > maximumDiscount)){
      return {'discountValidator': true}
    }
    return null;
  };
  }
  generalValidator(){
    return (control: AbstractControl):{[key: string]: boolean} | null => {
    if(!isNullOrUndefined(control.value) && control.value === '--'){
      return {'discountValidator': true}
    }
    return null;
  };
  }

}
