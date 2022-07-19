import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CmUsageVO } from '../../../../../_core/models/cm-usage-vo';
import { PENICHE_CUSTOMER_TYPOLOGY, PERSON_CATEGORY, CM_MEDIA_REF, CM_USAGE } from '../../../../../_core/constants/constants';
import { PenicheCustomerResponseVO, PenicheTypeEnvoiLivrable } from '../../../../../_core/models/peniche-customer-response-vo';
import { firstNameFormatter } from '../../../../../_core/utils/formatter-utils';
import { OrasPostalAddress } from '../../../../../_core/models';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { OrasAddressService } from '../../../../../_core/services/oras-address.service';
import { isNullOrUndefined } from '../../../../../_core/utils/string-utils';
import { PenicheCountry } from '../../../../../_core/constants/peniche-country';
import { DatePipe } from '@angular/common';
import { ContactMethodService, GassiMockLoginService, ParcLigneService } from '../../../../../_core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerParkItemVO } from '../../../../../_core/models/customer-park-item-vo';
import { PenicheBillAccountVO } from '../../../../../_core/models/peniche-bill-account-vo';
import { NotificationService } from '../../../../../_core/services/notification.service';
import { ParkBillPenicheCustomerVO } from '../../../../../_core/models/park-bill-peniche-customer-vo';
import { ConfirmationDialogService } from '../../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-customer-peniche',
  templateUrl: './customer-peniche.component.html',
  styleUrls: ['./customer-peniche.component.scss']
})
export class CustomerPenicheComponent implements OnInit {


  isBillReport: boolean;
  customerId: string;
  formPeniche: FormGroup;
  cmBillingUsageVO: CmUsageVO;
  isCheckFrench = new FormControl();
  filteredAddress$: Observable<OrasPostalAddress[]> = null;
  filteredCountry: Observable<Array<{ data: string, label: string }>>;
  listCountry: Array<{ data: string, label: string }> = {} as Array<{ data: string, label: string }>;
  showRaisonSociale = false;
  identifier: string;
  lTypology = [];
  showAsterix = true;
  isEnvoi = true;
  isEmail = false;
  formatAddressValid = true;
  penicheVo = {} as PenicheCustomerResponseVO;
  currentUserCUID: string;

  raisonSocialPenich = false;
  nomPeniche = false;
  prenomPeniche = false;
  adressFrancaisPeniche = false;
  villeOrCodePostalPeniche = false
  paysPeniche = false;
  adressePeniche = false;
  codePostalPeniche = false;
  villePeniche = false;
  formatAdresseFrancais = false;
  checkIsAddressFrench = true;
  checkFormatAddress = false;
  isEntreprise = false;
  isEmailExist = false;
  formInValid = false;
  civiliteValide = false;

  isCompany = false;

  customerPark: CustomerParkItemVO = {} as CustomerParkItemVO;
  penicheBillAccount: PenicheBillAccountVO = {} as PenicheBillAccountVO;
  parkWithCfAndCR: ParkBillPenicheCustomerVO = {} as ParkBillPenicheCustomerVO;
  typeClient: string;
  seeAll: '';
  typeRequest: '';
  typeCustomer: string;
  jiraUrl: string;
  isUpdate = false;

  customerDashboardUrl = '/customer-dashboard';
  messageError = "Erreur Serveur : Une erreur technique inattendue est surevenue.";
  transactionError = "Transaction rolled back because it has been marked as rollback-only";
  listParticular= 'list-particular';
  constructor(readonly fb: FormBuilder,
    readonly orasAddressService: OrasAddressService,
    readonly datePipe: DatePipe,
    readonly contactMethodService: ContactMethodService,
    readonly route: ActivatedRoute,
    readonly mockLoginService: GassiMockLoginService,
    private readonly notificationService: NotificationService, readonly parcLigneService: ParcLigneService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    readonly router: Router) { }

  ngOnInit() {
    this.seeAll = this.route.snapshot.queryParams['from'];
    this.typeRequest = this.route.snapshot.queryParams['typeRequest'];
    this.customerPark = this.notificationService.getCPI();
    this.penicheBillAccount = this.notificationService.getBillAccount();
    console.log('bill account in Customer Peniche', this.penicheBillAccount);
    this.route.parent.parent.parent.paramMap.subscribe(params => {
      this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    });
    this.isCompany = this.itIsAnEntreprise();
    this.isCheckFrench.setValue(true);
    this.formPeniche = this.buildPenicheFrom();
    this.defaultListTypology();
    this.getCustomerId();
    this.getFilterAddress();
    this.listCountry = PenicheCountry.values;
    this.filteredCountry = this.formPeniche.get('country').valueChanges.pipe(
      startWith(''),
      map(ref => ref ? this._filterCountry(ref) : this.listCountry.slice())
    );
    this.initBillingUsage();

    this.mockLoginService.getCurrentCUID().subscribe((userCuid) => {
      if (userCuid) {
        this.currentUserCUID = userCuid;
      }
    });
    this.mockLoginService.getJiraUrl().subscribe(
      (url)=> this.jiraUrl = url
    );

    if(this.route.snapshot.queryParams['modificationLine'] === 'true'){
      this.isUpdate = true
     }
   if(this.route.snapshot.queryParams['modificationLine'] === 'false'){
     this.isUpdate = false
     }
  }

  getCustomerId(): void {
    this.route.parent.parent.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
    });
  }

  private _filterCountry(value: string): Array<{ data: string, label: string }> {
    if (value !== '' && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.listCountry.filter(ref => ref.label.toLowerCase().indexOf(filterValue) === 0);
    }
    return this.listCountry;
  }

  displayCountry(value: any): string {
    return value ? value.label : '';
  }

  getFilterAddress(): void {
    this.filteredAddress$ = this.formPeniche.get('addressFrench').valueChanges.pipe(
      startWith(''),
      debounceTime(0),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value !== '') {
          // lookup from github
          return this.lookup(value);
        } else {
          // if no value is present, return null
          return of(null);
        }
      })
    );
  }

  lookup(value: string): Observable<OrasAddressService[]> {
    return this.orasAddressService.getFullAdresse(value).pipe(
      map(results => results),
      catchError(_ => {
        return of(null);
      })
    );
  }


  buildPenicheFrom(): any {
    return this.fb.group({
      typology: this.fb.control(PENICHE_CUSTOMER_TYPOLOGY.PARTICULIER),
      billReport: this.fb.control(false),
      billingTime: this.fb.control('8'),
      title: this.fb.control(''),
      society: this.fb.control(''),
      lastName: this.fb.control(''),
      firstName: this.fb.control(''),
      addressFrench: this.fb.control(''),
      deliveryInfo: this.fb.control(''),
      address2: this.fb.control(''),
      address3: this.fb.control(''),
      address5: this.fb.control(''),
      country: this.fb.control(''),
      zipCode: this.fb.control(''),
      city: this.fb.control(''),
      address4: this.fb.control(''),
      isCheckFrench: this.isCheckFrench,
      mail: this.fb.control(''),
      nomInter: this.fb.control(''),
      typeEnvoi: this.fb.control(PenicheTypeEnvoiLivrable.PAPIER_AUTO),
      facture: this.fb.control('NON')
    });
  }

  defaultListTypology(): void {
    this.lTypology.push(PENICHE_CUSTOMER_TYPOLOGY.PARTICULIER);
    this.lTypology.push(PENICHE_CUSTOMER_TYPOLOGY.ENTREPRISE);
    this.formPeniche.get('typology').setValue(PENICHE_CUSTOMER_TYPOLOGY.PARTICULIER)
  }

  initBillingUsage(): void {
    this.contactMethodService.getUsageByCustomerIdAndRefKeyAndMedia(this.customerId, CM_USAGE.BILLING.key, CM_MEDIA_REF.EMAIL).subscribe(
      data => {
        this.cmBillingUsageVO = data;
      }, error => {
        console.error('getUsageByCustomerIdAndRefKeyAndMedia failed: ', error);
        return of(null);
      }
    );
  }

  changeTypology(event): void {
    if (this.formPeniche.get('typology').value.key === PENICHE_CUSTOMER_TYPOLOGY.ENTREPRISE.key) {
      this.formPeniche.get('title').setValue('PM');
      this.showRaisonSociale = true;
      this.showAsterix = false;
    } else {
      this.formPeniche.get('title').setValue('MR');
      this.showAsterix = true;
      this.showRaisonSociale = false;
    }
  }

  changeFacture(event): void {
    if (event.target.value === 'NON') {
      this.isEnvoi = true;
      this.isEmail = false;
    } else {
      this.isEnvoi = false;
      this.isEmail = true;
      this.initBillingEmailInfos();
    }
  }

  initBillingEmailInfos(): void {
    let personName = '';
    if (this.cmBillingUsageVO) {
      this.formPeniche.get('mail').setValue(this.cmBillingUsageVO.cmInterlocuteur.value);
      if (this.cmBillingUsageVO.interlocutor.categoryPersonKey === PERSON_CATEGORY.MORALE) {
        personName = this.cmBillingUsageVO.interlocutor.companyName;
      } else if (!this.cmBillingUsageVO.interlocutor.firstName && !this.cmBillingUsageVO.interlocutor.lastName) {
        personName = '-';
      } else {
        personName = `${this.cmBillingUsageVO.interlocutor.lastName ? firstNameFormatter(this.cmBillingUsageVO.interlocutor.lastName) : '-'}  ` +
          `${this.cmBillingUsageVO.interlocutor.firstName ? firstNameFormatter(this.cmBillingUsageVO.interlocutor.firstName) : '-'}  `;
      }
      this.formPeniche.get('nomInter').setValue(personName);
    }
  }

  onchangeBillReport(): void {
    this.isBillReport = this.formPeniche.get('billReport').value;
    if (this.isBillReport) {
      this.formPeniche.get('facture').setValue('NON');
      this.formPeniche.get('typeEnvoi').setValue('PAPIER_AUTO');
      this.isEnvoi = true;
      this.isEmail = false;
    } else {
      this.formPeniche.get('facture').setValue('NAN');
      this.isEnvoi = false;
      this.isEmail = false;
      this.formPeniche.get('typeEnvoi').setValue('PAPIER_AUTO');
    }
  }

  radioChangeCivilite(event: any) {
    if (event.target.value === "PM") {
      this.showAsterix = false;
    }
    if (event.target.value === "MME" || event.target.value === "MR") {
      this.showAsterix = true;
    }
  }

  isValidBy(val: string): boolean {
    return (this.formPeniche.controls[val].touched || this.formInValid) &&
      (this.formPeniche.get(val).value === null ||
        this.formPeniche.get(val).value === undefined ||
        this.formPeniche.get(val).value === '')
  }

  isValidAddressFrench(): boolean {
    return (this.formPeniche.controls['addressFrench'].touched || this.formInValid) &&
      (this.formPeniche.get('addressFrench').value === null ||
        this.formPeniche.get('addressFrench').value === undefined ||
        this.formPeniche.get('addressFrench').value === '' || this.formPeniche.get('addressFrench').value.line4 === '' ||
        (this.formPeniche.get('billReport').value && (this.formPeniche.get('addressFrench').value.postalCode === null ||
          this.formPeniche.get('addressFrench').value.postalCode === '') &&
          (this.formPeniche.get('addressFrench').value.cityName === null ||
            this.formPeniche.get('addressFrench').value.cityName === '')))
  }

  onchangeIsFrench(): void {
    this.isCheckFrench = this.formPeniche.get('isCheckFrench').value;
  }

  displayAddress(value: any): string {
    let result = '';
    if (typeof value === 'string') {
      return value;
    }
    this.formatAddressValid = true;
    if (value) {
      if (value.line4) {
        result += `${value.line4} `;
      }
      if (value.postalCode) {
        result += `${value.postalCode} `;
      }
      if (value.cityName) {
        result += `${value.cityName} `;
      }
    }
    return result;
  }

  showAsterixCity(): boolean {
    return this.formPeniche.get('billReport').value;
  }

  isSelectionAddress(): boolean {
    let result = false;
    if (!isNullOrUndefined(this.formPeniche.get('addressFrench').value)) {
      const value = this.formPeniche.get('addressFrench').value;
      result = (value !== '' && typeof value !== 'object');
    }
    this.formatAddressValid = result;
    return result;
  }

  isValidCity(): boolean {
    return (this.formPeniche.controls['city'].touched || this.formInValid) &&
      (this.formPeniche.get('billReport').value &&
        this.formPeniche.get('city').value === '');
  }

  showAsterixZipCode(): boolean {
    return this.formPeniche.get('country').value.data === 'FRANCE' && this.formPeniche.get('billReport').value;
  }

  isValidZipCode(): boolean {
    return (this.formPeniche.controls['zipCode'].touched || this.formInValid) &&
      (this.formPeniche.get('country').value.data === 'FRANCE' &&
        this.formPeniche.get('billReport').value &&
        this.formPeniche.get('zipCode').value === '');
  }

  setPenicheVO(): PenicheCustomerResponseVO {
    const pen = {} as PenicheCustomerResponseVO
    const datePattern = 'yyyy-MM-dd';
    pen.status = 'ACTIF';
    pen.trigramme = 'PAR';
    pen.identifier = this.penicheBillAccount.customerIdentifier;
    pen.nicheAdmissionDate = this.datePipe.transform(new Date(), datePattern);
    pen.streetNumber = 0;
    pen.typeEnvoi = PenicheTypeEnvoiLivrable.PAPIER_AUTO;

    if (this.formPeniche.get('facture').value === 'OUI' && this.formPeniche.get('billReport').value) {
      pen.mailNotification = this.formPeniche.get('mail').value;
      pen.typeEnvoi = PenicheTypeEnvoiLivrable.MAIL;
    } else if (this.formPeniche.get('facture').value === 'NON' && this.formPeniche.get('billReport').value) {
      pen.typeEnvoi = this.formPeniche.get('typeEnvoi').value;
      pen.mailNotification = '';
    } else {
      pen.typeEnvoi = PenicheTypeEnvoiLivrable.PAPIER_AUTO;
      pen.mailNotification = '';
    }

    pen.typology = this.formPeniche.get('typology').value.key;
    pen.billReport = this.formPeniche.get('billReport').value;
    pen.billingTime = this.formPeniche.get('billingTime').value;
    pen.title = this.formPeniche.get('title').value;
    pen.society = this.formPeniche.get('society').value;
    pen.lastName = this.formPeniche.get('lastName').value;
    pen.firstName = this.formPeniche.get('firstName').value;
    this.gestionAddressOrasAndOrOras(pen);
    return pen;
  }

  gestionAddressOrasAndOrOras(pen: PenicheCustomerResponseVO): void {
    if (this.formPeniche.get('isCheckFrench').value && !isNullOrUndefined(this.formPeniche.get('addressFrench').value)) {
      pen.orasId = this.formPeniche.get('addressFrench').value.orasId;
      pen.address4 = this.formPeniche.get('addressFrench').value.line4 !== '' ? this.formPeniche.get('addressFrench').value.line4 : '';
      pen.address6 = this.formPeniche.get('addressFrench').value.line6;
      pen.zipCode = this.formPeniche.get('addressFrench').value.postalCode;
      pen.city = this.formPeniche.get('addressFrench').value.cityName;
      pen.geocodeX = this.formPeniche.get('addressFrench').value.geoCodeX;
      pen.geocodeY = this.formPeniche.get('addressFrench').value.geoCodeY;
      pen.inseeId = this.formPeniche.get('addressFrench').value.cityInseeId;
      pen.rivoliId = this.formPeniche.get('addressFrench').value.rivoliCode;
      pen.streetNumber = isNullOrUndefined(this.formPeniche.get('addressFrench').value.streetNumber) ? 0 : this.formPeniche.get('addressFrench').value.streetNumber;
      pen.streetExtension = this.formPeniche.get('addressFrench').value.streetExtension;
      pen.streetType = this.formPeniche.get('addressFrench').value.streetType;
      pen.streetName = this.formPeniche.get('addressFrench').value.streetName;
      pen.country = 'FRANCE';
    } else {
      pen.orasId = null;
      pen.address6 = null;
      pen.streetExtension = null;
      pen.streetType = null;
      pen.streetName = null;
      pen.city = this.formPeniche.get('city').value;
      pen.country = this.formPeniche.get('country').value ? this.formPeniche.get('country').value.data : '';
      pen.address4 = this.formPeniche.get('address4').value;
      pen.zipCode = this.formPeniche.get('zipCode').value;
      pen.streetNumber = 0;
    }
    pen.address2 = this.formPeniche.get('address2').value;
    pen.address3 = this.formPeniche.get('address3').value;
    pen.address5 = this.formPeniche.get('address5').value;
    pen.deliveryInfo = this.formPeniche.get('deliveryInfo').value;
  }

  onSave(): void {
    this.initFormForValid();
    this.penicheVo = this.setPenicheVO();
    console.log(this.penicheVo)
    console.log(this.currentUserCUID)
    console.log(this.isNotValidForm(this.penicheVo));
    if (!this.isNotValidForm(this.penicheVo)) {
      console.log("valid");
      this.parkWithCfAndCR.customerParkItem = this.customerPark;
      this.parkWithCfAndCR.billAccount = this.penicheBillAccount;
      this.parkWithCfAndCR.penicheCustomer = this.penicheVo;

    if(this.route.snapshot.queryParams['modificationLine'] === 'true'){
    this.updateParkWithCompteFacturAndClientPeniche();
    }
     if(this.route.snapshot.queryParams['modificationLine'] === 'false'){
      this.saveParkWithCompteFacturAndClientPeniche();
    }
    } else {
      console.log("not valid")
    }
  }

  saveParkWithCompteFacturAndClientPeniche(){
    this.parcLigneService.saveParkWithCRAndCF(this.parkWithCfAndCR).subscribe((data) => {
      console.info('data ', data);
    },
      (er) => {
        this.popUpDataError();
      },
      () => {
        this.gobackTo();
      });
  }
  //*****************************************************************************************************/
  updateParkWithCompteFacturAndClientPeniche(){
    this.parcLigneService.updateCustomerParkItem(this.parkWithCfAndCR)
    .subscribe(() => {
      this.backAfterUpdate();  
    },
    
    (error) => { 
      if (error.error.error !== '' && error.error.message !== this.transactionError) {
        this.openConfirmationDialog('Erreur Serveur : '+error.error.message,'ok', false);   
     } else {
        this.openConfirmationDialog(this.messageError,'ok',false);  
     }   
     
    } );


  }
  //*****************************************************************************************************/
  backAfterUpdate(){
    const customerDashbord ='/customer-dashboard';

    if (this.route.snapshot.queryParams['typeRequest'] === 'all') {
      this.router.navigate([customerDashbord,  this.customerId , 'park-item', 'list-enterprise'],
      { queryParams: { typeCustomer: this.typeClient, typeRequest: 'all'}
      });
    } 

    if (this.route.snapshot.queryParams['from'] === 'all') {
      this.router.navigate([customerDashbord,  this.customerId , 'park-item', this.listParticular],
      { queryParams: { typeCustomer: this.typeClient, from: 'all'}
      });
    } 
    
     if (this.route.snapshot.queryParams['from'] === 'dashboard') {
      this.router.navigate([customerDashbord,
         'particular', this.customerId],
      { queryParams: { typeCustomer: this.typeClient , from: 'dashboard'}
      });
    }

  }
  //*************************************************************************** */
  openConfirmationDialog(commentText: string,OkText: string, isCancelBtnVisible: boolean): any {
   
    const title = 'Erreur';
    this.confirmationDialogService.confirm(title, commentText, OkText,'Non','lg', isCancelBtnVisible)
    .then((confirmed) => {
      if (confirmed)  {
        this.backAfterUpdate();
      }
     
     } )
    .catch(() => console.log('User dismissed the dialog'));
  }
 //*****************************************************************************************************/
  initFormForValid(): void {
    this.raisonSocialPenich = false;
    this.nomPeniche = false;
    this.prenomPeniche = false;
    this.isEmailExist = false;
    this.adressFrancaisPeniche = false;
    this.paysPeniche = false;
    this.adressePeniche = false;
    this.villePeniche = false;
    this.codePostalPeniche = false;
    this.formatAdresseFrancais = false;
    this.civiliteValide = false;
    this.formInValid = false;
  }

  setInfoPerson(pen){
    if (isNullOrUndefined(pen) || (pen.title !== 'PM' && pen.lastName === '')) {
      this.nomPeniche = true;
    }
    if (isNullOrUndefined(pen) || (pen.title !== 'PM' && pen.firstName === '')) {
      this.prenomPeniche = true;
    }
 
    if (isNullOrUndefined(pen) || pen.title === null  || pen.title === '') {
      this.civiliteValide = true;
    }
  }
  
  isNotValidForm(pen): boolean {
    if (this.formPeniche.get('typology').value === PENICHE_CUSTOMER_TYPOLOGY.ENTREPRISE && (isNullOrUndefined(pen) || pen.society === '')) {
      this.raisonSocialPenich = true;
    }

   this.setInfoPerson(pen);
    
    if (isNullOrUndefined(pen) || (pen.typeEnvoi === PenicheTypeEnvoiLivrable.MAIL
      && (pen.mailNotification === '' || isNullOrUndefined(pen.mailNotification)))) {
      this.isEmailExist = true;
    }
    this.valideAddress(pen);

    this.formInValid = this.raisonSocialPenich ||
      this.nomPeniche ||
      this.prenomPeniche ||
      this.isEmailExist ||
      this.adressFrancaisPeniche ||
      this.paysPeniche ||
      this.adressePeniche ||
      this.villePeniche ||
      this.codePostalPeniche ||
      this.formatAdresseFrancais ||
      this.civiliteValide;

    return this.formInValid;
  }

  onCancel(): void {
    this.initFormForValid();
  }

  valideAddress(pen): void {
    if (this.isCheckFrench) {
      this.verifAddresFrench(pen);
    } else {
      this.verifHorFrench(pen);
    }
  }

  verifAddresFrench(pen): void {
    if (isNullOrUndefined(pen) || !this.formatAddressValid) {
      if (isNullOrUndefined(pen.address4) || isNullOrUndefined(pen.orasId) || pen.orasId === '') {
        this.adressFrancaisPeniche = true;
      }
      if (pen.billReport && (pen.zipCode === '' || pen.city === '')) {
        this.villeOrCodePostalPeniche = true;
        this.adressFrancaisPeniche = true;
      }
    } else if (this.formatAddressValid) {
      this.formatAdresseFrancais = true;
    }
  }

  verifHorFrench(pen): void {
    if (isNullOrUndefined(pen) || pen.country === '') {
      this.paysPeniche = true;
    }

    if (isNullOrUndefined(pen) || pen.address4 === '') {
      this.adressePeniche = true;
    }

    if (isNullOrUndefined(pen) || (pen.billReport === true && pen.city === '')) {
      this.villePeniche = true;
    }

    if (isNullOrUndefined(pen) || (pen.country === 'FRANCE' && pen.billReport === true && pen.zipCode === '')) {
      this.codePostalPeniche = true;
    }
  }

  gobackTo(): any {
    if (this.typeCustomer === 'company') {
      this.router.navigate(
        [this.customerDashboardUrl, this.customerId, 'park-item', 'list-entreprise'],
        {
          queryParams: {
            typeCustomer: this.typeCustomer
          },
          queryParamsHandling: 'merge'
        }
      );
    } else {
      this.router.navigate(
        [this.customerDashboardUrl, this.customerId, 'park-item', this.listParticular],
        {
          queryParams: {
            typeCustomer: this.typeCustomer
          },
          queryParamsHandling: 'merge'
        }
      );
    }
  }

  annuler(): void {
    const title = 'Erreur!';
    const comment = 'Êtes-vous sûr de vouloir annuler votre saisie ?';
    const btnOkText = 'Oui';
    const btnCancelText = 'Non';
    this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText, 'lg', true)
      .then((confirmed) => {
        if (confirmed) {
          this.cancel();
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  cancel(): any {
    if (!isNullOrUndefined(this.seeAll) || !isNullOrUndefined(this.typeRequest)) {
      if (this.typeCustomer === 'company') {
        this.router.navigate(
          [this.customerDashboardUrl, this.customerId, 'park-item', 'list-enterprise'],
          {
            queryParams: {
              typeCustomer: this.typeCustomer,
              typeRequest: 'all'
            },
            queryParamsHandling: 'merge'
          }
        );
      } else {
        this.router.navigate(
          [this.customerDashboardUrl, this.customerId, 'park-item', this.listParticular],
          {
            queryParams: {
              typeCustomer: this.typeCustomer
            },
            queryParamsHandling: 'merge'
          }
        );
      }
    } else {
      this.router.navigate(
        (this.isCompany) ? [this.customerDashboardUrl, 'entreprise', this.customerId]
          : [this.customerDashboardUrl, 'particular', this.customerId],

        {
          queryParams: {
            typeCustomer: this.typeCustomer
          },
          queryParamsHandling: 'merge'
        }
      );
    }
  }

  popUpDataError(): void {
    const title = '';
    const comment = 'Erreur lors du traitement des données reçues par Péniche. Merci de transmettre une signalisation au Run Parnasse';
    const btnOkText = 'OK';
    this.confirmationDialogService.confirm(title, comment, btnOkText, null, 'lg', true)
      .then((confirmed) => {
      })
      .catch(() => console.log('User dismissed the dialog'));
  }

  itIsAnEntreprise(): boolean {
    return this.route.snapshot.queryParamMap.get('typeCustomer') === 'company';
  }
}
