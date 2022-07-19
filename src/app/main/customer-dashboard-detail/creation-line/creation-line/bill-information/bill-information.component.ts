import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators';

import { OrasAddressService } from '../../../../../_core/services/oras-address.service';
import { ReferenceDataTypeService } from '../../../../../_core/services/reference-data-type.service';
import { OrasPostalAddress } from '../../../../../_core/models';
import { PenicheBillAccountVO } from '../../../../../_core/models/peniche-bill-account-vo';
import { CmUsageVO } from '../../../../../_core/models/cm-usage-vo';
import { PenicheTypeEnvoiLivrable, PenicheCivilite } from '../../../../../_core/enum/billing-account.enum';
import { PenicheCountry } from '../../../../../_core/constants/peniche-country';
import { CM_MEDIA_REF, CM_USAGE, CONSTANTS, PERSON_CATEGORY } from '../../../../../_core/constants/constants';
import { firstNameFormatter } from '../../../../../_core/utils/formatter-utils';
import { isEmpty, isNullOrUndefined } from '../../../../../_core/utils/string-utils';
import { ContactMethodService } from '../../../../../_core/services/contact-method.service';
import { NotificationService } from '../../../../../_core/services/notification.service';
import { CustomerParkItemVO } from '../../../../../_core/models/customer-park-item-vo';
import { ParcLigneService } from './../../../../../_core/services';
import { ParkBillPenicheCustomerVO } from './../../../../../_core/models/park-bill-peniche-customer-vo';
import { ConfirmationDialogService } from './../../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { BillingService } from './../../../../../_core/services/billing.service';

@Component({
  selector: 'app-bill-information',
  templateUrl: './bill-information.component.html',
  styleUrls: ['./bill-information.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillInformationComponent implements OnInit {
  typeCustomer: string;
  customerId: string;
  billingEmail = '';
  billingPersonName = '';
  isElectronicInvoice = false;
  isOrasTitularAddress = true;
  isOrasPayerAddress = true;
  countryList: Array<{data: string, label: string}> = {} as Array<{data: string, label: string}>;
  filteredTitularAddress$: Observable<OrasPostalAddress[]> = null;
  filteredPayerAddress$: Observable<OrasPostalAddress[]> = null;
  hasPayerDifferentAddress = true;
  customerPark: CustomerParkItemVO = {} as CustomerParkItemVO;
  customerDashboard = '/customer-dashboard';
  form: FormGroup;
  isSubmitted = false;
  titularAddressFrench = new FormControl(null, Validators.required);
  payerAddressFrench = new FormControl(null, Validators.required);

  penicheBillAccount: PenicheBillAccountVO = {} as PenicheBillAccountVO;
  cmBillingUsageVO: CmUsageVO;

  PenicheTypeEnvoiLivrable: typeof PenicheTypeEnvoiLivrable = PenicheTypeEnvoiLivrable;
  PenicheCivilite: typeof PenicheCivilite = PenicheCivilite;

  parkWithCfAndCR: ParkBillPenicheCustomerVO = {} as ParkBillPenicheCustomerVO;
  isEntreprise = false;
  typeClient: string;
  seeAll: '';
  typeRequest: ''; 

  messageError = "Erreur Serveur : Une erreur technique inattendue est surevenue.";
  transactionError = "Transaction rolled back because it has been marked as rollback-only";
  constructor(readonly route: ActivatedRoute, readonly fb: FormBuilder,
    readonly referenceDataTypeService: ReferenceDataTypeService, readonly orasAddressService: OrasAddressService,
    readonly router: Router, readonly contactMethodService: ContactMethodService,
    private readonly notificationService: NotificationService, readonly parcLigneService: ParcLigneService, 
    private readonly confirmationDialogService: ConfirmationDialogService,
    readonly billingService: BillingService) { }

  ngOnInit(): void {
    this.customerPark = this.notificationService.getCPI();  
    this.penicheBillAccount = this.notificationService.getBillAccount();
    this.seeAll = this.route.snapshot.queryParams['from'];
    this.typeRequest = this.route.snapshot.queryParams['typeRequest'];
    this.route.parent.parent.parent.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
      this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer'); 
    });

    this.isEntreprise = this.itIsAnEntreprise();

    this.countryList = PenicheCountry.values;
    this.initBillingUsage();
    
    this.initCreation();
    this.buildFrom();

    this.getFilteredTitularAddress();
    this.getFilteredPayerAddress();

  }

  raisonSocialPenich = false;
  nomPeniche = false;
  prenomPeniche = false;
  adressFrancaisPeniche = false;
  villeOrCodePostalPeniche = false
  paysPeniche = false;
  adressePeniche = false;
  codePostalPeniche = false;
  villePeniche = false;
  isEmailExist = false;
  formInValid = false;

  initBillingUsage(): void {
    this.contactMethodService.getUsageByCustomerIdAndRefKeyAndMedia(this.customerId, CM_USAGE.BILLING.key, CM_MEDIA_REF.EMAIL).subscribe(
      data => {
        this.cmBillingUsageVO = data;
        if (this.cmBillingUsageVO) {
          this.initBillingEmailInfos();
          this.initElectronicInvoiceInfo();
        }
        console.log('Usage: ', data);
      }, error => {
      console.error('getUsageByCustomerIdAndRefKeyAndMedia failed: ', error);
      return of(null);
    }
    );
  }

  buildFrom(): any {
    this.titularAddressFrench.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.payerAddressFrench.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form = this.fb.group({
      titularAddressFrench: this.titularAddressFrench,
      payerAddressFrench: this.payerAddressFrench,
      isOrasTitularAddress: this.isOrasTitularAddress,
      isOrasPayerAddress: this.isOrasPayerAddress,

      titularTitle: this.fb.control(this.penicheBillAccount.titularTitle, Validators.required),
      titularLastName: this.fb.control(this.penicheBillAccount.titularLastName, Validators.required),
      titularFirstName: this.fb.control(this.penicheBillAccount.titularFirstName, Validators.required),
      titularCompany: this.fb.control(this.penicheBillAccount.titularCompany),
      titularSiren: this.fb.control(this.penicheBillAccount.titularSiren),
      titularAddress4: this.fb.control(this.penicheBillAccount.titularAddress4),
      titularAddress2: this.fb.control(this.penicheBillAccount.titularAddress2),
      titularAddress3: this.fb.control(this.penicheBillAccount.titularAddress3),
      titularZipCode: this.fb.control(this.penicheBillAccount.titularZipCode),
      titularCity: this.fb.control(this.penicheBillAccount.titularCity),
      titularCountry: this.fb.control(this.penicheBillAccount.titularCountry),

      payerTitle: this.fb.control(this.penicheBillAccount.payerTitle),
      payerLastName: this.fb.control(this.penicheBillAccount.payerLastName, Validators.required),
      payerFirstName: this.fb.control(this.penicheBillAccount.payerFirstName, Validators.required),
      payerCompany: this.fb.control(this.penicheBillAccount.payerCompany),
      payerSiren: this.fb.control(this.penicheBillAccount.payerSiren),
      payerAddress4: this.fb.control(this.penicheBillAccount.payerAddress4),
      payerAddress2: this.fb.control(this.penicheBillAccount.payerAddress2),
      payerAddress3: this.fb.control(this.penicheBillAccount.payerAddress3),
      payerZipCode: this.fb.control(this.penicheBillAccount.payerZipCode),
      payerCity: this.fb.control(this.penicheBillAccount.payerCity),
      payerCountry: this.fb.control(this.penicheBillAccount.payerCountry),

      // TOUP
      idMailNotification: this.fb.control(this.penicheBillAccount.idMailNotification),
      idMailOldNotification: this.fb.control(this.penicheBillAccount.idMailOldNotification),
      mailNotification: this.fb.control(this.penicheBillAccount.mailNotification),
      typeEnvoi: this.fb.control(this.penicheBillAccount.typeEnvoi)
    });
  }

  get f(): any { return this.form.controls; }

  updateValueAndValidityChanged(): void {
    this.form.get('titularFirstName').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('titularLastName').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('titularCompany').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('titularSiren').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('titularAddressFrench').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('titularAddress4').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('titularCountry').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('titularCity').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('payerFirstName').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('payerLastName').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('payerCompany').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('payerSiren').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('payerAddressFrench').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('payerAddress4').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('payerCountry').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.form.get('payerCity').updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }
  
  isTitularSirenRequired(): boolean {
    return !isEmpty(this.form.get('titularCompany').value) && 
    PenicheCountry.FRANCE.data === this.form.get('titularCountry').value && 
    (!isEmpty(this.form.get('titularZipCode').value) && 
    '98000' !== this.form.get('titularZipCode').value && !this.form.get('isOrasTitularAddress').value || 
    this.form.get('titularAddressFrench').value &&
    Object.entries(this.form.get('titularAddressFrench').value).length !== 0 && 
    !isEmpty(this.form.get('titularAddressFrench').value.postalCode) &&
    '98000' !== this.form.get('titularAddressFrench').value.postalCode) ;
  }

  isPayerSirenRequired(): boolean {
    return !isEmpty(this.form.get('payerCompany').value) && 
    PenicheCountry.FRANCE.data === this.form.get('payerCountry').value && 
    (!isEmpty(this.form.get('payerZipCode').value) && 
    '98000' !== this.form.get('payerZipCode').value && !this.form.get('isOrasPayerAddress').value || 
    this.form.get('payerAddressFrench').value && 
    Object.entries(this.form.get('payerAddressFrench').value).length !== 0 && 
    !isEmpty(this.form.get('payerAddressFrench').value.postalCode) && 
    '98000' !== this.form.get('payerAddressFrench').value.postalCode) ;
  }

  onTitularTitleChange(): void {
    if (PenicheCivilite.PM === this.form.get('titularTitle').value ) {
      this.form.get('titularCompany').setValidators(Validators.required);
      this.form.get('titularLastName').setValidators(null);
      this.form.get('titularFirstName').setValidators(null);
      if (this.isTitularSirenRequired() ) {
        this.form.get('titularSiren').setValidators(Validators.required);
      } else {
        this.form.get('titularSiren').setValidators(null);
      }

      this.form.get('titularLastName').setValue('');
      this.form.get('titularFirstName').setValue('');

    } else {
      this.form.get('titularFirstName').setValidators(Validators.required);
      this.form.get('titularLastName').setValidators(Validators.required);
      this.form.get('titularCompany').setValidators(null);
      this.form.get('titularSiren').setValidators(null);

      this.form.get('titularCompany').setValue('');
      this.form.get('titularSiren').setValue(null);
    }
    this.updateValueAndValidityChanged();
  }

  onPayerTitleChange(): void {
    if (PenicheCivilite.PM === this.form.get('payerTitle').value ) {
      this.form.get('payerCompany').setValidators(Validators.required);
      this.form.get('payerLastName').setValidators(null);
      this.form.get('payerFirstName').setValidators(null);
      if (this.isPayerSirenRequired() ) {
        this.form.get('payerSiren').setValidators(Validators.required);
      } else {
        this.form.get('payerSiren').setValidators(null);
      }

      this.form.get('payerLastName').setValue('');
      this.form.get('payerFirstName').setValue('');
    } else {
      this.form.get('payerFirstName').setValidators(Validators.required);
      this.form.get('payerLastName').setValidators(Validators.required);
      this.form.get('payerCompany').setValidators(null);
      this.form.get('payerSiren').setValidators(null);

      this.form.get('payerCompany').setValue('');
      this.form.get('payerSiren').setValue(null);
    }
    this.updateValueAndValidityChanged();
  }

  refreshTitularSirenValidator(): void {
    if (this.isTitularSirenRequired() ) {
      this.form.get('titularSiren').setValidators(Validators.required);
    } else {
      this.form.get('titularSiren').setValidators(null);
    }
    this.updateValueAndValidityChanged();
  }

  refreshPayerSirenValidator(): void {
    if (this.isPayerSirenRequired() ) {
      this.form.get('payerSiren').setValidators(Validators.required);
    } else {
      this.form.get('payerSiren').setValidators(null);
    }
    this.updateValueAndValidityChanged();
  }

  initBillingEmailInfos(): void {
    this.billingEmail = this.cmBillingUsageVO.cmInterlocuteur.value;
    if (this.cmBillingUsageVO.interlocutor.categoryPersonKey === PERSON_CATEGORY.MORALE) {
      this.billingPersonName = this.cmBillingUsageVO.interlocutor.companyName;
    } else if (!this.cmBillingUsageVO.interlocutor.firstName && !this.cmBillingUsageVO.interlocutor.lastName) {
      this.billingPersonName = '-';
    } else {
      this.billingPersonName = 
      `${this.cmBillingUsageVO.interlocutor.lastName ? firstNameFormatter(this.cmBillingUsageVO.interlocutor.lastName) : '-'}  ` + 
      `${this.cmBillingUsageVO.interlocutor.firstName ? firstNameFormatter(this.cmBillingUsageVO.interlocutor.firstName) : '-'}  `;
    }
  }

  initElectronicInvoiceInfo(): void {
    this.isElectronicInvoice = false;
    this.form.get('typeEnvoi').setValue(PenicheTypeEnvoiLivrable.PAPIER_AUTO);
    this.form.get('idMailNotification').setValue(0);
    this.form.get('idMailOldNotification').setValue(0);
  }

  electronicInvoiceChange(): void {
    if (this.isElectronicInvoice) {
      this.form.get('mailNotification').setValidators(Validators.required);
      this.form.get('typeEnvoi').setValue(PenicheTypeEnvoiLivrable.MAIL);
      if (this.cmBillingUsageVO) {
        this.form.get('mailNotification').setValue(this.cmBillingUsageVO.cmInterlocuteur.value);
        this.form.get('idMailNotification').setValue(this.cmBillingUsageVO.cmInterlocuteur.id);
        this.form.get('idMailOldNotification').setValue(this.cmBillingUsageVO.cmInterlocuteur.id);
      } else {   
        this.form.get('mailNotification').setValue(null);
      }
    } else {
      this.form.get('mailNotification').setValidators(null);
      this.form.get('typeEnvoi').setValue(PenicheTypeEnvoiLivrable.PAPIER_AUTO);
      this.form.get('idMailNotification').setValue(0);
      this.form.get('idMailOldNotification').setValue(0);
      this.form.get('mailNotification').setValue(null);
      this.form.get('mailOldNotification').setValue(null);
    }
    this.updateValueAndValidityChanged();
  }

  titularAddressChange(event: any): void {
    if (event.checked) {
      // Validators
      this.form.get('titularAddressFrench').setValidators(Validators.required);
      this.form.get('titularCountry').setValidators(null);
      this.form.get('titularCity').setValidators(null);
      this.form.get('titularAddress4').setValidators(null);
      // Values
      this.form.get('titularCountry').setValue('FRANCE');
      this.form.get('isOrasTitularAddress').setValue(true);
    } else {
      // Validators
      this.form.get('titularCountry').setValidators(Validators.required);
      this.form.get('titularCity').setValidators(Validators.required);
      this.form.get('titularAddress4').setValidators(Validators.required);
      this.form.get('titularAddressFrench').setValidators(null);
      // Values
      this.form.get('titularAddressFrench').setValue(null);
      this.form.get('titularCountry').setValue(null);
      this.form.get('isOrasTitularAddress').setValue(false);
    }
    this.refreshTitularSirenValidator();
    console.log('ALL CASES: ', this.form.get('titularCountry').value);
  }

  payerAddressChange(event: any): void {
    if (event.checked) {
      // Validators
      this.form.get('payerAddressFrench').setValidators(Validators.required);
      this.form.get('payerCountry').setValidators(null);
      this.form.get('payerCity').setValidators(null);
      this.form.get('payerAddress4').setValidators(null);
      // Values
      this.form.get('payerCountry').setValue('FRANCE');
      this.form.get('isOrasPayerAddress').setValue(true);
    } else {
      // Validators
      this.form.get('payerCountry').setValidators(Validators.required);
      this.form.get('payerCity').setValidators(Validators.required);
      this.form.get('payerAddress4').setValidators(Validators.required);
      this.form.get('payerAddressFrench').setValidators(null);
      // Values
      this.form.get('payerAddressFrench').setValue(null);
      this.form.get('payerCountry').setValue(null);
      this.form.get('isOrasPayerAddress').setValue(false);
    }
    this.refreshPayerSirenValidator();
  }

  getFilteredTitularAddress(): void {
    this.filteredTitularAddress$ = this.titularAddressFrench.valueChanges.pipe(
      startWith(''),
      debounceTime(0),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value !== '') {
          // lookup from github
          return this.lookup(value);
        }
        // if no value is present, return null
        return of(null);
      })
    );
  }

  getFilteredPayerAddress(): void {
    this.filteredPayerAddress$ = this.payerAddressFrench.valueChanges.pipe(
      startWith(''),
      debounceTime(0),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value !== '') {
          // lookup from github
          return this.lookup(value);
        }
        // if no value is present, return null
        return of(null);
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

  displayAddress(value: any): string {
    let result = '';
    if (typeof value === 'string') {
      return value;
    }
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

  isSelectionTitularAddress(): boolean {
    if (this.titularAddressFrench) {
      return (this.titularAddressFrench.value !== '' && typeof this.titularAddressFrench.value !== 'object') ;
    }
    return false;
  }

  isSelectionPayerAddress(): boolean {
    if (this.payerAddressFrench) {
      return (this.payerAddressFrench.value !== '' && typeof this.payerAddressFrench.value !== 'object') ;
    }
    return false;
  }

  diffAddressChange(event): void {
    if (event.checked) {
      this.form.get('isOrasPayerAddress').setValue(true);
      this.initPayerInfos();
    } else {
      this.duplicateTitularInPayer();
      this.subscribeToTitularAddressControls();
    }
    this.updateValueAndValidityChanged();
  }

  subscribeToTitularAddressControls(): void {
    this.form.get('isOrasTitularAddress').valueChanges.subscribe(valIsOras=> {
      if (!this.hasPayerDifferentAddress) {
        this.form.get('isOrasPayerAddress').setValue(valIsOras);
      }
    });
    this.form.get('titularFirstName').valueChanges.subscribe(valFN => {
      if (!this.hasPayerDifferentAddress) {
        this.form.get('payerFirstName').setValue(valFN);
      }
    });
    this.form.get('titularLastName').valueChanges.subscribe(valLN => {
      if (!this.hasPayerDifferentAddress) {
        this.form.get('payerLastName').setValue(valLN);
      }
    });
    this.form.get('titularCompany').valueChanges.subscribe(valCompany => {
      if (!this.hasPayerDifferentAddress) {
        this.form.get('payerCompany').setValue(valCompany);
      }
    });
    this.form.get('titularSiren').valueChanges.subscribe(valSiren => {
      if (!this.hasPayerDifferentAddress) {
        this.form.get('payerSiren').setValue(valSiren);
      }
    });
    this.form.get('titularTitle').valueChanges.subscribe(valTitle => {
      if (!this.hasPayerDifferentAddress) {
        this.form.get('payerTitle').setValue(valTitle);
      }
    });
    this.form.get('titularCountry').valueChanges.subscribe(valCountry => {
      if (!this.hasPayerDifferentAddress) {
        this.form.get('payerCountry').setValue(valCountry);
      }
    });
    this.form.get('titularAddress2').valueChanges.subscribe(valAdd2 => {
      if (!this.hasPayerDifferentAddress) {
        this.form.get('payerAddress2').setValue(valAdd2);
      }
    });
    this.form.get('titularAddress3').valueChanges.subscribe(valAdd3 => {
      if (!this.hasPayerDifferentAddress) {
        this.form.get('payerAddress3').setValue(valAdd3);
      }
    });
    this.form.get('titularAddressFrench').valueChanges.subscribe(valAddress => {
      if (!this.hasPayerDifferentAddress) {
        this.form.get('payerAddressFrench').setValue(valAddress);
      }
    });
    this.form.get('titularAddress4').valueChanges.subscribe(valAdd4 => {
      if (!this.hasPayerDifferentAddress) {
        this.form.get('payerAddress4').setValue(valAdd4);
      }
    });
    this.form.get('titularZipCode').valueChanges.subscribe(valZC => {
      if (!this.hasPayerDifferentAddress) {
        this.form.get('payerZipCode').setValue(valZC);
      }
    });
    this.form.get('titularCity').valueChanges.subscribe(valCity => {
      if (!this.hasPayerDifferentAddress) {
        this.form.get('payerCity').setValue(valCity);
      }
    });
  }

  duplicateTitularInPayer(): void {
    this.form.get('isOrasPayerAddress').setValue(this.form.get('isOrasTitularAddress').value);
    this.form.get('payerFirstName').setValue(this.form.get('titularFirstName').value);
    this.form.get('payerLastName').setValue(this.form.get('titularLastName').value);
    this.form.get('payerCompany').setValue(this.form.get('titularCompany').value);
    this.form.get('payerSiren').setValue(this.form.get('titularSiren').value);
    this.form.get('payerTitle').setValue(this.form.get('titularTitle').value);
    this.form.get('payerCountry').setValue(this.form.get('titularCountry').value);
    this.form.get('payerAddress2').setValue(this.form.get('titularAddress2').value);
    this.form.get('payerAddress3').setValue(this.form.get('titularAddress3').value);
    if (this.form.get('isOrasTitularAddress').value) {
      this.form.get('payerAddressFrench').setValue(this.form.get('titularAddressFrench').value);
    } else {
      this.form.get('payerAddress4').setValue(this.form.get('titularAddress4').value);
      this.form.get('payerZipCode').setValue(this.form.get('titularZipCode').value);
      this.form.get('payerCity').setValue(this.form.get('titularCity').value);
    }
    
    // Validators RESET
    this.form.get('payerFirstName').setValidators(null);
    this.form.get('payerLastName').setValidators(null);
    this.form.get('payerCompany').setValidators(null);
    this.form.get('payerSiren').setValidators(null);
    this.form.get('payerCountry').setValidators(null);
    this.form.get('payerAddress4').setValidators(null);
    this.form.get('payerAddressFrench').setValidators(null);
  }

  initPostalAddressByOras(): void {
    if (this.isOrasTitularAddress) {
      const orasTitularPostalAddress = {} as OrasPostalAddress;
      orasTitularPostalAddress.orasId = String(this.penicheBillAccount.titularOrasId);
      orasTitularPostalAddress.line4 = this.penicheBillAccount.titularAddress4;
      orasTitularPostalAddress.line6 = this.penicheBillAccount.titularAddress6;
      orasTitularPostalAddress.postalCode = this.penicheBillAccount.titularZipCode;
      orasTitularPostalAddress.cityName = this.penicheBillAccount.titularCity;
      orasTitularPostalAddress.geoCodeX = String(this.penicheBillAccount.titularGeocodeX);
      orasTitularPostalAddress.geoCodeY = String(this.penicheBillAccount.titularGeocodeY);
      orasTitularPostalAddress.cityInseeId = this.penicheBillAccount.titularInseeId;
      orasTitularPostalAddress.rivoliCode = this.penicheBillAccount.titularRivoliId;
      orasTitularPostalAddress.streetNumber = String(this.penicheBillAccount.titularStreetNumber);
      orasTitularPostalAddress.streetExtension = this.penicheBillAccount.titularStreetExtension;
      orasTitularPostalAddress.streetType = this.penicheBillAccount.titularStreetType;
      orasTitularPostalAddress.streetName = this.penicheBillAccount.titularStreetName;
      this.titularAddressFrench.setValue(orasTitularPostalAddress);
    }
    if (this.hasPayerDifferentAddress && this.isOrasPayerAddress) {
      this.setPayerAddressWithOrasValue();
    } 
  }

  setPayerAddressWithOrasValue(): void {
    const orasPayerPostalAddress = {} as OrasPostalAddress;
    orasPayerPostalAddress.orasId = String(this.penicheBillAccount.payerOrasId);
    orasPayerPostalAddress.line4 = this.penicheBillAccount.payerAddress4;
    orasPayerPostalAddress.line6 = this.penicheBillAccount.payerAddress6;
    orasPayerPostalAddress.postalCode = this.penicheBillAccount.payerZipCode;
    orasPayerPostalAddress.cityName = this.penicheBillAccount.payerCity;
    orasPayerPostalAddress.geoCodeX = String(this.penicheBillAccount.payerGeocodeX);
    orasPayerPostalAddress.geoCodeY = String(this.penicheBillAccount.payerGeocodeY);
    orasPayerPostalAddress.cityInseeId = this.penicheBillAccount.payerInseeId;
    orasPayerPostalAddress.rivoliCode = this.penicheBillAccount.payerRivoliId;
    orasPayerPostalAddress.streetNumber = String(this.penicheBillAccount.payerStreetNumber);
    orasPayerPostalAddress.streetExtension = this.penicheBillAccount.payerStreetExtension;
    orasPayerPostalAddress.streetType = this.penicheBillAccount.payerStreetType;
    orasPayerPostalAddress.streetName = this.penicheBillAccount.payerStreetName;
    this.payerAddressFrench.setValue(orasPayerPostalAddress);
  }

  initPayerInfos(): void {
    this.form.get('payerFirstName').setValue('');
    this.form.get('payerLastName').setValue('');
    this.form.get('payerCompany').setValue('');
    this.form.get('payerSiren').setValue(null);
    this.form.get('payerCountry').setValue('FRANCE');
    this.form.get('payerAddress4').setValue('');
    this.form.get('payerTitle').setValue(PenicheCivilite.MME);
    this.form.get('payerAddress2').setValue('');
    this.form.get('payerAddress3').setValue('');
    this.form.get('payerZipCode').setValue('');
    this.form.get('payerCity').setValue('');

    // Validators
    this.form.get('payerFirstName').setValidators(Validators.required);
    this.form.get('payerLastName').setValidators(Validators.required);
    this.form.get('payerAddressFrench').setValidators(Validators.required);
  }

  gotoCustomerPeniche() {
    this.router.navigate(
            [this.customerDashboard, this.customerId, 'detail', 'creation-line', 'customer-peniche'],
      {
        queryParams: { typeCustomer: this.typeCustomer },    
        queryParamsHandling: 'merge'
      }
          ); 
  }

  initCreation(): void {
    this.penicheBillAccount.payerTitle = PenicheCivilite.MME;
    this.penicheBillAccount.payerLastName = '';
    this.penicheBillAccount.payerFirstName = '';
    this.penicheBillAccount.payerCompany = '';
    this.penicheBillAccount.payerAddress4 = '';
    this.penicheBillAccount.payerAddress2 = '';
    this.penicheBillAccount.payerAddress3 = '';
    this.penicheBillAccount.payerZipCode = '';
    this.penicheBillAccount.payerCity = '';
    this.penicheBillAccount.payerCountry = 'FRANCE';
    this.penicheBillAccount.titularTitle = PenicheCivilite.MME;
    this.penicheBillAccount.titularLastName = '';
    this.penicheBillAccount.titularFirstName = '';
    this.penicheBillAccount.titularCompany = '';
    this.penicheBillAccount.titularAddress4 = '';
    this.penicheBillAccount.titularAddress2 = '';
    this.penicheBillAccount.titularAddress3 = '';
    this.penicheBillAccount.titularZipCode = '';
    this.penicheBillAccount.titularCity = '';
    this.penicheBillAccount.titularCountry = 'FRANCE';
      
    this.penicheBillAccount.mailNotification = null;
    this.penicheBillAccount.mailOldNotification = '';
    this.penicheBillAccount.typeEnvoi = PenicheTypeEnvoiLivrable.PAPIER_AUTO;
    console.log('init coordonnées bill:', this.penicheBillAccount);
  }

  prepareObjectForSave(): PenicheBillAccountVO {
    this.penicheBillAccount = { ...this.penicheBillAccount, ...this.form.value };
    this.buildTitularAddress();
    this.buildPayerAddress();
    return this.penicheBillAccount;
  }

  buildTitularAddress(): void {
    this.penicheBillAccount.titularAddress5 = '';
    if (this.penicheBillAccount['isOrasTitularAddress'] && this.penicheBillAccount['titularAddressFrench']) {
      this.penicheBillAccount.titularOrasId = this.penicheBillAccount['titularAddressFrench'].orasId;
      this.penicheBillAccount.titularAddress4 = this.buildTitularLine4();
      this.penicheBillAccount.titularZipCode = this.penicheBillAccount['titularAddressFrench'].postalCode;
      this.penicheBillAccount.titularCity = this.penicheBillAccount['titularAddressFrench'].cityName;
      this.penicheBillAccount.titularStreetExtension = this.penicheBillAccount['titularAddressFrench'].streetExtension;
      this.penicheBillAccount.titularStreetName = this.penicheBillAccount['titularAddressFrench'].streetName;
      this.penicheBillAccount.titularStreetType = this.penicheBillAccount['titularAddressFrench'].streetType;
      this.penicheBillAccount.titularStreetNumber = Number(this.penicheBillAccount['titularAddressFrench'].streetNumber);	
      this.penicheBillAccount.titularGeocodeX = Number(this.penicheBillAccount['titularAddressFrench'].geoCodeX);
      this.penicheBillAccount.titularGeocodeY = Number(this.penicheBillAccount['titularAddressFrench'].geoCodeY);
      this.penicheBillAccount.titularOrasId = Number(this.penicheBillAccount['titularAddressFrench'].orasId);
            
      this.penicheBillAccount.titularInseeId = this.penicheBillAccount['titularAddressFrench'].cityInseeId;
      this.penicheBillAccount.titularRivoliId = this.penicheBillAccount['titularAddressFrench'].rivoliCode;
      this.penicheBillAccount.titularCedex = this.penicheBillAccount['titularAddressFrench'].cedex;
      if (!isEmpty(this.penicheBillAccount['titularAddressFrench'].line5)) {
        this.penicheBillAccount.titularAddress5 = this.penicheBillAccount['titularAddressFrench'].line5;	
      }
      if (isEmpty(this.penicheBillAccount['titularAddressFrench'].line6)) {
        this.penicheBillAccount.titularAddress6 = this.penicheBillAccount['titularAddressFrench'].line6;	
      } else {
        this.penicheBillAccount.titularAddress6 = 
        `${this.penicheBillAccount['titularAddressFrench'].postalCode} ${this.penicheBillAccount['titularAddressFrench'].cityName}`;
        if (this.penicheBillAccount['titularAddressFrench'].cedex) {
          this.penicheBillAccount.titularAddress6 += ` ${this.penicheBillAccount['titularAddressFrench'].cedex}`;
        }
      }
    } else {
      this.penicheBillAccount.titularOrasId = null;
      this.penicheBillAccount.titularAddress6 = `${this.penicheBillAccount.titularZipCode} ${this.penicheBillAccount.titularCity}`;
    }
  }

  buildPayerAddress(): void {
    this.penicheBillAccount.payerAddress5 = '';
    if (this.penicheBillAccount['isOrasPayerAddress'] && this.penicheBillAccount['payerAddressFrench']) {
      this.penicheBillAccount.payerOrasId = this.penicheBillAccount['payerAddressFrench'].orasId;
      this.penicheBillAccount.payerAddress4 = this.buildPayerLine4();
      this.penicheBillAccount.payerZipCode = this.penicheBillAccount['payerAddressFrench'].postalCode;
      this.penicheBillAccount.payerCity = this.penicheBillAccount['payerAddressFrench'].cityName;
      this.penicheBillAccount.payerStreetExtension = this.penicheBillAccount['payerAddressFrench'].streetExtension;
      this.penicheBillAccount.payerStreetName = this.penicheBillAccount['payerAddressFrench'].streetName;
      this.penicheBillAccount.payerStreetType = this.penicheBillAccount['payerAddressFrench'].streetType;
      this.penicheBillAccount.payerStreetNumber = Number(this.penicheBillAccount['payerAddressFrench'].streetNumber);	
      this.penicheBillAccount.payerGeocodeX = Number(this.penicheBillAccount['payerAddressFrench'].geoCodeX);
      this.penicheBillAccount.payerGeocodeY = Number(this.penicheBillAccount['payerAddressFrench'].geoCodeY);
      this.penicheBillAccount.payerOrasId = Number(this.penicheBillAccount['payerAddressFrench'].orasId);
            
      this.penicheBillAccount.payerInseeId = this.penicheBillAccount['payerAddressFrench'].cityInseeId;
      this.penicheBillAccount.payerRivoliId = this.penicheBillAccount['payerAddressFrench'].rivoliCode;
      this.penicheBillAccount.payerCedex = this.penicheBillAccount['payerAddressFrench'].cedex;
      if (!isEmpty(this.penicheBillAccount['payerAddressFrench'].line5)) {
        this.penicheBillAccount.payerAddress5 = this.penicheBillAccount['payerAddressFrench'].line5;	
      }
      if (isEmpty(this.penicheBillAccount['payerAddressFrench'].line6)) {
        this.penicheBillAccount.payerAddress6 = this.penicheBillAccount['payerAddressFrench'].line6;	
      } else {
        this.penicheBillAccount.payerAddress6 = 
        `${this.penicheBillAccount['payerAddressFrench'].postalCode} ${this.penicheBillAccount['payerAddressFrench'].cityName}`;
        if (this.penicheBillAccount['payerAddressFrench'].cedex) {
          this.penicheBillAccount.payerAddress6 += ` ${this.penicheBillAccount['payerAddressFrench'].cedex}`;
        }
      }
    } else {
      this.penicheBillAccount.payerOrasId = null;
      this.penicheBillAccount.payerAddress6 = `${this.penicheBillAccount.payerZipCode} ${this.penicheBillAccount.titularCity}`;
    }
  }

  buildTitularLine4(): string {
    if (isEmpty(this.penicheBillAccount['titularAddressFrench'].line4)) {
      let line4 = '';
      if (this.penicheBillAccount['titularAddressFrench'].streetExtension && 
      'Autre' !== this.penicheBillAccount['titularAddressFrench'].streetExtension) {
        line4 += this.penicheBillAccount['titularAddressFrench'].streetExtension;
      }
      if (!isEmpty(this.penicheBillAccount['titularAddressFrench'].streetExtension)) {
        line4 += ` ${this.penicheBillAccount['titularAddressFrench'].streetExtension}`;
      }

      if (!isEmpty(this.penicheBillAccount['titularAddressFrench'].streetName)) {
        line4 += ` ${this.penicheBillAccount['titularAddressFrench'].streetName}`;
      }
      return line4;
    }
    return this.penicheBillAccount['titularAddressFrench'].line4;
  }

  buildPayerLine4(): string {
    if (isEmpty(this.penicheBillAccount['payerAddressFrench'].line4)) {
      let line4 = '';
      if (this.penicheBillAccount['payerAddressFrench'].streetExtension && 
      'Autre' !== this.penicheBillAccount['payerAddressFrench'].streetExtension) {
        line4 += this.penicheBillAccount['payerAddressFrench'].streetExtension;
      }
      if (!isEmpty(this.penicheBillAccount['payerAddressFrench'].streetExtension)) {
        line4 += ` ${this.penicheBillAccount['payerAddressFrench'].streetExtension}`;
      }

      if (!isEmpty(this.penicheBillAccount['payerAddressFrench'].streetName)) {
        line4 += ` ${this.penicheBillAccount['payerAddressFrench'].streetName}`;
      }
      return line4;
    }
    return this.penicheBillAccount['payerAddressFrench'].line4;
  }

  isNotValid(formControlName: string): boolean {
    return this.isSubmitted && this.form.get(formControlName) && 
    this.form.get(formControlName).hasError('required');
  }

  isNotAddressValid(formControlName: string, isOras: string): boolean {
    return this.form.get(formControlName) && this.form.get(isOras) && this.form.get(isOras).value && 
    this.form.get(formControlName).value && typeof this.form.get(formControlName).value !== 'object';
  }

  isSirenNotValid(formControlName: string, isTitular: boolean): boolean {
    if (!isTitular && !this.hasPayerDifferentAddress) {
      return false;
    }
    if (this.form.get(formControlName).value && 
      PenicheCountry.FRANCE.data === this.form.get(isTitular ? 'titularCountry' : 'payerCountry').value) {
      return !/^\d+$/.test(this.form.get(formControlName).value) || 
      this.form.get(formControlName).value.length < 9 || 
      this.form.get(formControlName).value.length > 13;
    }
    return false;
  }

  isSaveValid(): boolean {
    return this.form.valid && !this.isNotAddressValid('titularAddressFrench', 'isOrasTitularAddress') && 
    !this.isNotAddressValid('payerAddressFrench', 'isOrasPayerAddress') && 
    !this.isSirenNotValid('titularSiren', true) && !this.isSirenNotValid('payerSiren', false);
  }

  save(): void {
    this.isSubmitted = true;
    if (this.isSaveValid()) {
      this.getPenicheCustomer();
    }
  }

  getPenicheCustomer(): void {
    this.billingService.getBillCRDetailsByPeniche('PAR', this.penicheBillAccount.customerIdentifier).subscribe(
      (data) => {
        if (data) {
          this.prepareObjectForSave();
          console.log('bills : ', this.penicheBillAccount);
          this.notificationService.setBillAccount(this.penicheBillAccount);
          this.parkWithCfAndCR.customerParkItem = this.customerPark;
          this.parkWithCfAndCR.customerParkItem.numClient = this.penicheBillAccount.identifier;
          this.parkWithCfAndCR.billAccount = this.penicheBillAccount;
          this.parkWithCfAndCR.penicheCustomer = null;
           if(this.route.snapshot.queryParams['modificationLine'] === 'true'){
                this.updateParkWithCompteFacturation();}
            if(this.route.snapshot.queryParams['modificationLine'] === 'false'){
                this.saveParkWithCompteFacturation();}
          
        } else {
          // no client peniche so redirect to client peniche page  
          this.prepareObjectForSave();
          this.notificationService.setBillAccount(this.penicheBillAccount);
          this.customerPark.numClient = this.penicheBillAccount.identifier; 
          this.notificationService.setCPI(this.customerPark);
          this.gotoCustomerPeniche();
        }
      },
      (error) => {
        console.log('Peniche KO: ', error);
      }
      );
  }
  //=============================================================================================
  saveParkWithCompteFacturation(){
    this.parcLigneService.saveParkWithCRAndCF(this.parkWithCfAndCR).subscribe((retour) => {
      console.info('retour ', retour);
    },
    (err) => { 
      this.saveBillAccountFailedDialog();
      //FAILURE : not saved
    },
    () => {    
      // SUCCESS : client peniche exists so redirect to 360
      this.gobackTo();
    });
  }
  //==============================================================================================
  updateParkWithCompteFacturation(){
    this.parcLigneService.updateCustomerParkItem(this.parkWithCfAndCR)
    .subscribe(() => {
    this.gobackTo();
    },
    
    (error) => { 
      if (error.error.error !== '' && error.error.message !== this.transactionError) {
        this.openConfirmationDialog('Erreur Serveur : '+error.error.message,'ok', false);   
    } else {
       this.openConfirmationDialog(this.messageError,'ok',false);  
     }   
    } );
  }
//*************************************************************************** */
openConfirmationDialog(commentText: string,OkText: string, isCancelBtnVisible: boolean): any {
   
  const title = 'Erreur';
  this.confirmationDialogService.confirm(title, commentText, OkText,'Non','lg', isCancelBtnVisible)
  .then((confirmed) => {
    if (confirmed)  {
      this.gobackTo();
    }
   
   } )
  .catch(() => console.log('User dismissed the dialog'));
}
  saveBillAccountFailedDialog(): any {
    const title = 'Erreur';
    const message = `Erreur lors du traitement des données reçues par Péniche.
    Merci de transmettre une signalisation au Run Parnasse.`;
    const btnOkText = 'OK';
    this.confirmationDialogService.confirm(title, message, btnOkText, null, 'lg', false)
    .then((confirmed) => {
      console.info('Utilisateur à confirmé: ', confirmed);
    })
    .catch(() => console.log('User dismissed )'));
  }

  openPenicheCustomerNotFoundDialog(): any {
    const title = 'Erreur';
    const message = `Attention! Le client péniche n'existe pas, veuillez d'abord le créer avant la création d'un compte de facturation.`;
    const btnOkText = 'OK';
    this.confirmationDialogService.confirm(title, message, btnOkText, null, 'lg', false)
    .then((confirmed) => {
      this.router.navigate(
        [this.customerDashboard, this.customerId, 'detail', 'profile-contract', 'creation', 
          CONSTANTS.TYPE_COMPANY === this.typeCustomer ? 4 : 5 ],
        {
          queryParamsHandling: 'merge' 
        }
      );
    })
    .catch(() => console.log('User dismissed )'));
  }

  gobackTo(): any {
    if (this.typeCustomer === 'company') {
      this.router.navigate(
       [this.customerDashboard, this.customerId, 'park-item', 'list-enterprise'],  
        {
          queryParams: { 
            typeCustomer: this.typeCustomer
          },
          queryParamsHandling: 'merge'
        }
          );
    } else {
      this.router.navigate(
        [this.customerDashboard, this.customerId, 'park-item', 'list-particular'],  
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
        const title = 'Erreur!';
        const comment = 'Êtes-vous sûr de vouloir annuler votre saisie ?';
        const btnOkText = 'Oui';
    const btnCancelText = 'Non';
        this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText, 'lg', true)
         .then((confirmed) => {
       if (confirmed) {
         this.cancel();
       } 
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  } 

  cancel(): any {
    if (!isNullOrUndefined(this.seeAll) || !isNullOrUndefined(this.typeRequest)) {
      if ( this.typeCustomer === 'company') {
        this.router.navigate(
            [this.customerDashboard, this.customerId, 'park-item', 'list-enterprise'],  
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
          ['/customer-dashboard', this.customerId, 'park-item', 'list-particular'],  
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
              (this.isEntreprise) ? ['/customer-dashboard/entreprise', this.customerId]  
              : ['/customer-dashboard/particular', this.customerId],
             
            {
              queryParams: { 
                typeCustomer: this.typeCustomer
              },
              queryParamsHandling: 'merge'
            }
            );
    }
  }

  itIsAnEntreprise(): boolean {
    return this.route.snapshot.queryParamMap.get('typeCustomer') === 'company';
  }

}
