import { RestrictionOnCart } from './../restriction-on-cart.service';
import { DatePipe } from '@angular/common';
import { DateFormatPipeFrench } from './../../../_shared/pipes/dateformat/date-format.pipe';
import { FormStoreManagementService } from './../cart/tab-article/from-store-management.service';
import { GassiMockLoginService } from './../../../_core/services/gassi-mock-login.service';
import {Component, OnInit, ViewChild, ChangeDetectorRef, AfterContentChecked, OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CartStatusValue } from '../../../_core/enum/cart.enum';
import { RequestDetailsService } from '../../../_core/services/request-details.service';
import { CONSTANTS, CUSTOMER_TYPE_LABEL } from '../../../_core/constants/constants';
import { CartService } from '../../../_core/services/cart.service';
import { RecapCartVo } from '../../../_core/models/recap-cart-vo';
import { RecapCartItemVo } from '../../../_core/models/recap-cart-Item-vo';
import { ClipboardService } from 'ngx-clipboard';
import { PostalAdresseVO } from '../../../_core/models/postalAdresseVO';
import { SharedDataDeliveryCartVo } from '../../../_core/models/shared-data-delivery-cart-vo';
import { CalculeCartPricesService } from '../../../_core/services/calcule-cart-prices.service';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { CatalogeService } from '../../../_core/services/http-catalog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartSavService } from '../../../_core/services/http-cart-sav.service';
import { FormControl, FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { ReferenceDataVO, CartSavVO, UserVO, CartVO, PersonVO } from '../../../_core/models/models';
import { NotificationService } from '../../../_core/services/notification.service';
import { WinGsmService } from '../../../_core/services/win-gsm.service';
import { CartCreationService } from '../cart/cart-creation.service';
import { REFERENCE_DATA_PANIER } from '../cart-constant';



@Component({
  selector: 'app-cart-creation',
  templateUrl: './cart-creation.component.html',
  styleUrls: ['./cart-creation.component.scss'],
})
export class CartCreationComponent implements OnDestroy, OnInit,  AfterContentChecked  {
  form: FormGroup;
  title = new FormControl();
  priority  = new FormControl();
  name: string;
  cart: CartVO;
  cartId: number;
  cartRecapVo: RecapCartVo;
  requestInterLabel: string;
  customerDashboard = '/customer-dashboard'
  customerId: any;
  parcoursKey: any;
  saveDone = false;
  cartRecapItemsVo: RecapCartItemVo[];
  requestId: any;
  isRequestSav = false;
  statusLabel: string;
  parcours: string;
  ongletSelectedAfterSave = 0;
  isAssurance: boolean;
  isRenouvellement: boolean;
  isAchatSimple: boolean;
  isAchatPresentation: boolean;
  isAchatAbonnement: boolean;
  isEntreeCercleParnasse: boolean;
  isCooptation: boolean;
  isSAVHome: boolean;
  isAssistanceSAVMobile: boolean;
  isValidDevisForm: boolean;
  isValidDeliveryForm: boolean;
  isValidLogisticsForm: boolean;
  hideDevisBadge = true;
  hideLogisticsBadge = true;
  hideDeliveryBadge = true;
  previsTabIndex = 0;
  currentTabIndex = 0;
  isHiddenDelivery = true;
  public CartStatusValue = CartStatusValue;

  sharedDataDeliveryCartVo: SharedDataDeliveryCartVo;
  stockChangedValue: string;
  modeDeliveryChangedValue: string;
  coachNameChangedValue: string;
  addresseChangedValue: PostalAdresseVO;
  recepientNumberContactChangedValue: string;
  recepientNameFromAdresseChangedValue: PostalAdresseVO;
  recepientNameChangedValue: string;
  visibleActionsOnLogistic = false;
  
  @ViewChild('sticker', { static: false }) sticker;
  visibleActionsOnSAV = false;
  visibleActionsOnResumePanier = false;
  RESP_SOUTIEN_MULTIMEDIA = 'RESP SOUTIEN MULTIMEDIA';
  RESP_SQUAD = 'RESP SQUAD';
  RESP_COACH = 'RESP COACH';
  rolesSAV = [
    'SOUTIEN MULTIMEDIA',
    this.RESP_SOUTIEN_MULTIMEDIA,
    'TECHNICIEN',
    'TECHNICIEN_RIVIERA',
    'ADMINISTRATEUR'
  ];
  rolesResumePanier = [
    this.RESP_SQUAD,
    'RESP DESK',
    this.RESP_COACH,
    'ADMINISTRATEUR'
  ];
  rolesArticle = [
    'ADMINISTRATEUR',
    'ASSISTANT_COACH',
    'SERVICE_RESERVATION',
    'COACH',
    this.RESP_COACH,
    this.RESP_SQUAD
  ]
  visibleActionsOnDevis = true;
  visibleActionsOnLivraison = false;
  visibleActionsForCoachAndDesk = true;
  billAccountId: string;
  isStockRequired = true;
  isFacturation: boolean;
  NameOfrole = "RESSOURCES";
  initPrelevementStock: any;
  stocksDisponibility : any;
  calculateMargePourcent: string;
  calculateMargeEuro: string;
  visibleActionsOnArticle = true;
  cartStatus: string;
  formCatalog: string;
  clickCancelBtn = false;
  preparedData = false;
    /** gestion des erreurs */
    invalidForm = false;
    stockPreleveInvalid = false;
    typeOfCustomer = CUSTOMER_TYPE_LABEL;
    coachInvalid = false;
    adresseDevisInvalid =false;
    adresseDeliveryInvalid = false;
    adresseDeliverySaisieInvalid = false;
    adresseDevisSaisieInvalid= false;
    datedesiredInvalid = false;
    modeDeliveryInvalid = false;
    receptionerComboInvalid = false;
    mobileCantactInvalid = false;
    contactPourReceptionnerInvalid = false
    commentInvalid = false;
    discountInvalid = false;
    descriptifInvalid = false;
    destinationInvalid =false;
    showCommentError = false;
    showDicountError = false;
    showStockError = false;
    showCoachError = false;
    showFormError = false;
    showadresseDevisError=false;
    showadresseDeliveryError = false;
    showadresseDeliverySaisieError = false;
    showadresseDevisSaisieError = false;
    showdatedesiredError = false;
    showmodeDeliveryError = false;
    showcontactPourReceptionnerError = false
    showMobileContactError = false;
    showDescriptifError = false;
  showReceptionerComboError = false;
    showDestinationError = false;
    inValidFiledsNumber = 0;
    /* end */
    cartToSave: CartVO;
    CartSavToSave;
    Oldcart : CartVO;
    oldTitle = "";
    oldIsPrio = false;
    recoveryValueFromDeliveryToSav;
    /** */
    submitted =false;
    childFormValidCheck : FormGroup;
    childFormVDeliveryalidCheck : FormGroup;
    isRecoverSav = false;
     totalDiscount: string;
    annualTotal: any;
     monthlyTotal: any;
     punctualTotal: any;
    cartTotal: any;
    items: RecapCartItemVo[];
    typeCustomer;
    mySubscription: any;
    formsSubmitted = false;
  hasArticleSupscriptionPeriodicityEqualACTE: any;
  cartHasBlockedItem : boolean;
  ASSISTANCE_SAV_MOBILE = 'Assistance SAV mobile';
  DELIVERY = 'delivery';
  loading: boolean;
  discountInvalidForNegativePrice = false;
  showDiscountInvalidForNegativePriceError = false;
  visibleActionOnUnblocking = false;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly requestDetailService: RequestDetailsService,
    private readonly cartService: CartService,
    private readonly clipboardService: ClipboardService,
    private readonly mockLoginService: GassiMockLoginService,
    private readonly formStoreManagementService: FormStoreManagementService,
    private readonly dateFormatPipeFrench: DateFormatPipeFrench,
    private readonly winGsmService: WinGsmService,
    private readonly calculeCartPricesService: CalculeCartPricesService,
    private readonly catalogeService: CatalogeService, 
    private readonly _snackBar: MatSnackBar,
    private readonly cartSAVService: CartSavService,
    private readonly changeDRef: ChangeDetectorRef,
    private readonly _formBuilder: FormBuilder,
    readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly cartCreationService:CartCreationService,
    private readonly datePipe: DatePipe,
    private readonly restrictionOnCart:RestrictionOnCart
  ) {
    this.form = this.createFormGroup();
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        this.cartCreationService.isFromCancel = false;
      }
    });
  }
  
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
  createFormGroup(): FormGroup {
   
    return this._formBuilder.group({
      title: this._formBuilder.control(null),
      priority: this._formBuilder.control(null),
    });
}
  
  ngAfterContentChecked(): void {
     this.showCommentError = this.commentInvalid;
     this.showDicountError = this.discountInvalid;
     this.showDiscountInvalidForNegativePriceError = this.discountInvalidForNegativePrice
     this.showStockError = this.stockPreleveInvalid;
     this.showCoachError = this.coachInvalid;
     this.showDescriptifError = this.descriptifInvalid;
     this.showMobileContactError = this.mobileCantactInvalid;
     this.showadresseDeliveryError = this.adresseDeliveryInvalid;
     this.showadresseDeliverySaisieError = this.adresseDeliverySaisieInvalid;
     this.showadresseDevisSaisieError = this.adresseDevisSaisieInvalid;
     this.showadresseDevisError = this.adresseDevisInvalid;
     this.showdatedesiredError = this.datedesiredInvalid;
     this.showcontactPourReceptionnerError = this.contactPourReceptionnerInvalid;
     this.showmodeDeliveryError = this.modeDeliveryInvalid;
     this.showReceptionerComboError = this.receptionerComboInvalid;
     this.showDestinationError = this.destinationInvalid;
     this.showFormError = (this.commentInvalid || this.discountInvalid || this.discountInvalidForNegativePrice || this.stockPreleveInvalid || this.coachInvalid 
      || this.descriptifInvalid || this.mobileCantactInvalid || this.adresseDeliveryInvalid
      || this.adresseDevisInvalid || this.datedesiredInvalid || this.contactPourReceptionnerInvalid
      || this.contactPourReceptionnerInvalid || this.receptionerComboInvalid || this.destinationInvalid
      || this.adresseDeliverySaisieInvalid  || this.adresseDevisSaisieInvalid
      );
    
    this.changeDRef.detectChanges();
  }
  isCartChanged = false;
  cartResultAfterSave = {} as CartVO;
  cartSAVResultAfterSave = {} as CartSavVO;
  createdAt : any;
  statusModifiedAt : any;
  modifiedAt : any;
  onchangeDeliveryValues(data: SharedDataDeliveryCartVo) {
    this.sharedDataDeliveryCartVo = data;
    this.initSharedDataStock();
    this.initSharedDataDelivery();
    this.initSharedDataCoachName();
    this.initSharedDataRecepientNumberContact();
    this.initSharedDataAdresse();
  }
  initSharedDataStock() {
    if (
      this.sharedDataDeliveryCartVo.stock != null &&
      this.sharedDataDeliveryCartVo.stock !== ''
    ) {
      this.stockChangedValue = this.sharedDataDeliveryCartVo.stock;
      this.isHiddenDelivery = false;
    }
  }
  initSharedDataDelivery() {
    if (
      this.sharedDataDeliveryCartVo.modeDelivery != null &&
      this.sharedDataDeliveryCartVo.modeDelivery !== ''
    ) {
      this.modeDeliveryChangedValue = this.sharedDataDeliveryCartVo.modeDelivery;
      this.isHiddenDelivery = false;
    }
  }
  initSharedDataCoachName() {
    if (
      this.sharedDataDeliveryCartVo.coachNameChangedValue != null &&
      this.sharedDataDeliveryCartVo.coachNameChangedValue !== ''
    ) {
      this.coachNameChangedValue = this.sharedDataDeliveryCartVo.coachNameChangedValue;
      this.isHiddenDelivery = false;
    }
  }
  initSharedDataRecepientNumberContact() {
    if (
      this.sharedDataDeliveryCartVo.recepientNumberContactChangedValue != null
    ) {
      this.recepientNumberContactChangedValue = this.sharedDataDeliveryCartVo.recepientNumberContactChangedValue;
      this.isHiddenDelivery = false;
    }
  }
  initSharedDataAdresse() {
    this.route.data.subscribe((resolversData) => {
      const carts: CartVO[] = resolversData['cartLight'];
      this.Oldcart = carts[0];
      if(!isNullOrUndefined(this.Oldcart)){
        this.Oldcart.request.cartItems = this.Oldcart.items;
      }
     
    });
    if (this.sharedDataDeliveryCartVo.addresseChangedValue != null) {
      this.addresseChangedValue = this.sharedDataDeliveryCartVo.addresseChangedValue;
      this.formatreceipeintName(
        this.sharedDataDeliveryCartVo.addresseChangedValue
      );
      this.isHiddenDelivery = false;
    }
    if (this.sharedDataDeliveryCartVo.recepientNameChangedValue != null) {
      this.formatreceipeintName(
        this.sharedDataDeliveryCartVo.recepientNameChangedValue
      );
      this.isHiddenDelivery = false;
    }
  }
  ngOnInit() {
    this.notificationService.setShowButton(false);
    this.restoreCartAfterCancel();
    this.restoreCartLightAfterCancel();
    this.identifyParcours();
    this.requestId = this.route.snapshot.paramMap.get('idRequest');
    this.route.parent.paramMap.subscribe((params) => {
      this.customerId = params.get('customerId');
    });

    this.route.queryParamMap.subscribe((params) => {
      this.parcoursKey = params.get('parcours');
    });
    this.route.queryParamMap.subscribe((params) => {
      this.ongletSelectedAfterSave = Number(params.get('onglet'));
    });
    if(this.ongletSelectedAfterSave === null){
      this.ongletSelectedAfterSave = 0;
    }
    this.initValidator();
    this.route.queryParamMap.subscribe(params => {
      this.formCatalog = params.get('formCatalog');
    });

    this.requestDetailService
      .getDetailsByRquestId(this.requestId)
      .subscribe((response) => {
        if (response.requestTypeId === CONSTANTS.ID_REQUEST_TYPE_SAV_MOBILE) {
          this.isRequestSav = true;
        }
      });
  
  if(!isNullOrUndefined(this.formCatalog) && this.formCatalog === "yes" && !isNullOrUndefined(this.calculeCartPricesService.cart)){
    this.cart =  this.calculeCartPricesService.cart;
    if(this.cart && this.cart.id){
      this.notificationService.setShowButton(true);
    }
    this.winGsmService.checkAvailabilityOfItemsAlpha(this.formStoreManagementService.cartItems).subscribe( data => {
	    	      this.stocksDisponibility = data;
      });      

      this.fillData();
      this.initPrices(this.cartRecapVo);
      this.initRecapService();
      this.calculateMargePourcent = this.cartRecapVo.calculateMargePourcent;
      this.calculateMargeEuro = this.cartRecapVo.calculateMargeEuro;
    } else {
    this.route.data.subscribe((resolversData) => {
      const carts: CartVO[] = resolversData['carts'];
      
      this.cart = carts[0];
      
      if(this.cart !== null && this.cart !== undefined ){
        this.initDate();
        if(this.cart.id !== null){
          this.notificationService.setShowButton(true);
        	this.cartId = this.cart.id;
          this.isHiddenDelivery = false;
          this.initRecapService();
      }
    }
      this.billAccountId = this.cart.billAccountId;
      this.restrictionOnCart.setRestrictionByCartPhaseAndUserRole(this.mockLoginService , this.cart.status);
      this.initRestrictions();
      this.getInterlocuteur(this.cart.request.interlocuteur);
    });
    }
   

    this.formStoreManagementService.changeCartCaluleNotification().subscribe(
      (data)=>{
         this.onUpdateRecapCartItemEvent(data); 
      }
    );
    this.watchRouteToInitStock();
    this.route.queryParamMap.subscribe(params => this.typeCustomer = params.get('typeCustomer'));
    this.checkIfCartHasBlockedItem();
  }

  checkIfCartHasBlockedItem(){
    this.cartHasBlockedItem = false;
    if(this.cart 
      && this.cart.request 
      && this.cart.request.cartItems 
      && this.cart.request.cartItems.length > 0){
      this.cart.request.cartItems.forEach(item => {
        if(item.product.blocked && isNullOrUndefined(item.deletingDate)){
          this.cartHasBlockedItem = true;
        }
      });
    }
  }
  
  //==========================END NG ONINT==================
  restoreCartAfterCancel(){
    this.route.data.subscribe((resolversData) => {
      if(resolversData['carts'] && resolversData['carts'][0]){
        this.cartToSave = Object.assign({}, resolversData['carts'][0]);
      }
      
    });
   
  }
 
  restoreCartLightAfterCancel(){
    this.route.data.subscribe((resolversData) => {
      this.cartCreationService.restoreCartLight(resolversData['cartLight'][0]);
    });  
  }

  watchRouteToInitStock() {
    this.router.events.subscribe(
      (event)=> {
        if(event instanceof NavigationEnd &&  event.url.indexOf('/cart') === -1){
          sessionStorage.setItem('initStock' , 'no');
        }
      }
    );
  }

  initRecapService(){
    if(this.cart.id){
      this.cartService.getRecapCartByCartId(this.cart.id).subscribe( (data) => {
        if(data !=null){
          this.cartRecapVo = data;
          this.initCartRecapVo();
            if(this.cart){
              const recap = this.calculeCartPricesService.recalculatePrices(this.cart);
              this.initPrices(recap);
              this.calculateMargePourcent = this.cart.calculateMargePourcent;
              this.calculateMargeEuro = this.cart.calculateMargeEuro;
        }
          }
      });
    }
   
  }

  fillData(){
    if(this.cart !== null && this.cart !== undefined ){
  
      this.initDate();
      if(this.cart !== null){
        this.isHiddenDelivery = false;
        this.cartRecapVo = this.calculeCartPricesService.recalculatePrices(this.cart);
        this.items = this.cartRecapVo.items;
        this.initCartRecapVo();
      }
    }
    this.billAccountId = this.cart.billAccountId;
    this.restrictionOnCart.setRestrictionByCartPhaseAndUserRole(this.mockLoginService , this.cart.status);
    this.initRestrictions();
    this.getInterlocuteur(this.cart.request.interlocuteur);
  }
  initRestrictions() {
    this.mockLoginService.getCurrentConnectedUser().subscribe((user) => {
      this.visibleActionsOnLogistic = this.restrictionOnCart.visibleActionsOnLogistic;
      this.visibleActionsOnSAV = this.restrictionOnCart.visibleActionsOnSAV;
      this.visibleActionsOnResumePanier = this.restrictionOnCart.visibleActionsOnResumePanier;
      this.visibleActionsOnDevis = this.restrictionOnCart.visibleActionsOnDevis;
      this.visibleActionsOnLivraison = this.restrictionOnCart.visibleActionsOnLivraison;
      this.visibleActionsOnArticle = this.restrictionOnCart.visibleActionsOnArticle;
      this.visibleActionsForCoachAndDesk = this.restrictionOnCart.visibleActionsForCoachAndDesk;
      this.visibleActionOnUnblocking = this.restrictionOnCart.visibleActionOnUnblocking;
    });
  }

  initPrices(recap) {
    this.totalDiscount = this.getTotalDiscount(recap);
    this.monthlyTotal = !recap.monthlyTotal ? '0' : recap.monthlyTotal;
    this.annualTotal = !recap.annualTotal ? '0':recap.annualTotal;
    this.punctualTotal = !recap.punctualTotal ? '0':recap.punctualTotal;
    this.cartTotal = !recap.cartTotal? '0':recap.cartTotal;
  }
  getTotalDiscount(recap): string {
    return !recap.totalDiscount ||
            recap.totalDiscount === '0' ||
            recap.totalDiscount === '' 
            ? '0' : `-${recap.totalDiscount}`;
  }

  initDate(){
    if(this.cart.request != null && this.cart.request !== undefined){
      this.createdAt = this.dateFormatter(this.cart.request.createdAt);
      this.statusModifiedAt = this.dateFormatter(this.cart.statusModifiedAt);
      this.modifiedAt = this.dateFormatter(this.cart.modifiedAt);
    }
    
  }

  initCartRecapVo() {
    if(!isNullOrUndefined(this.items)){
      this.cartRecapItemsVo = this.items;
    }else{
      this.cartRecapItemsVo = this.cartRecapVo.items;
    }
    this.stockChangedValue = this.cartRecapVo.stockToUse;
    this.modeDeliveryChangedValue = this.cartRecapVo.deliveringModeLabel;
    this.coachNameChangedValue = this.cartRecapVo.coachName;
    this.addresseChangedValue = this.cartCreationService.formatAddressToDelivery(this.cartRecapVo.deliveryPostalAddressNewVo,
       this.cart.deliveringModeRef, this.cart.stockToUse);
    if(!isNullOrUndefined(this.cartRecapVo.deliveryPostalAddressNewVo)){
      this.formatreceipeintName(this.cartRecapVo.deliveryPostalAddressNewVo);
    }
    this.cartTotal = this.cartRecapVo.cartTotal;
    this.totalDiscount = this.cartRecapVo.totalDiscount;
    this.punctualTotal = this.cartRecapVo.punctualTotal;
    this.monthlyTotal = this.cartRecapVo.monthlyTotal;
    this.annualTotal = this.cartRecapVo.annualTotal;
    this.recepientNumberContactChangedValue = this.cartRecapVo.recepientNumberContact;
  }



  private identifyParcours() {
    this.parcours = this.route.snapshot.queryParamMap.get('parcours');
    if(this.parcours){
      this.isAssurance = this.parcours.indexOf('Assurance') !== -1;
      this.isRenouvellement = this.parcours.indexOf('Renouvellement') !== -1;
      this.isAchatSimple = this.parcours === 'Achat - Simple';
      this.isAchatPresentation = this.parcours === 'Achat - Prestation';
      this.isAchatAbonnement =
      this.parcours === 'Achat - Abonnement solution sécurité';
      this.isEntreeCercleParnasse = this.parcours === 'Entrée Cercle Parnasse';
      this.isCooptation = this.parcours === 'cooptation';
      this.isSAVHome = this.parcours === 'SAV Home';
      this.isAssistanceSAVMobile = this.parcours === this.ASSISTANCE_SAV_MOBILE;
    }
  }

  getInterlocuteur(data: PersonVO): string {
    const tiret = ' - ';
    if (data !== null) {
      this.requestInterLabel = `${data.lastName !== null ? data.lastName : ''} ${data.firstName !== null  ? data.firstName : ''}`;
      if (data.personRoleLabel != null) {
        this.requestInterLabel =
          this.requestInterLabel + tiret + data.personRoleLabel;
      }
    }

    return this.requestInterLabel;
  }

  dateFormatter(dateIn) :string{
    {
     
      if (dateIn === 'null' || dateIn == null) {
        return '-';
      }
      const date = this.dateFormatPipeFrench.transform(
        dateIn,
        'dd MMM yyyy'
      );
      return `${date} à ${this.datePipe.transform(dateIn , "HH'h'mm")}`;
    }
  }

  tabChanged(tab) {
    const tabLabel = tab.tab.textLabel;
    this.formStoreManagementService.onTabChange(true);
    this.previsTabIndex = this.currentTabIndex;
    this.currentTabIndex = tab.index;
    this.isFacturation = this.currentTabIndex === 4;
    switch (tabLabel) {
      case 'DEVIS':
        this.checkDevisForm();
        break;
      case 'Livraison':
        this.checkDeliveryForm();
        break;
      default:
        break;
    }
  }
  onCheckDevisFormValidationEvent(validForm: boolean) {
    this.isValidDevisForm = validForm;
  }
  onCheckDeliveryFormValidationEvent(validForm: boolean) {
    this.isValidDeliveryForm = validForm;
  }
  checkDeliveryForm() {
    if(!this.isValidDeliveryForm ){
      this.isStockPreleveRequired();
      if(!this.isStockRequired){
        this.form.get('delivery').get('stockPreleve').setValidators(null);
        this.form.get('delivery').get('stockPreleve').updateValueAndValidity();
      }
      else{
        this.form.get('delivery').get('stockPreleve').setValidators(Validators.required);
        this.form.get('delivery').get('stockPreleve').updateValueAndValidity();
      }
      this.isValidDeliveryForm = this.form.get('delivery').valid;
    }
    if (!this.isValidDeliveryForm 
      && !this.visibleActionsOnLivraison
      && this.inValidFiledsNumber === 0) {
        if(this.parcoursKey !== this.ASSISTANCE_SAV_MOBILE){
      this.hideDeliveryBadge = false;
        }
    } else {
        this.hideDeliveryBadge = true;
    }
  }
  checkDevisForm() {
    if (this.isValidDevisForm 
      && this.inValidFiledsNumber === 0) {
      this.hideDevisBadge = true;
    } else {
      this.hideDevisBadge = false;
    }
  }

  copyInputMessage() {
    this.clipboardService.copyFromContent(this.sticker.nativeElement.innerText);
  }

  formatreceipeintName(addresseChangedValue: PostalAdresseVO) {
    if(!isNullOrUndefined(addresseChangedValue)){
    const firstName = addresseChangedValue.firstName;
    const lastName = addresseChangedValue.lastName;
    const name = `${addresseChangedValue.title} ${firstName} ${lastName}`;
    this.recepientNameChangedValue = name;
  }
  }

  getConnectedUserId():number{
    let userId = null
    this.mockLoginService.getCurrentConnectedUser().subscribe((user) => {
      if (user) {
        userId = user.coachId;
      }
    });
    return userId;
  }
  
    onCheckModificationEvent(event){
      this.isCartChanged = false;
    if(event){
      this.isCartChanged = true;
    }
    }

    onUpdatingItems(event){
      this.winGsmService.checkAvailabilityOfItemsAlpha(event).subscribe( data => {
        this.stocksDisponibility = data;
      });
    }

    onInitPrelevementStockEvent(event){
      this.initPrelevementStock = !this.initPrelevementStock;
    }
    
    onUpdateRecapCartItemEvent(event){
      const cartRecapVo = event;
      this.cartRecapVo = cartRecapVo;
      this.cartRecapItemsVo = cartRecapVo.items;
      this.initPrices(this.cartRecapVo);
      this.calculateMargePourcent = cartRecapVo.calculateMargePourcent;
      this.calculateMargeEuro = cartRecapVo.calculateMargeEuro;
      this.checkIfCartHasBlockedItem();
    }
    onSendStatusToParentEvent(event){
      this.cartStatus = event;
    }

 /** SAVE SENT a true value to childs (article,delivery,belling,devis,sav) for 
  * senting Data To Save */
    save(){
      this.formsSubmitted = true;
      this.initValidator();
     if(this.parcoursKey !== this.ASSISTANCE_SAV_MOBILE){
      this.mobileCantactInvalid = this.checkIsMobileValid();
      this.findInvalidControls(this.form.controls.delivery);
    }
      if(this.form.get('devis') != null){
        this.findInvalidControls(this.form.controls.devis);
      }
      if(this.form.get('article') != null){
        this.findInvalidControlsInArticles(this.form.get('article').value);
      }
      if(!this.validator()){
        // getRawValue() utilisé pour récupérer même les valeur des champs disabel
        this.prepareDeliveryToSave(this.form.getRawValue().delivery);
        this.prepareBillingToSave(this.form.get('billing').value);
        if(this.form.get('devis') != null){
          this.prepareDevisForSave(this.form.get('devis').value);
        }
        // getRawValue() utilisé pour récupérer même les valeur des champs disabel
        this.prepareCartItemToSave(this.form.getRawValue().article);
        
        if(this.form.get('sav') != null){
          this.prepareSavToSave(this.form.get('sav').value, this.form.get('deliveryHardware').value.isDeliveryHardware);
        }
        this.cartToSave.isPrioritized = this.form.get('priority').value;
        this.cartToSave.title =  this.form.get('title').value;
        this.cartToSave.userId = this.getConnectedUserId();
        this.cartToSave.modifiedById= this.getConnectedUserId();
        this.saveDone = true;
        this.saveServiceCall(this.cartToSave);
      
      }
      else{
        window.scrollTo(0, 0);
      }
      
    }

    checkIsMobileValid(): boolean {
      if(!isNullOrUndefined(this.form) &&
        !isNullOrUndefined(this.form.get(this.DELIVERY)) &&
        !isNullOrUndefined(this.form.get(this.DELIVERY).value) &&
        !isNullOrUndefined(this.form.get(this.DELIVERY).value.phoneContact)) {
          if(this.form.get(this.DELIVERY).value.phoneContact.length > 20) {
            return true;
          }
      }
      return false;
    }
    forceToParnasseOrReveira(deliveryModeKey){
    const isNotDelivred = (deliveryModeKey === REFERENCE_DATA_PANIER.AUTRE.key 
    || deliveryModeKey === REFERENCE_DATA_PANIER.PRESTATAIRE_LIVRAISON.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_AIX.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_LYON.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_ANNECY.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_LILLE.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_AIX.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_LILLE.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_LYON.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_ANNECY.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_RIVIERA.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_BORDEAUX.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_CORSE_SUD.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_NANTES.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_NORMANDIE.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_RENNES.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_TECHNICIEN_TOULOUSE.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_BORDEAUX.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_CORSE_SUD.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_NANTES.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_NORMANDIE.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_RENNES.key
    || deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_TOULOUSE.key);

      if(isNotDelivred) {
        this.cartToSave.deliveryToParnasse = false;
        this.cartToSave.deliveryToRiviera  = false;
        }
      else if(deliveryModeKey === REFERENCE_DATA_PANIER.LIVRAISON_PAR_COACH_RIVIERA.key ){
       this.cartToSave.deliveryToParnasse = false;
       this.cartToSave.deliveryToRiviera = true;
      }
      else{
        this.cartToSave.deliveryToParnasse = true;
        this.cartToSave.deliveryToRiviera = false;
      }
    }
   /**
   * Set Data onglet Livraison in Cart
   */
    prepareDeliveryToSave(dataDelivery){
      //======================DeliveryMode==================
      const deliveryModeKey = !isNullOrUndefined(dataDelivery.modeLivraison)
      && !isNullOrUndefined(dataDelivery.modeLivraison.key) ? 
      dataDelivery.modeLivraison.key : dataDelivery.modeLivraison;
      const deliveryMode : ReferenceDataVO = {key: deliveryModeKey} as ReferenceDataVO;
      this.cartToSave.deliveringModeRef = deliveryMode;
      this.forceToParnasseOrReveira(deliveryMode.key);
      //======================================================
      this.cartToSave.stockToUse = dataDelivery.stockPreleve;
      this.cartToSave.contactMobilePhoneNumber = dataDelivery.phoneContact;
      this.cartToSave.desiredDate = new Date(dataDelivery.dateDeliveryControl);
      //======================DesiredTime==================
      const keyDesired = !isNullOrUndefined(dataDelivery.creneauDeliveryControl ) &&
      !isNullOrUndefined(dataDelivery.creneauDeliveryControl.key) ? 
      dataDelivery.creneauDeliveryControl.key : dataDelivery.creneauDeliveryControl;
      const refDesiredTime : ReferenceDataVO = {key: keyDesired} as ReferenceDataVO;
      this.cartToSave.refDesiredTime = refDesiredTime;
      //=========================================================
      this.cartToSave.dateAndTimeToAvoid = dataDelivery.aeviterDeliveryControl;
      //======================CoachToNotify==================
      const idNotifCoach = !isNullOrUndefined(dataDelivery.notifCoachControl) &&
       !isNullOrUndefined(dataDelivery.notifCoachControl.id) ? 
      dataDelivery.notifCoachControl.id : dataDelivery.notifCoachControl;
      const coach : UserVO = {id: idNotifCoach} as UserVO;
      this.cartToSave.coachToNotify = coach;
      //=======================================================
      this.cartToSave.deliveryPostalAddressNewVo = dataDelivery.addressDeliveryObject;
      //==========================confirmationSMS ================
     if(!isNullOrUndefined(dataDelivery.smsControl)){
      this.cartToSave.confirmationSMS = dataDelivery.smsControl;
     }
     //=======================================================
      this.cartToSave.isRecover = dataDelivery.isDeliveryHardware;
      this.cartToSave.contactForDelivery = dataDelivery.contactreceptionnerLivraison;
      
     }
    
         /**
     * Set les données de l'onglet Devis
     */
    prepareDevisForSave(dataDevis){
     this.cartToSave.quotationPostalAddressId = 
     !isNullOrUndefined(dataDevis.addressDevisObject) &&
      !isNullOrUndefined(dataDevis.addressDevisObject.id) ? dataDevis.addressDevisObject.id : dataDevis.addressDevisObject ;
      this.cartToSave.quotationDescription = dataDevis.descriptif;
      this.cartToSave.quotationPostalAddressNewVo = dataDevis.addressDevisObject;
      this.cartToSave.parkItemId = !isNullOrUndefined(dataDevis.associetedLine) &&
      !isNullOrUndefined(dataDevis.associetedLine.id) ? 
      dataDevis.associetedLine.id : dataDevis.associetedLine;
      this.cartToSave.interventionOnLine = dataDevis.interventionOnLine;
    }

    /**
   * Set les données de l'onglet Facturation
   */
    prepareBillingToSave(dataBilling){
      if(!isNullOrUndefined(dataBilling.billAccountObject) 
      && !isNullOrUndefined (dataBilling.billAccountObject.billAccountIdentifier)){
        this.cartToSave.billAccountId =  dataBilling.billAccountObject.billAccountIdentifier;
        this.cartToSave.billAccountNicheIdentifiant  =  dataBilling.billAccountObject.billAccountNicheIdentifiant;
      }
    }

    /**
     * set les données de l'onglet article
     */

    prepareCartItemToSave(cartItemList){
      const items =  []
      if(!isNullOrUndefined(cartItemList.cartItems)){
        cartItemList.cartItems.forEach((item) => {
          if(isNullOrUndefined(item.discount)){
            item.discount = 0;
          }
          if(!isNullOrUndefined(this.cartToSave.id)){
            item.cartId =this.cartToSave.id
          }
          items.push(item);
        });
      }
      
      if(!isNullOrUndefined(cartItemList.deletedItems)){
        cartItemList.deletedItems.forEach((itemDeleted) => {
          items.push(itemDeleted);
        });
      }
      this.cartToSave.items = items;
    
     }
    /**
   * Set les données de l'onglet SAV Mobile
   */
  prepareSavToSave(dataSav,isRecover){
    const cartSav = !isNullOrUndefined(dataSav.cartSavObject) ? 
    dataSav.cartSavObject : {} as CartSavVO;
   if(!isNullOrUndefined(this.cart) && !isNullOrUndefined(this.cart.request)){
    cartSav.requestId = this.cart.request.id;
   }
    if(isNullOrUndefined(isRecover)){
      cartSav.isRecover = false;
    }
    else{
      cartSav.isRecover = isRecover;
     
    }
    if(dataSav.serialSelect === 'autre'){
      cartSav.hardwareParkItemId = null;
      cartSav.isOtherHardware = true;
      cartSav.description =  dataSav.descriptionText;
      cartSav.serial = dataSav.numeroSerieInput;
      cartSav.manufacturerId = !isNullOrUndefined(dataSav.manufacturerSelect) && 
      !isNullOrUndefined(dataSav.manufacturerSelect.id) ? dataSav.manufacturerSelect.id : null;
    } else if(!isNullOrUndefined(dataSav.serialSelect)){
        cartSav.hardwareParkItemId =!isNullOrUndefined(dataSav.serialSelect.id) ? dataSav.serialSelect.id : null;
        cartSav.description =  !isNullOrUndefined(dataSav.serialSelect.productLabel) ? dataSav.serialSelect.productLabel : '';
        cartSav.manufacturerId =  !isNullOrUndefined(dataSav.serialSelect.manufacturerId) ? dataSav.serialSelect.manufacturerId : null;
        cartSav.serial = dataSav.serialSelect.serial;
    } else {
      cartSav.hardwareParkItemId = null;
      cartSav.isOtherHardware = false;
      cartSav.description =  dataSav.descriptionText;
      cartSav.serial = dataSav.numeroSerieInput;
      cartSav.manufacturerId = !isNullOrUndefined(dataSav.manufacturerSelect) && 
      !isNullOrUndefined(dataSav.manufacturerSelect.id) ? dataSav.manufacturerSelect.id : null;
    } 

    if(dataSav.parcImpacteSelect === 'autre'){
      cartSav.parkItemId = null;
      cartSav.isOtherParkItem = true;
    }
    else{
      cartSav.parkItemId = !isNullOrUndefined(dataSav.parcImpacteSelect) && !isNullOrUndefined(dataSav.parcImpacteSelect.id) 
      ? dataSav.parcImpacteSelect.id : null;
      cartSav.isOtherParkItem = false;
    }   
    this.getCartSavToSave(cartSav);
      
  }
    /**
     * Annuler les modifcation
     * Mettre à jour le recap 
     * set la valeur du panier à sauvgarder à l'ancien état
     */
    cancel(){
      this.clickCancelBtn = !this.clickCancelBtn; 
      this.changeDRef.detectChanges(); 
      this.cartCreationService.isFromCancel = true;
    
    this.winGsmService.checkAvailabilityOfItemsAlpha(this.Oldcart.items).subscribe( data => {
       this.stocksDisponibility = data;
      });
      this.router.navigate(
       [this.customerDashboard, this.customerId,'cart', 'creation', this.cart.request.id],
    {
       queryParams: { 
         formCatalog: "no",
         typeCustomer: this.typeCustomer,
         parcours: this.cart.request.requestType.label,
         onglet : this.currentTabIndex
         
       },
       queryParamsHandling: 'merge'
     }
   );     
      this.openSnackBar('Les modifications ont été annulées');
    }

    /** Sauvgarde de CartSav */
    getCartSavToSave(cartSAV){
     if(this.isAssurance || this.isAssistanceSAVMobile){
   
        this.cartSAVService.saveOrUpdateCartSAV(cartSAV).subscribe(
        
          _data => {
            if(_data){
              this.cartSAVResultAfterSave = _data;
            }
      
          console.log('cart Sav saved');
          },
         
        );
      
     }
     
     
    }

   
    /** Initiation Validation + validation et Save Panier */
    saveServiceCall(cartToSave){
      this.catalogeService.saveOrUpdateCart(cartToSave).subscribe(
        _data => {
          if(_data){
            this.cartId = _data.id;
            this.isCartChanged = false;
            this.billAccountId = _data.billAccountId;
            this.cartToSave =  _data;
            this.router.navigate(
              [this.customerDashboard, this.customerId,'cart', 'creation', this.cart.request.id],
           {
              queryParams: { 
                typeCustomer: this.typeCustomer,
                parcours: _data.request.requestType.label,
                onglet :  this.currentTabIndex

              },
              queryParamsHandling: 'merge'
            }
          );
            this.openSnackBar('Le Panier a été bien  mis  à  jour');
          }    
        },
        _error =>  { console.log(' error save Cart')},
        () => {
          console.log('hi complete')
          this.notificationService.setShowButton(true);
          sessionStorage.setItem('initStock' , 'no');
        }
        );
   }
  

   
    
    /** SNACK BAR */
     openSnackBar(text: string): void {
       this._snackBar.open(
         text, undefined, 
         { duration: 3000, panelClass: ['center-snackbar', 'snack-bar-container'] });
     }

      
     
    /** Validation formulaire */
  validator(): boolean {
      if (this.commentInvalid || this.discountInvalid || this.discountInvalidForNegativePrice || this.stockPreleveInvalid || this.coachInvalid 
        || this.descriptifInvalid || this.mobileCantactInvalid || this.adresseDeliveryInvalid
        || this.adresseDevisInvalid || this.datedesiredInvalid || this.contactPourReceptionnerInvalid
        || this.contactPourReceptionnerInvalid || this.receptionerComboInvalid || this.destinationInvalid
        || this.adresseDevisSaisieInvalid || this.adresseDeliverySaisieInvalid
        ) {
          this.invalidForm = true;
         }else {
           this.invalidForm = false;
         }
     return this.invalidForm;
    }



    /** initaition des validateurs */
     initValidator(): void {
      this.invalidForm = false;
      this.showDicountError = false;
      this.showDiscountInvalidForNegativePriceError = false;
      this.showCommentError = false;
      this.showStockError = false;
      this.showCoachError = false;
      this.showadresseDevisError =false;
      this.showadresseDeliveryError = false;
      this.showadresseDeliverySaisieError = false;
      this.showadresseDevisSaisieError = false;
      this.showdatedesiredError = false;
      this.showmodeDeliveryError = false;
      this.showcontactPourReceptionnerError = false
      this.showReceptionerComboError = false;
      this.showDestinationError = false;
      this.coachInvalid = false;
      this.stockPreleveInvalid = false;
      this.mobileCantactInvalid = false;
      this.descriptifInvalid = false;
      this.adresseDevisInvalid =false;
      this.adresseDeliveryInvalid = false;
      this.adresseDeliverySaisieInvalid = false;
      this.adresseDevisSaisieInvalid = false;
      this.datedesiredInvalid = false;
      this.modeDeliveryInvalid = false;
      this.receptionerComboInvalid= false;
      this.contactPourReceptionnerInvalid = false
      this.showMobileContactError = false;
      this.showDescriptifError = false;
      this.destinationInvalid = false;
      this.commentInvalid = false;
      this.discountInvalid = false;
      this.discountInvalidForNegativePrice = false;
    }

public findInvalidControlsInArticles(formArticle){
  if(!isNullOrUndefined(formArticle.cartItems)){
    formArticle.cartItems.forEach((item,index) => {
    if(item.commentMandatory  && (!item.comment || item.comment === '' )){
      this.commentInvalid = true;
    }
    if(Number(item.unitPriceHt) > 0){
      if((Number(item.discount) > Number(item.unitPriceHt))){
        this.discountInvalid = true;
      }
    }else{
      if(Number(item.unitPriceHt) < 0 && Number(item.discount) > 0){
          this.discountInvalidForNegativePrice = true;
      }
    }
  });
}
}
// ===== TEST is the are only SERVICE article  
        isStockPreleveRequired(){
          this.isStockRequired = false;
         const cartItemList = this.form.getRawValue().article;
          if(!isNullOrUndefined(cartItemList.cartItems)){
            cartItemList.cartItems.forEach((item,index) => {
             const isMateriel = item.nomenclature.nomenclatureId.toString().startsWith("2");
             if(isMateriel){
              this.isStockRequired = true;
             }
            });
          }
        }
// VALIDATE CONTROLS DELIVERY AND DEVIS
public findInvalidControls(form) {
  this.isStockPreleveRequired();
  const invalid = [];
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        if(name !== 'stockPreleve'){
          invalid.push(name);
        }
        else{
          if( this.isStockRequired){
            invalid.push(name);
          }
        }
        switch (name) {
          case 'stockPreleve':
            this.stockPreleveInvalid =  this.isStockRequired ? true : false;
          break;
          case 'address':
            this.adresseDeliveryInvalid = true;
          break;
          case 'addressDeliveryObject':
            this.adresseDeliverySaisieInvalid = true;
          break;
          case 'addressDevisObject':
            this.adresseDevisSaisieInvalid = true;
          break;
          case 'phoneContact':
            this.mobileCantactInvalid = true;  
          break;
          case 'modeLivraison':
            this.modeDeliveryInvalid = true;
          break;
          case 'receptionnerControl':
            this.receptionerComboInvalid = true;
          break;
          case 'dateDeliveryControl':
            this.datedesiredInvalid = true;
          break;
          case 'notifCoachControl':
            this.coachInvalid = true;
          break;
          case 'notifCoachControl':
            this.coachInvalid = true;
          break;
          case 'descriptif':
            this.descriptifInvalid = true;
          break;
          case 'destination':
            this.destinationInvalid = true;
          break;
          case 'addressDevis':
            this.adresseDevisInvalid = true;
          break;
          case 'receptionnerControl':
            this.receptionerComboInvalid = true;
          break;
          default:
              console.log("No such control exist!");
            break;
  
      }
  }}
  this.inValidFiledsNumber = invalid.length;
  this.checkDeliveryForm();
  this.checkDevisForm();
  return invalid;
}

getIsRecover(event){
  this.isRecoverSav = event;
}

changeTitleInput($event){
  this.isCartChanged = true;
   this.notificationService.setShowButton(false);
 } 

 changePrioritized(event){
  this.isCartChanged = true;
   this.notificationService.setShowButton(false);
 }

 /**
  * @author YFA
  * @param event
  * check if basket has an article with SupscriptionPeriodicity equal ACTE
  */
 onCheckArticleSupscriptionPeriodicityEvent(event){
  this.hasArticleSupscriptionPeriodicityEqualACTE = event;
 }


 forwardToDetailRequest(): void {
  this.router.navigate(
      [this.customerDashboard, this.customerId, 'detail', 'request', this.cart.request.id],
      {
        queryParamsHandling: 'merge'
      }
    );
  }

  onLoadingLogisticData(loading: boolean): void {
    this.loading = loading;
  }
} 
