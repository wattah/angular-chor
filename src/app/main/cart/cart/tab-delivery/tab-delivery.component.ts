import { firstNameFormatter, fullNameFormatter } from '../../../../_core/utils/formatter-utils';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormGroupDirective, ControlContainer } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, first} from 'rxjs/operators';
import { ReferenceDataTypeService, ParcLigneService, GassiMockLoginService, ContactMethodService, UserService } from '../../../../_core/services';
import { ReferenceDataVO, UserVo, CartVO, Person } from '../../../../_core/models';
import { ActivatedRoute } from '@angular/router';
import { PostalAdresseVO } from '../../../../_core/models/postalAdresseVO';
import { StoreWinGsmVO } from '../../../../_core/models/store-win-gsm-vo';
import { ROLE_INTERLOCUTOR, TYPE_CM_INTERLOCUTOR, CONSTANTS, CM_MEDIA_REF_KEY } from '../../../../_core/constants/constants';
import { CustomerParkItemVO } from '../../../../_core/models/customer-park-item-vo';
import { capitalize, isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { WinGsmService } from '../../../../_core/services/win-gsm.service';
import { SharedDataDeliveryCartVo } from '../../../../_core/models/shared-data-delivery-cart-vo';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from '../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { CartService } from '../../../../_core/services/cart.service';
import { LogoPopUpComponent } from '../../../_shared/logo-pop-up/logo-pop-up.component';
import { NotificationService } from '../../../../_core/services/notification.service';
import { DatePipe } from '@angular/common';
import { FormStoreManagementService } from '../tab-article/from-store-management.service';
import { CartCreationService } from '../cart-creation.service';
import { PopAddAddressComponent } from '../../../_shared/pop-add-address/pop-add-address.component';
import { getDecryptedValue } from '../../../../_core/utils/functions-utils';
import { InterlocutorVO } from '../../../../_core/models/interlocutor-vo';

@Component({
  selector: 'app-tab-delivery',
  templateUrl: './tab-delivery.component.html',
  styleUrls: ['./tab-delivery.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class TabDeliveryComponent implements OnInit , OnChanges {

  notifCoachControl = new FormControl();
  modeLivraison: string;
  receptionnerControl = new FormControl();
  stockPreleve = new FormControl();
  phoneContact = new FormControl();
  isDeliveryHardware = new FormControl();
  address = new FormControl();
  refs: ReferenceDataVO[];
  deliveryTimes: ReferenceDataVO[];
  adresseRdv: PostalAdresseVO[];
  parkItems: CustomerParkItemVO[];
  separator = ' ';
  stocks: StoreWinGsmVO[] = [];
  customerId: string;
  showReception = true;
  showAdresse = true;
  showSms = false;
  showContactRecepLivraison = false;
  
  //
  withLogo: any;
  cartId: number;
  showDownloadButton = false;

  cart: CartVO = {} as CartVO;
  userConnected: UserVo;
  receptions : UserVo[] = [];
  reception: UserVo = {} as UserVo;
  interlocutors: Person[];
  person: Person;
  interlocutorsAsString: Array<{name:string , id:number}>;
  autre: {name:string , id:number} = {} as {name:string , id:number};
  filteredNotifOptions: Observable<UserVo[]>;
  filteredRecepOptions: Observable<UserVo[]>;
  filteredPersons: Observable<Array<{name:string , id:number}>>;
  minDeliveryWishDate: Date;
  desiredDate : Date;
  idDeliveryMode: number;
  iDeliveryTime: number;
  idParkToSelect : number;
  parcoursKey : any;
  sharedDataDeliveryCartVoNew : SharedDataDeliveryCartVo = {} as SharedDataDeliveryCartVo;
   @Output() onCheckDeliveryFormValidation: EventEmitter<boolean> = new EventEmitter<boolean>();
   @Output() onCheckDeliveryModification: EventEmitter<boolean> = new EventEmitter<boolean>();
   @Output() sharedDataDeliveryCartVo: EventEmitter<SharedDataDeliveryCartVo> = new EventEmitter<SharedDataDeliveryCartVo>();
   @Input() visibleActionsOnLivraison;
   @Input() initPrelevementStock;
   @Input() stocksDisponibility;
   @Input() visibleActionsForCoachAndDesk;

  cartToSaveDelivery : CartVO;

  @Input() clickCancelBtn= false;
  @Input() isRecoverSav= false;
  @Input() isAssistanceSAVMobile;
  @Input() isRequestSav;

  coachList: UserVo[] = [];
  @Output() cancelDone : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isChildFormValid: EventEmitter<any> = new EventEmitter<any>();
 form;
 initStock = 'no';
 isChangedAfterSave = false;
 @Input() formsSubmitted = false;
 @Input() visibleActionsOnSAV;
 listMobile : InterlocutorVO[] =  [];
 listMobileAsync:  Observable<InterlocutorVO[]>;
 
 personIdWithReceLivraison: number;
 isStockRequired = true;
 readonly SMS_CONTROL = 'smsControl';
  DELIVERY = 'delivery';
  MODE_LIVRAISON = 'modeLivraison';
  readonly COACH = 'COACH'
  PHONE_CONTACT = 'phoneContact';
  STOCK_PRELEVE = 'stockPreleve';
  ASSISTANT_SAV_MOBILE = 'Assistance SAV mobile';
  addressReel: PostalAdresseVO;

  constructor(private readonly referenceDataTypeService: ReferenceDataTypeService,
    private readonly route: ActivatedRoute,
    private readonly parcLigneService: ParcLigneService,
    private readonly mockLoginService: GassiMockLoginService,
    private readonly winGsmService: WinGsmService,
    private readonly contactMethodService: ContactMethodService,
    private readonly formStoreManagementService: FormStoreManagementService,
    private readonly _formBuilder: FormBuilder,
    private readonly  modalService: NgbModal,
    private readonly confirmationDialogService: ConfirmationDialogService, 
    private readonly cartService: CartService,
    readonly notificationService: NotificationService,
    private readonly datePipe: DatePipe,
    public parent: FormGroupDirective,
    private readonly userService : UserService,
    private readonly cartCreationService:CartCreationService
    ) { 
      /* check if cart is successfully saved then show download button */
    this.notificationService.getShowButton().subscribe((data) => {
      this.showDownloadButton = data;
    });

    this.form  = new   FormGroup({});
    
    }
    
    ngOnChanges(change: SimpleChanges){
      if(change['visibleActionsOnSAV']){
        this.setRestriction();
      }
      if(change['visibleActionsOnLivraison']){
        this.checkForm(); 
            
      } 
      if(!isNullOrUndefined(this.form.get('delivery')) && change['initPrelevementStock']){  
          this.form.get('delivery').get('stockPreleve').setValue(null); 
          this.isStockPreleveRequired();
          if(!this.isStockRequired){
            this.form.get('delivery').get('stockPreleve').setValidators(null);
            this.form.get('delivery').get('stockPreleve').updateValueAndValidity();
          }
          else{
            this.form.get('delivery').get('stockPreleve').setValidators(Validators.required);
            this.form.get('delivery').get('stockPreleve').updateValueAndValidity();
          }
      }

      if(!isNullOrUndefined(this.form.get('delivery')) && change['stocksDisponibility']){   
        this.stocks = this.stocksDisponibility; 
      }

        if(!isNullOrUndefined(change['isRecoverSav'])
        && !change['isRecoverSav'].isFirstChange() &&  change['isRecoverSav']){
          this.form.get('deliveryHardware').get('isDeliveryHardware').setValue(this.isRecoverSav);
          }
          if(change['formsSubmitted'] && this.formsSubmitted 
          && this.parcoursKey !== this.ASSISTANT_SAV_MOBILE){
            this.setInValidToDeliveryFields();    
          }
    }

    private setRestriction() {
      if(!isNullOrUndefined(this.form.get('deliveryHardware'))){
      if( this.visibleActionsForCoachAndDesk ){
        this.form.get('deliveryHardware').enable();
      }else{
        this.form.get('deliveryHardware').disable();
      }
    }
    }
    
    private setInValidToDeliveryFields() {
      if(this.parcoursKey !== this.ASSISTANT_SAV_MOBILE){
        const controls = this.form.get('delivery').controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            controls[name].markAsTouched({ onlySelf: true });
            controls[name].markAsDirty({ onlySelf: true });
          }
        }
      }else{
        this.onCheckDeliveryFormValidation.emit(true);
      }
    }

  private checkForm() {
    if (this.visibleActionsOnLivraison ) {
      if(this.form.get('delivery')){
        this.form.get('delivery').clearValidators();
        this.form.get('delivery').updateValueAndValidity();
        this.form.get('delivery').disable();
      }
    }else {
      if(this.form.get('delivery')){
        this.form.get('delivery').enable();
        this.form.get('delivery').setValidators([Validators.required]);
        this.form.get('delivery').updateValueAndValidity();
      }
    }
  }


  ngOnInit() {
    
    this.form = this.parent.form;
    this.initStockWhenAddingArticle();
    this.form .addControl('deliveryHardware', new FormGroup({
      isDeliveryHardware: this._formBuilder.control(null),
    }))
    this.form .addControl('delivery', new FormGroup({
      stockPreleve: this._formBuilder.control(null , Validators.required),
      modeLivraison: this._formBuilder.control(null,  Validators.required),
      address: this._formBuilder.control(null , Validators.required),
      addressDeliveryObject: this._formBuilder.control(null , Validators.required),
      receptionnerControl: this._formBuilder.control(null , Validators.required),
      phoneContact: this._formBuilder.control(null , Validators.required),
      notifCoachControl: this._formBuilder.control(null , Validators.required),
      dateDeliveryControl : this._formBuilder.control(null , Validators.required),
      creneauDeliveryControl : this._formBuilder.control(null),
      aeviterDeliveryControl : this._formBuilder.control(null),
      smsControl : this._formBuilder.control(null),
      contactreceptionnerLivraison: this._formBuilder.control(null)
    }))
    this.setRestriction();
    this.checkForm(); 
    this.onCheckDeliveryFormValidation.emit(false);
    this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('DELIVERY_MODE',1).subscribe( data => {
      this.refs = this.cartCreationService.formattedListModeDelivery(data);
      this.initModeDelivery(data);
      this.getUserConnected()
    });

    this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('DELIVERY_TIME',1).subscribe( data => {
      this.deliveryTimes = data;
      this.initDeliveryTime();

    });

    this.route.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
      this.initListMobile();
    });
    this.getParkItems(this.customerId);
    this.route.data.subscribe(resolversData => {
    const carts: CartVO[] = resolversData['carts'];
    if(!isNullOrUndefined(carts) && carts.length > 0) {
      this.cart = carts[0];
      if(this.cart.id){
        this.showDownloadButton = true;
      }
      this.cartToSaveDelivery = this.cart;
      this.minDeliveryWishDate = new Date(this.cart.createdAt);
      this.winGsmService.checkAvailabilityOfItems(this.formStoreManagementService.cartItems).subscribe( data => {
        this.stocks = data;
        this.initDataDelivery();
        if(!isNullOrUndefined(this.cart.coachToNotify)) {
          this.form.get('delivery').get('notifCoachControl').setValue(this.cart.coachToNotify);
        }
      });
    }
    this.interlocutors =resolversData['interlocutors'];
    this.restoreInterlocuteursAfterCancel();
    this.interlocutorsAsString = this.interlocutors.map((interlocutor)=>this.formatInterlocutor(interlocutor));
    });

    this.userService.usersByRole(this.COACH, 1).subscribe((data) => {
      this.coachList = data;
      if (this.coachList) {
      this.coachList.forEach( (item, index) => {
        if(item.useChorniche === false) this.coachList.splice(index,1);
      })
         this.coachList.sort((a, b) => a.lastName.localeCompare(b.lastName) ) ;
       } 
      this.filteredNotifOptions = this.form.get('delivery').get('notifCoachControl').valueChanges
      .pipe(
        startWith(''),
        map(name => name ? this._filter(name) : this.coachList.slice())
      );   
    });
    this.filteredPersons = this.receptionnerControl.valueChanges
    .pipe(
      startWith(''),
      map(option => option ? this._filterInterlocutor(option) : this.interlocutorsAsString.slice())
    );
     this.initReceAndAdress();
    this.notifyWhenDeliveryFromIsValid();
    this.route.queryParamMap.subscribe((params) => {
      this.parcoursKey = params.get('parcours');
    });
  }
  

 
  initStockWhenAddingArticle() {
    this.initStock = sessionStorage.getItem('initStock')
  }
//=================== Restore Interlocuteurs ===============
  restoreInterlocuteursAfterCancel(){
    this.route.data.subscribe((resolveData) => {
      this.interlocutors = resolveData['interlocutors'];
      this.cartCreationService.restoreInterlocuteurs(resolveData['interlocutors']);
    });
   }

   initListMobile(): void {
     this.contactMethodService.getContactMethodsByCustomerIdAndRefMedia(Number(getDecryptedValue(this.customerId)),
      CM_MEDIA_REF_KEY.TEL_MOBILE).subscribe(
       data => {
           data.forEach(ref =>{
             if(!isNullOrUndefined(ref.contactTypeKey) && this.isMobileProOrPrinOrTempOrSeco(ref.contactTypeKey)) {
              this.listMobile.push(ref);
             }
         });
         this.listMobileAsync = this.form.get(this.DELIVERY).get(this.PHONE_CONTACT).valueChanges.pipe(
          startWith(''),
          map(mobile => mobile ? this.filterMobile(mobile) : this.listMobile.slice())
        );
       });
       
   }
   private filterMobile(value: any): InterlocutorVO[] {
    const filterValue = this.normalizeValue(value);
    return this.listMobile.filter(mobile => this.normalizeValue(mobile.value).includes(filterValue));
  }

  private normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

   isMobileProOrPrinOrTempOrSeco(type: string): boolean {
       if(type === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key ||
          type === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key ||
          type === TYPE_CM_INTERLOCUTOR.TEMPORAIRE.key ||
          type === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key ) {
            return true
          }
     return false;
   }
  /**
   * this bloc is for downloading InstallationPV
   * */
  blobToArrayBuffer(base64: any): any {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  saveResponseFileAsPdf(reportName: any, byte: any): any {
    const blob = new Blob([byte], { type: 'application/pdf' });
    const fileURL = window.URL.createObjectURL(blob);
    window.open(fileURL);
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = fileURL;
    link.download = reportName;
    link.click();
  }

  downloadPV(): any {
    this.cartId = this.cart.id;
    this.modalService.open(LogoPopUpComponent, { centered: true });
    this.notificationService.getWithLogo().pipe(first()).subscribe((response) => {
      this.cartService.generateInstallationPv(this.cartId, response.toString() ).subscribe((data) => {
        const filePdf = this.blobToArrayBuffer(data.document);
        this.saveResponseFileAsPdf(data.name, filePdf);
      });
    });

  }

  initModeDelivery(referenceDatas: ReferenceDataVO[]){
    if(!isNullOrUndefined(this.cart.deliveringModeRef ) && this.cart.deliveringModeRef.id !== null) {
      this.idDeliveryMode = this.cart.deliveringModeRef.id;
      const deliver = referenceDatas.find((x) => x.id ===  this.cart.deliveringModeRef.id);
      if(!isNullOrUndefined(deliver)){
        this.modeLivraison = deliver.label; 
        this.form.get('delivery').get('modeLivraison').setValue(deliver); 
      }
    }
  }
  initDeliveryTime(){
    if(!isNullOrUndefined(this.cart.refDesiredTime ) && this.cart.refDesiredTime.id !== null) {
      this.iDeliveryTime = this.cart.refDesiredTime.id;
      const time = this.deliveryTimes.find((x) => x.id ===  this.cart.refDesiredTime.id);
      this.form.get('delivery').get('creneauDeliveryControl').setValue(time);
    }
  }
  initDataDelivery(){
    if(!isNullOrUndefined(this.cart.contactMobilePhoneNumber) && this.cart.contactMobilePhoneNumber !== '') {
      const isExist = this.isExistMobile(this.listMobile, this.cart.contactMobilePhoneNumber);
      if(!isExist){
        this.listMobile.unshift(this.interlocutorVOByMobileCart(this.cart.contactMobilePhoneNumber));
      }
      this.form.get('delivery').get('phoneContact').setValue(this.cart.contactMobilePhoneNumber);
    }
    if(!isNullOrUndefined(this.cart.contactForDelivery) && this.cart.contactForDelivery !== '') {
      this.form.get('delivery').get('contactreceptionnerLivraison').setValue(this.cart.contactForDelivery);
    }
    if(!isNullOrUndefined(this.cart.desiredDate)) {
      this.desiredDate = new Date(this.datePipe.transform(this.cart.desiredDate ? 
        this.cart.desiredDate : new Date(), CONSTANTS.FORMAT_DATE));
    }
  
    if(!isNullOrUndefined(this.cart.dateAndTimeToAvoid)) {
      this.form.get('delivery').get('aeviterDeliveryControl').setValue(this.cart.dateAndTimeToAvoid);
    }
    if(!isNullOrUndefined(this.cart.stockToUse) && this.initStock !== 'yes') {
      this.form.get('delivery').get('stockPreleve').setValue(this.cart.stockToUse);
    }
    this.form.get('deliveryHardware').get('isDeliveryHardware').setValue(this.isRecoverSav);
  }

  isExistMobile(listMobile: InterlocutorVO[], value) : boolean {
    for(const mobile of listMobile) { 
      return mobile.value === value;
    }
    return false;
  } 
  private notifyWhenDeliveryFromIsValid() {
    this.isStockPreleveRequired();
    if(!this.isStockRequired){
      this.form.get('delivery').get('stockPreleve').setValidators(null);
      this.form.get('delivery').get('stockPreleve').updateValueAndValidity();
    }
    else{
      this.form.get('delivery').get('stockPreleve').setValidators(Validators.required);
      this.form.get('delivery').get('stockPreleve').updateValueAndValidity();
    }
    this.form.get('delivery').valueChanges.subscribe((data) => {
        this.onCheckDeliveryFormValidation.emit(this.form.get('delivery').valid);
        if(this.form.get('delivery').dirty){
          this.onCheckDeliveryModification.emit(true);
          this.notificationService.setShowButton(false);
        } 
       
        
    });
    this.form.get('deliveryHardware').valueChanges.subscribe((data) => {
      this.onCheckDeliveryFormValidation.emit(this.form.get('deliveryHardware').valid);
      if(this.form.get('delivery').dirty){
        this.onCheckDeliveryModification.emit(true);
        this.notificationService.setShowButton(false);
      } 
     
      
  });
  }

  initReceAndAdress() {
    this.showContactRecepLivraison = false;

    this.form.get('delivery').get('address').setValidators(Validators.required);
    this.form.get('delivery').get('address').updateValueAndValidity();
   
    if(this.cart && this.cart.deliveryPostalAddressNewVo && this.cart.deliveryPostalAddressNewVo.personId){
      this.interlocutorsAsString.forEach((interlocuteur)=> {
         if(interlocuteur.id  && this.cart.deliveryPostalAddressNewVo.personId === interlocuteur.id){
             this.form.get('delivery').get('receptionnerControl').setValue(interlocuteur.name);
             this.onChosePerson(interlocuteur,false);
          }
      });
    }
    else {
      const beneficiaire = this.interlocutorsAsString.filter((interlocutor) =>
      interlocutor.name.includes(ROLE_INTERLOCUTOR.ROLE_BENEFICIARE.value))[0];
        if(beneficiaire){
          this.form.get('delivery').get('receptionnerControl').setValue(beneficiaire.name);
          this.onChosePerson(beneficiaire,false);
    }
    }
    if(!isNullOrUndefined(this.cart.deliveryPostalAddressNewVo)){
      this.setAddressById(this.cart.deliveryPostalAddressNewVo.id)
    }
  }

  

  setAddressById(deliveryPostalAddressId: number) {
    this.contactMethodService.getAddressById(deliveryPostalAddressId).subscribe(
      (address)=>{
        this.form.get('delivery').get('addressDeliveryObject').setValue(this.cartCreationService.formatAddressToDelivery(address, 
           this.form.get(this.DELIVERY).get(this.MODE_LIVRAISON).value,
           this.form.get(this.DELIVERY).get('stockPreleve').value));
        if(address && address.types){
          this.form.get('delivery').get('addressDeliveryObject').setValue(this.cartCreationService.formatAddressToDelivery(address, 
            this.form.get(this.DELIVERY).get(this.MODE_LIVRAISON).value,
            this.form.get(this.DELIVERY).get('stockPreleve').value));
          this.form.get('delivery').get('address').setValue(`Adresse ${address.types[0].label}`)
          this.onChoseAddress(address);
        }
       
      }
    );
  }
  /**
   * rework avant moyen contact
   */

  initReceptionList(): void {
    this.autre.name = 'AUTRE';
    this.autre.id = 0;
    this.interlocutorsAsString.push(this.autre);
  }


  displayRecep(user: {name:string , id:number}): string {
    return user ? `${capitalize(user.name)}` : '';
  }

  displayFn(user: UserVo): string {
    return user ? fullNameFormatter(null , user.firstName , user.lastName  , ' ') : '';
  }

  private _filter(name: any): UserVo[] {
    const filterValue = typeof name === 'string' ? name.toLowerCase() : '';
    return this.coachList.filter(option => option.lastName.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterInterlocutor(name: string): Array<{name:string , id:number}> {
    const filterValue = name.toLowerCase();
    return this.interlocutorsAsString.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }


  private _filterRecep(name: string): UserVo[] {
    const filterValue = typeof name === 'string' ? name.toLowerCase() : '';
    return this.receptions.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0);
  }

  onModeLivraison(event: any,modeLivr) {
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;  
    this.sharedDataDeliveryCartVoNew.modeDelivery =  selectElementText;
    this.sharedDataDeliveryCartVo.emit(this.sharedDataDeliveryCartVoNew);
  }


  
  autreSelectedValue(){
    this.form.get('delivery').get('address').setValidators(null);
    this.form.get('delivery').get('address').updateValueAndValidity();
    this.form.get('delivery').get('addressDeliveryObject').setValidators(null);
    this.form.get('delivery').get('addressDeliveryObject').updateValueAndValidity();
    this.showAdresse = false;
   
  }

  getUserConnected(){
    const NAME_OF_ROLE = "ADMINISTRATEUR";
    this.mockLoginService.getCurrentConnectedUser().subscribe((user) => {
      if (user !== null &&  user.activeRole !==  null && user.activeRole.roleName !== null && user.activeRole.roleName === NAME_OF_ROLE) {
        this.form.get('delivery').get('receptionnerControl').disable();
      }
    });
   }

  getParkItems(customerId: string) {
    this.parcLigneService.getParkItemsFull(customerId).subscribe((data) => {
      this.parkItems = data;
      this.form.get(this.DELIVERY).get(this.SMS_CONTROL).setValue(this.cart.confirmationSMS);
    });
  }


  getFullAddress(adressPostal: PostalAdresseVO): string {
    let str = '';
    if (adressPostal.companyName !== null && adressPostal.companyName !== '') {
      str += adressPostal.companyName + this.separator;
    }
    if (adressPostal.title !== null) {
      if (adressPostal.title !== 'UNKNOWN') {
        str += `${adressPostal.title} `;
      } else {
        str += '';
      }
    }
    str += this.getcivility(adressPostal);
    str += this.separator + this.getAddress(adressPostal);
    return str;
  }


  getcivility(postalAddress: PostalAdresseVO): string {
    let str = '';
    if (postalAddress.socialTitle !== null) {
      str += `${postalAddress.socialTitle} `;
    }
    if (postalAddress.lastName !== null) {
      str += `${postalAddress.lastName} `;
    }
    if (postalAddress.firstName !== null) {
      str += `${postalAddress.firstName} `;
    }
    
    return str;
  }

  getAddress(postalAddress: PostalAdresseVO): string {
    let str = '';
    if (postalAddress.addrLine2 !== null && postalAddress.addrLine2 !== '') {
      str += postalAddress.addrLine2 + this.separator ;
    }
    if (postalAddress.addrLine3 !== null && postalAddress.addrLine3 !== '') {
      str += postalAddress.addrLine3 + this.separator ;
    }
    if (postalAddress.logisticInfo !== null && postalAddress.logisticInfo !== '') {
      str += postalAddress.logisticInfo;
    }
    if (postalAddress.addrLine4 !== null && postalAddress.addrLine4 !== '') {
      str += postalAddress.addrLine4 + this.separator ;
    }
    if (postalAddress.addrLine5 !== null && postalAddress.addrLine5 !== '') {
      str += postalAddress.addrLine5 + this.separator ;
    }
    if (postalAddress.postalCode !== null && postalAddress.postalCode !== '') {
      str += `${postalAddress.postalCode} `;
    }
    if (postalAddress.city !== null) {
      str += postalAddress.city;
    }
    if (postalAddress.cedex !== null) {
      str += ` ${postalAddress.cedex}`;
    }
    if (postalAddress.country) {
      str += this.separator + postalAddress.country.label;
    }
    return str;
  }

  afficherRecepetion(val: UserVo): string {
    if(val.roleNamesAsString !== '') {
      return `${val.firstName} - ${val.roleNamesAsString}`;
    }
    return `${val.firstName}`;
  }

  onChosePerson(person,isInInitOrChange) {
    this.adresseRdv = [];
    if(person.id === 0) {
      this.form.get('delivery').get('address').setValue('');
      this.form.get('delivery').get('address').setValidators(null);
      this.form.get('delivery').get('address').updateValueAndValidity();
      this.form.get('delivery').get('addressDeliveryObject').setValidators(null);
      this.form.get('delivery').get('addressDeliveryObject').updateValueAndValidity()
    } else {
      this.form.get('delivery').get('address').setValidators(Validators.required);
      this.form.get('delivery').get('address').updateValueAndValidity();
      this.showAdresse = true;
      this.personIdWithReceLivraison = person.id;
          this.contactMethodService.getListPostalAddress(person.id).subscribe (data => {
          this.adresseRdv = data;
          if (this.adresseRdv && this.adresseRdv.length !== 0) {
            if(isInInitOrChange){
              this.sharedDataDeliveryCartVoNew.recepientNameChangedValue =  this.adresseRdv[0];
              this.sharedDataDeliveryCartVo.emit(this.sharedDataDeliveryCartVoNew);
            } else {
              if(this.cart.deliveryPostalAddressNewVo){
                this.form.get('delivery').get('addressDeliveryObject').setValue(this.cartCreationService.formatAddressToDelivery(this.cart.deliveryPostalAddressNewVo,
                this.form.get(this.DELIVERY).get(this.MODE_LIVRAISON).value, this.form.get(this.DELIVERY).get('stockPreleve').value));
                this.form.get('delivery').get('address').setValue(`Adresse ${this.cart.deliveryPostalAddressNewVo.types[0].label}`);
              }
            }

            this.adresseRdv = this.sortAdresseRdv();
            const adresseRdvClone = this.adresseRdv.slice();
            const principalAdresse = adresseRdvClone.filter((adr) =>
              adr.types[0].label.includes(TYPE_CM_INTERLOCUTOR.PRINCIPAL.value))[0];

              if(this.cart.deliveryPostalAddressNewVo) {
                  this.form.get('delivery').get('address').setValue(this.cart.deliveryPostalAddressNewVo);
                  this.form.get('delivery').get('address').setValue(`Adresse ${this.cart.deliveryPostalAddressNewVo.types[0].label}`);
               } else if (principalAdresse) {
                  this.form.get('delivery').get('addressDeliveryObject').setValue(this.cartCreationService.formatAddressToDelivery(this.adresseRdv[0], 
                  this.form.get(this.DELIVERY).get(this.MODE_LIVRAISON).value, this.form.get(this.DELIVERY).get('stockPreleve').value));
                  this.form.get('delivery').get('address').setValue('Adresse Principal');
                  this.sharedDataDeliveryCartVoNew.addresseChangedValue =  this.cartCreationService.formatAddressToDelivery(this.adresseRdv[0], 
                  this.form.get(this.DELIVERY).get(this.MODE_LIVRAISON).value,
                  this.form.get(this.DELIVERY).get('stockPreleve').value);
                  this.sharedDataDeliveryCartVo.emit(this.sharedDataDeliveryCartVoNew);
                  this.address.setValue(this.adresseRdv[0]);
              } else {
                this.form.get('delivery').get('address').setValue('');
              }
          } else {
            this.form.get('delivery').get('address').setValue('');
          }
      })
    }
  }

  onClickPerson(person) {
    const address = 'address';
    const addressDeliveryObject = 'addressDeliveryObject';
    this.adresseRdv = [];
    this.form.get(this.DELIVERY).get(address).setValue('');
    this.form.get(this.DELIVERY).get(address).setValidators(Validators.required);
    this.form.get(this.DELIVERY).get(address).updateValueAndValidity();
    this.form.get(this.DELIVERY).get(addressDeliveryObject).setValue(null);
    this.form.get(this.DELIVERY).get(addressDeliveryObject).setValidators(Validators.required);
    this.form.get(this.DELIVERY).get(addressDeliveryObject).updateValueAndValidity();
    this.sharedDataDeliveryCartVoNew.recepientNameChangedValue =  null;
    this.sharedDataDeliveryCartVo.emit(this.sharedDataDeliveryCartVoNew);
    this.showAdresse = true;
    this.personIdWithReceLivraison = person.id;
    this.contactMethodService.getListPostalAddress(person.id).subscribe (data => {
      this.adresseRdv = data;
      if (this.adresseRdv && this.adresseRdv.length !== 0) {
        this.adresseRdv = this.sortAdresseRdv();
      } 
    });
  }
/**
 * Block saisie adresse par l'utilisateur
 */
  changeAdresseInput($event){
    if(this.form.get('delivery').dirty){
      this.form.get('delivery').get('addressDeliveryObject').setValue(null);
    }  }

  formatInterlocutor(interlocutor: Person): {name:string , id:number} {
        const result = {} as {name:string , id:number};
        const firstName = !isNullOrUndefined(interlocutor.firstName) ? interlocutor.firstName.charAt(0).toUpperCase()   
         + interlocutor.firstName.slice(1): '';
        interlocutor.lastName = interlocutor.lastName.toLowerCase();
        const lastName = interlocutor.lastName.charAt(0).toUpperCase() + interlocutor.lastName.slice(1);
        const roleLabel = interlocutor.roleLabel ? `- ${interlocutor.roleLabel}`  : '';
        result.name = `${firstName} ${ lastName }  ${roleLabel}`;
        result.id = interlocutor.idPerson;
        return result;
      }

    onChoseAddress(adresse){
      this.address.setValue(adresse);
      this.form.get('delivery').get('addressDeliveryObject').setValue(this.cartCreationService.formatAddressToDelivery(adresse,
         this.form.get(this.DELIVERY).get(this.MODE_LIVRAISON).value,
         this.form.get(this.DELIVERY).get('stockPreleve').value));
      this.sharedDataDeliveryCartVoNew.addresseChangedValue =  this.cartCreationService.formatAddressToDelivery(adresse, 
        this.form.get(this.DELIVERY).get(this.MODE_LIVRAISON).value, this.form.get(this.DELIVERY).get('stockPreleve').value);
      this.sharedDataDeliveryCartVo.emit(this.sharedDataDeliveryCartVoNew);
      
    }

    sortAdresseRdv() {
      let adresseRdvClone = this.adresseRdv.slice();
      const pricipalAdresses = adresseRdvClone.filter((adresse) =>
        adresse.types[0].label.includes(TYPE_CM_INTERLOCUTOR.PRINCIPAL.value)
      );
      adresseRdvClone = this.adresseRdv.slice();
      const professionnelAdresses = adresseRdvClone.filter((adresse) =>
        adresse.types[0].label.includes(TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.value)
      );
      adresseRdvClone = this.adresseRdv.slice();
      const secondaireAdresses = adresseRdvClone.filter((adresse) =>
        adresse.types[0].label.includes(TYPE_CM_INTERLOCUTOR.SECONDAIRE.value)
      );
      adresseRdvClone = this.adresseRdv.slice();
      const temporaireAdresses = adresseRdvClone.filter((adresse) =>
        adresse.types[0].label.includes(TYPE_CM_INTERLOCUTOR.TEMPORAIRE.value)
      );
      return [
        ...pricipalAdresses,
        ...secondaireAdresses,
        ...professionnelAdresses,
        ...temporaireAdresses,
      ];
    }

    sort(rdv1, rdv2): number {
      const label1 = rdv1.types[0].label.toUpperCase();
      const label2 = rdv2.types[0].label.toUpperCase();
      if (label1 > label2) {
        return 1;
      }
      if (label1 < label2) {
        return -1;
      }
      return 0;
    }

    onChangeStock = (event) => {
      if(event.isUserInput){
      this.sharedDataDeliveryCartVoNew.stock =  event.source.value;
      this.sharedDataDeliveryCartVoNew.addresseChangedValue =  this.cartCreationService.formatAddressToDelivery(this.address.value, 
      this.form.get(this.DELIVERY).get(this.MODE_LIVRAISON).value, event.source.value);
      this.sharedDataDeliveryCartVo.emit(this.sharedDataDeliveryCartVoNew);
    
      }
  } 

  onChangeNotificationCaoch(event) {
    
    if(event.isUserInput){
      const eventValue =  event.source.value;
      const firstName =eventValue.firstName ;
      const lastName =eventValue.lastName.toUpperCase();
      const name = `${firstName} ${ lastName }` ;
      this.sharedDataDeliveryCartVoNew.coachNameChangedValue =  name;
      this.sharedDataDeliveryCartVo.emit(this.sharedDataDeliveryCartVoNew);
    }
} 
  
changeNumber(event) {
  this.sharedDataDeliveryCartVoNew.recepientNumberContactChangedValue = event;
  this.sharedDataDeliveryCartVo.emit(this.sharedDataDeliveryCartVoNew);
}

openPopup() {
  let valueResult: PostalAdresseVO  = {} as PostalAdresseVO;
  const modal = this.modalService.open(PopAddAddressComponent, { centered: true,
    windowClass: 'custom_popup',
    size: 'lg', backdrop : 'static', keyboard: false
    });
    modal.componentInstance.personId = this.personIdWithReceLivraison;
    modal.componentInstance.customerId = this.customerId;
    modal.componentInstance.resultCmPostalAddressVO.subscribe((emmitedValue) => {
      valueResult = emmitedValue;
    });
    modal.result.then((result) => {
       if(result) {
        this.getAddressTemporaire(valueResult, true);
       }
    });
  }

  getAddressTemporaire(resultCmPostalAddressVO: PostalAdresseVO , isInInitOrChange) {
    this.form.get('delivery').get('address').setValidators(Validators.required);
      this.form.get('delivery').get('address').updateValueAndValidity();
      this.showAdresse = true;
      this.contactMethodService.getListPostalAddress(this.personIdWithReceLivraison).subscribe (data => {
        this.adresseRdv = data;
          if (this.adresseRdv && this.adresseRdv.length !== 0) {
            if(isInInitOrChange){
              this.sharedDataDeliveryCartVoNew.recepientNameChangedValue =  resultCmPostalAddressVO;
                   this.sharedDataDeliveryCartVo.emit(this.sharedDataDeliveryCartVoNew);
            }
                this.form.get('delivery').get('addressDeliveryObject').setValue(this.cartCreationService.formatAddressToDelivery(resultCmPostalAddressVO, 
                this.form.get(this.DELIVERY).get(this.MODE_LIVRAISON).value,
                this.form.get(this.DELIVERY).get('stockPreleve').value));
              this.form.get('delivery').get('address').setValue(`Adresse ${resultCmPostalAddressVO.types[0].label}`);
              this.onChoseAddress(resultCmPostalAddressVO);
          }
        });
    }

annuler(): any {
      const title = 'Erreur!';
      const comment = 'Êtes-vous sûr de vouloir annuler votre création ?';
      const btnOkText = 'Oui, j\'annule ma création';
      const btnCancelText = 'Non je reviens à ma création';
      this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText, 'lg',true)
      .then((confirmed) => console.log('User confirmed:', confirmed))
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
 }

 isStockPreleveRequired(){
  this.isStockRequired = false;
 const cartItemList = this.form.getRawValue().article;
  if(!isNullOrUndefined(cartItemList.cartItems)){
    cartItemList.cartItems.forEach((item) => {
     const isMateriel = item.nomenclature.nomenclatureId.toString().startsWith("2")
     if(isMateriel){
       
      this.isStockRequired = true;
     }
    });
  }
}

interlocutorVOByMobileCart(value: string): InterlocutorVO {
  const interlocutorVO = {} as InterlocutorVO;
  interlocutorVO.value = value;
  return interlocutorVO
}

formatterNameListMobile(interlocutorVO: InterlocutorVO): string {
  const role = `${!isNullOrUndefined(interlocutorVO.roleLabel) ? interlocutorVO.roleLabel : ''}`;
  const value = `${!isNullOrUndefined(interlocutorVO.value) ? interlocutorVO.value : ''}`;
  const contactType = `${!isNullOrUndefined(interlocutorVO.contactType) ? interlocutorVO.contactType : ''}`
  if(!isNullOrUndefined(interlocutorVO) && isNullOrUndefined(interlocutorVO.crmName)) {
     const firstName = `${!isNullOrUndefined(interlocutorVO.firstName) ? firstNameFormatter(interlocutorVO.firstName): ''}`;
     const lastName = `${!isNullOrUndefined(interlocutorVO.lastName) ? interlocutorVO.lastName.toUpperCase() : ''}`;
     return `${firstName} ${lastName} ${role} ${contactType} ${value}`
  }
  const crmName = `${!isNullOrUndefined(interlocutorVO.crmName) ? interlocutorVO.crmName : ''}`;
  return  `${crmName} ${role} ${contactType} ${value}`
}

onSelectModeDelivery(event): void {
  this.form.get(this.DELIVERY).get(this.MODE_LIVRAISON).setValue(event);
  this.sharedDataDeliveryCartVoNew.addresseChangedValue =  this.cartCreationService.formatAddressToDelivery(this.address.value, 
  event, this.form.get(this.DELIVERY).get(this.STOCK_PRELEVE).value);
  this.sharedDataDeliveryCartVoNew.modeDelivery =  event.label;
  this.sharedDataDeliveryCartVo.emit(this.sharedDataDeliveryCartVoNew);
  }
}


