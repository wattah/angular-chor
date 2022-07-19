import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators';

import { OrasAddressService } from './../../../../_core/services/oras-address.service';
import { ReferenceDataTypeService } from './../../../../_core/services/reference-data-type.service';
import { OrasPostalAddress } from './../../../../_core/models';
import { PenicheBillAccountVO } from '../../../../_core/models/peniche-bill-account-vo';
import { CmUsageVO } from './../../../../_core/models/cm-usage-vo';
import { PenicheTypeEnvoiLivrable, PenicheCivilite } from './../../../../_core/enum/billing-account.enum';
import { PenicheCountry } from './../../../../_core/constants/peniche-country';
import { PERSON_CATEGORY } from './../../../../_core/constants/constants';
import { firstNameFormatter } from './../../../../_core/utils/formatter-utils';
import { isEmpty } from './../../../../_core/utils/string-utils';

@Component({
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  styleUrls: ['./billing-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillingDetailsComponent implements OnInit, OnChanges {
  
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

  billingDetailsForm: FormGroup;
  titularAddressFrench = new FormControl();
  payerAddressFrench = new FormControl();

  @Input() isEditMode: boolean;
  @Input() penicheBillAccount: PenicheBillAccountVO;
  @Input() cmBillingUsageVO: CmUsageVO;
  @Input() submitted: boolean;
  @Output() changeBellingDetailsForm = new EventEmitter<FormGroup>();

  PenicheTypeEnvoiLivrable: typeof PenicheTypeEnvoiLivrable = PenicheTypeEnvoiLivrable;
  PenicheCivilite: typeof PenicheCivilite = PenicheCivilite;

  constructor(readonly route: ActivatedRoute, readonly fb: FormBuilder,
    readonly referenceDataTypeService: ReferenceDataTypeService, readonly orasAddressService: OrasAddressService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });

    this.countryList = PenicheCountry.values;
    if (!this.isEditMode && this.penicheBillAccount) {
      this.initBillingDetailsForm();
    }

    this.getFilteredTitularAddress();
    this.getFilteredPayerAddress();

    if (this.penicheBillAccount && this.penicheBillAccount.identifier) {
      this.compareTitularWithPayer();
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cmBillingUsageVO'] && this.cmBillingUsageVO) {
      this.initBillingEmailInfos();
    }
    if (changes['penicheBillAccount'] && this.penicheBillAccount) {
      if (this.isEditMode && this.penicheBillAccount.identifier) {
        console.info('onChange: ', this.penicheBillAccount);
        this.compareTitularWithPayer();
        this.isOrasTitularAddress = this.checkCountryAndOrasId(true);
        this.isOrasPayerAddress = this.checkCountryAndOrasId(false);
        this.initPostalAddressByOras();
      }
      this.initBillingDetailsForm();
      if (!this.hasPayerDifferentAddress) {
        this.subscribeToTitularAddressControls();
      }
    }
  }

  checkCountryAndOrasId(isTitular): boolean {
    if (isTitular) {
      return this.penicheBillAccount.titularCountry === 'FRANCE' && this.penicheBillAccount.titularOrasId && 
          this.penicheBillAccount.titularOrasId > 0
    }
    return this.penicheBillAccount.payerCountry === 'FRANCE' && this.penicheBillAccount.payerOrasId && 
    this.penicheBillAccount.payerOrasId > 0;
  }

  initBillingDetailsForm(): void {
    this.billingDetailsForm = this.fb.group({
      titularAddressFrench: this.titularAddressFrench,
      payerAddressFrench: this.payerAddressFrench,
      isOrasTitularAddress: this.isOrasTitularAddress,
      isOrasPayerAddress: this.isOrasPayerAddress,

      titularTitle: this.fb.control(this.penicheBillAccount.titularTitle, Validators.required),
      titularLastName: this.fb.control(this.penicheBillAccount.titularLastName),
      titularFirstName: this.fb.control(this.penicheBillAccount.titularFirstName),
      titularCompany: this.fb.control(this.penicheBillAccount.titularCompany),
      titularSiren: this.fb.control(this.penicheBillAccount.titularSiren),
      titularAddress4: this.fb.control(this.penicheBillAccount.titularAddress4),
      titularAddress2: this.fb.control(this.penicheBillAccount.titularAddress2),
      titularAddress3: this.fb.control(this.penicheBillAccount.titularAddress3),
      titularZipCode: this.fb.control(this.penicheBillAccount.titularZipCode),
      titularCity: this.fb.control(this.penicheBillAccount.titularCity),
      titularCountry: this.fb.control(this.penicheBillAccount.titularCountry),

      payerTitle: this.fb.control(this.penicheBillAccount.payerTitle),
      payerLastName: this.fb.control(this.penicheBillAccount.payerLastName),
      payerFirstName: this.fb.control(this.penicheBillAccount.payerFirstName),
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
    this.initElectronicInvoiceInfo();
    this.refreshFormValidators();
    this.changeBellingDetailsForm.emit(this.billingDetailsForm);
    this.onChangeForm();
  }

  onChangeForm(): void {
    if (this.billingDetailsForm) {
      this.billingDetailsForm.valueChanges.subscribe( () => {
        this.refreshFormValidators();
        // formGroupChange
        this.changeBellingDetailsForm.emit(this.billingDetailsForm);
      });
    }
  }

  initBillingEmailInfos(): void {
    if (this.cmBillingUsageVO.cmInterlocuteur !== null) {
    this.billingEmail = this.cmBillingUsageVO.cmInterlocuteur.value;
    }
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
  
  get f(): any { return this.billingDetailsForm.controls; }

  refreshFormValidators(): void {

    if (this.isElectronicInvoice) {
      this.billingDetailsForm.get('mailNotification').setValidators(Validators.required);
    } else {
      this.billingDetailsForm.get('mailNotification').setValidators(null);
    }
    // Titular
    this.refreshTitularFormValidators();

    // Payer
    if (this.hasPayerDifferentAddress) {
      this.refreshPayerFormValidators();
    } else {
      this.billingDetailsForm.get('payerFirstName').setValidators(null);
      this.billingDetailsForm.get('payerLastName').setValidators(null);
      this.billingDetailsForm.get('payerCompany').setValidators(null);
      this.billingDetailsForm.get('payerSiren').setValidators(null);
      this.billingDetailsForm.get('payerCountry').setValidators(null);
      this.billingDetailsForm.get('payerAddress4').setValidators(null);
      this.billingDetailsForm.get('payerAddressFrench').setValidators(null);
    }

    // Update change
    this.updateValueAndValidityChanged();
    
  }

  isTitularSirenRequired(): boolean {
    return !isEmpty(this.billingDetailsForm.get('titularCompany').value) && 
    PenicheCountry.FRANCE.data === this.billingDetailsForm.get('titularCountry').value && 
    (!isEmpty(this.billingDetailsForm.get('titularZipCode').value) && 
    '98000' !== this.billingDetailsForm.get('titularZipCode').value && !this.billingDetailsForm.get('isOrasTitularAddress').value || 
    this.billingDetailsForm.get('titularAddressFrench').value &&
    Object.entries(this.billingDetailsForm.get('titularAddressFrench').value).length !== 0 && 
    !isEmpty(this.billingDetailsForm.get('titularAddressFrench').value.postalCode) &&
    '98000' !== this.billingDetailsForm.get('titularAddressFrench').value.postalCode) ;
  }

  isPayerSirenRequired(): boolean {
    return !isEmpty(this.billingDetailsForm.get('payerCompany').value) && 
    PenicheCountry.FRANCE.data === this.billingDetailsForm.get('payerCountry').value && 
    (!isEmpty(this.billingDetailsForm.get('payerZipCode').value) && 
    '98000' !== this.billingDetailsForm.get('payerZipCode').value && !this.billingDetailsForm.get('isOrasPayerAddress').value || 
    this.billingDetailsForm.get('payerAddressFrench').value && 
    Object.entries(this.billingDetailsForm.get('payerAddressFrench').value).length !== 0 && 
    !isEmpty(this.billingDetailsForm.get('payerAddressFrench').value.postalCode) && 
    '98000' !== this.billingDetailsForm.get('payerAddressFrench').value.postalCode) ;
  }

  refreshTitularFormValidators(): void {
    if (PenicheCivilite.PM === this.billingDetailsForm.get('titularTitle').value ) {
      this.billingDetailsForm.get('titularCompany').setValidators(Validators.required);
      this.billingDetailsForm.get('titularLastName').setValidators(null);
      this.billingDetailsForm.get('titularFirstName').setValidators(null);
      if (this.isTitularSirenRequired()) {
        this.billingDetailsForm.get('titularSiren').setValidators(Validators.required);
      } else {
        this.billingDetailsForm.get('titularSiren').setValidators(null);
      }
    } else {
      this.billingDetailsForm.get('titularFirstName').setValidators(Validators.required);
      this.billingDetailsForm.get('titularLastName').setValidators(Validators.required);
      this.billingDetailsForm.get('titularCompany').setValidators(null);
      this.billingDetailsForm.get('titularSiren').setValidators(null);
    }

    if ( this.billingDetailsForm.get('isOrasTitularAddress').value ) {
      this.billingDetailsForm.get('titularAddressFrench').setValidators(Validators.required);
      this.billingDetailsForm.get('titularCountry').setValidators(null);
      this.billingDetailsForm.get('titularCity').setValidators(null);
      this.billingDetailsForm.get('titularAddress4').setValidators(null);
    } else {
      this.billingDetailsForm.get('titularCountry').setValidators(Validators.required);
      this.billingDetailsForm.get('titularCity').setValidators(Validators.required);
      this.billingDetailsForm.get('titularAddress4').setValidators(Validators.required);
      this.billingDetailsForm.get('titularAddressFrench').setValidators(null);
    }
  }

  refreshPayerFormValidators(): void { 
    if (PenicheCivilite.PM === this.billingDetailsForm.get('payerTitle').value ) {
      this.billingDetailsForm.get('payerCompany').setValidators(Validators.required);
      this.billingDetailsForm.get('payerLastName').setValidators(null);
      this.billingDetailsForm.get('payerFirstName').setValidators(null);
      if (this.isPayerSirenRequired()) {
        this.billingDetailsForm.get('payerSiren').setValidators(Validators.required);
      } else {
        this.billingDetailsForm.get('payerSiren').setValidators(null);
      }
    } else {
      this.billingDetailsForm.get('payerFirstName').setValidators(Validators.required);
      this.billingDetailsForm.get('payerLastName').setValidators(Validators.required);
      this.billingDetailsForm.get('payerCompany').setValidators(null);
      this.billingDetailsForm.get('payerSiren').setValidators(null);
    }

    if ( this.billingDetailsForm.get('isOrasPayerAddress').value ) {
      this.billingDetailsForm.get('payerAddressFrench').setValidators(Validators.required);
      this.billingDetailsForm.get('payerCountry').setValidators(null);
      this.billingDetailsForm.get('payerCity').setValidators(null);
      this.billingDetailsForm.get('payerAddress4').setValidators(null);
    } else {
      this.billingDetailsForm.get('payerCountry').setValidators(Validators.required);
      this.billingDetailsForm.get('payerCity').setValidators(Validators.required);
      this.billingDetailsForm.get('payerAddress4').setValidators(Validators.required);
      this.billingDetailsForm.get('payerAddressFrench').setValidators(null);
    }
  }

  updateValueAndValidityChanged(): void {
    this.billingDetailsForm.get('titularFirstName').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('titularLastName').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('titularCompany').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('titularSiren').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('titularAddressFrench').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('titularAddress4').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('titularCountry').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('titularCity').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('payerFirstName').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('payerLastName').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('payerCompany').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('payerSiren').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('payerAddressFrench').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('payerAddress4').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('payerCountry').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.billingDetailsForm.get('payerCity').updateValueAndValidity({ onlySelf: true, emitEvent: false });

  }
  initElectronicInvoiceInfo(): void {
    if (this.billingEmail === this.billingDetailsForm.get('mailNotification').value) {
      this.isElectronicInvoice = true;
      this.billingDetailsForm.get('typeEnvoi').setValue(PenicheTypeEnvoiLivrable.MAIL);
      this.billingDetailsForm.get('idMailNotification').setValue(this.cmBillingUsageVO.cmInterlocuteur.id);
      this.billingDetailsForm.get('idMailOldNotification').setValue(this.cmBillingUsageVO.cmInterlocuteur.id);
    } else {
      this.isElectronicInvoice = false;
      this.billingDetailsForm.get('typeEnvoi').setValue(PenicheTypeEnvoiLivrable.PAPIER_AUTO);
      this.billingDetailsForm.get('mailNotification').setValue(null);
      this.billingDetailsForm.get('idMailNotification').setValue(0);
      this.billingDetailsForm.get('idMailOldNotification').setValue(0);
      
    }
  }

  electronicInvoiceChange(): void {
    if (this.isElectronicInvoice) {
      this.billingDetailsForm.get('typeEnvoi').setValue(PenicheTypeEnvoiLivrable.MAIL);
      if (this.cmBillingUsageVO && this.billingEmail !== this.billingDetailsForm.get('mailNotification').value) {
        this.billingDetailsForm.get('idMailNotification').setValue(this.cmBillingUsageVO.cmInterlocuteur.id);
        this.billingDetailsForm.get('idMailOldNotification').setValue(this.cmBillingUsageVO.cmInterlocuteur.id);
        this.billingDetailsForm.get('mailNotification').setValue(this.cmBillingUsageVO.cmInterlocuteur.value);
      } else {   
        this.billingDetailsForm.get('mailNotification').setValue(null);
      }
    } else {
      this.billingDetailsForm.get('typeEnvoi').setValue(PenicheTypeEnvoiLivrable.PAPIER_AUTO);
      this.billingDetailsForm.get('idMailNotification').setValue(0);
      this.billingDetailsForm.get('idMailOldNotification').setValue(0);
      this.billingDetailsForm.get('mailNotification').setValue(null);
    }
  }

  titularAddressChange(event: any): void {
    if (event.checked) {
      this.billingDetailsForm.get('titularCountry').setValue('FRANCE');
      this.billingDetailsForm.get('isOrasTitularAddress').setValue(true);
    } else {
      this.billingDetailsForm.get('titularAddressFrench').setValue(null);
      this.billingDetailsForm.get('titularCountry').setValue(null);
      this.billingDetailsForm.get('isOrasTitularAddress').setValue(false);
    }
    this.billingDetailsForm.get('titularCountry').updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  payerAddressChange(event: any): void {
    if (event.checked) {
      this.billingDetailsForm.get('payerCountry').setValue('FRANCE');
      this.billingDetailsForm.get('isOrasPayerAddress').setValue(true);
    } else {
      this.billingDetailsForm.get('payerAddressFrench').setValue(null);
      this.billingDetailsForm.get('payerCountry').setValue(null);
      this.billingDetailsForm.get('isOrasPayerAddress').setValue(false);
    }
    this.billingDetailsForm.get('payerCountry').updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  onTitleChange(isTitular: boolean): void {
    if (isTitular) {
      if (PenicheCivilite.PM === this.billingDetailsForm.get('titularTitle').value) {
        this.billingDetailsForm.get('titularFirstName').setValue('');
        this.billingDetailsForm.get('titularLastName').setValue('');
      } else {
        this.billingDetailsForm.get('titularCompany').setValue('');
        this.billingDetailsForm.get('titularSiren').setValue(null);
      }
    } else {
      if (PenicheCivilite.PM === this.billingDetailsForm.get('titularTitle').value) {
        this.billingDetailsForm.get('payerFirstName').setValue('');
        this.billingDetailsForm.get('payerLastName').setValue('');
      } else {
        this.billingDetailsForm.get('payerCompany').setValue('');
        this.billingDetailsForm.get('payerSiren').setValue(null);
      }
    }
  }

  isNotValid(formControlName: string): boolean {
    return this.submitted && this.billingDetailsForm.get(formControlName) && 
    this.billingDetailsForm.get(formControlName).hasError('required');
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

  compareTitularWithPayer(): void {
    if ( this.penicheBillAccount.payerOrasId === this.penicheBillAccount.titularOrasId &&
      this.penicheBillAccount.payerCompany === this.penicheBillAccount.titularCompany && 
      this.penicheBillAccount.payerSiren === this.penicheBillAccount.titularSiren &&
      this.penicheBillAccount.payerTitle === this.penicheBillAccount.titularTitle && 
      this.penicheBillAccount.payerLastName === this.penicheBillAccount.titularLastName && 
      this.penicheBillAccount.payerFirstName === this.penicheBillAccount.titularFirstName && 
      this.penicheBillAccount.payerAddress2 === this.penicheBillAccount.titularAddress2 && 
      this.penicheBillAccount.payerAddress3 === this.penicheBillAccount.titularAddress3 && 
      this.penicheBillAccount.payerCountry === this.penicheBillAccount.titularCountry && 
        (this.penicheBillAccount.titularCountry === 'FRANCE' && 
        this.penicheBillAccount.titularOrasId === this.penicheBillAccount.payerOrasId) || 
        (this.penicheBillAccount.titularCountry !== 'FRANCE' && 
        this.penicheBillAccount.payerAddress4 === this.penicheBillAccount.titularAddress4 &&
        this.penicheBillAccount.payerZipCode === this.penicheBillAccount.titularZipCode && 
        this.penicheBillAccount.payerCity === this.penicheBillAccount.titularCity) ) {
      this.hasPayerDifferentAddress = false;
    }
  }

  diffAddressChange(event): void {
    if (event.checked) {
      this.billingDetailsForm.get('isOrasPayerAddress').setValue(true);
      this.initPayerInfos();
    } else {
      this.duplicateTitularInPayer();
      this.subscribeToTitularAddressControls();
    }
    this.onChangeForm();
  }

  subscribeToTitularAddressControls(): void {
    this.billingDetailsForm.get('isOrasTitularAddress').valueChanges.subscribe(valIsOras => {
      if (!this.hasPayerDifferentAddress) {
        this.billingDetailsForm.get('isOrasPayerAddress').setValue(valIsOras);
      }
    });
    this.billingDetailsForm.get('titularFirstName').valueChanges.subscribe(valFN => {
      if (!this.hasPayerDifferentAddress) {
        this.billingDetailsForm.get('payerFirstName').setValue(valFN);
      }
    });
    this.billingDetailsForm.get('titularLastName').valueChanges.subscribe(valLN => {
      if (!this.hasPayerDifferentAddress) {
        this.billingDetailsForm.get('payerLastName').setValue(valLN);
      }
    });
    this.billingDetailsForm.get('titularCompany').valueChanges.subscribe(valCompany => {
      if (!this.hasPayerDifferentAddress) {
        this.billingDetailsForm.get('payerCompany').setValue(valCompany);
      }
    });
    this.billingDetailsForm.get('titularSiren').valueChanges.subscribe(valSiren => {
      if (!this.hasPayerDifferentAddress) {
        this.billingDetailsForm.get('payerSiren').setValue(valSiren);
      }
    });
    this.billingDetailsForm.get('titularTitle').valueChanges.subscribe(valTitle => {
      if (!this.hasPayerDifferentAddress) {
        this.billingDetailsForm.get('payerTitle').setValue(valTitle);
      }
    });
    this.billingDetailsForm.get('titularCountry').valueChanges.subscribe(valCountry => {
      if (!this.hasPayerDifferentAddress) {
        this.billingDetailsForm.get('payerCountry').setValue(valCountry);
      }
    });
    this.billingDetailsForm.get('titularAddress2').valueChanges.subscribe(valAdd2 => {
      if (!this.hasPayerDifferentAddress) {
        this.billingDetailsForm.get('payerAddress2').setValue(valAdd2);
      }
    });
    this.billingDetailsForm.get('titularAddress3').valueChanges.subscribe(valAdd3 => {
      if (!this.hasPayerDifferentAddress) {
        this.billingDetailsForm.get('payerAddress3').setValue(valAdd3);
      }
    });
    this.billingDetailsForm.get('titularAddressFrench').valueChanges.subscribe(valAddress => {
      if (!this.hasPayerDifferentAddress) {
        this.billingDetailsForm.get('payerAddressFrench').setValue(valAddress);
      }
    });
    this.billingDetailsForm.get('titularAddress4').valueChanges.subscribe(valAdd4 => {
      if (!this.hasPayerDifferentAddress) {
        this.billingDetailsForm.get('payerAddress4').setValue(valAdd4);
      }
    });
    this.billingDetailsForm.get('titularZipCode').valueChanges.subscribe(valZC => {
      if (!this.hasPayerDifferentAddress) {
        this.billingDetailsForm.get('payerZipCode').setValue(valZC);
      }
    });
    this.billingDetailsForm.get('titularCity').valueChanges.subscribe(valCity => {
      if (!this.hasPayerDifferentAddress) {
        this.billingDetailsForm.get('payerCity').setValue(valCity);
      }
    });
  }

  duplicateTitularInPayer(): void {
    this.billingDetailsForm.get('isOrasPayerAddress').setValue(this.billingDetailsForm.get('isOrasTitularAddress').value);
    this.billingDetailsForm.get('payerFirstName').setValue(this.billingDetailsForm.get('titularFirstName').value);
    this.billingDetailsForm.get('payerLastName').setValue(this.billingDetailsForm.get('titularLastName').value);
    this.billingDetailsForm.get('payerCompany').setValue(this.billingDetailsForm.get('titularCompany').value);
    this.billingDetailsForm.get('payerSiren').setValue(this.billingDetailsForm.get('titularSiren').value);
    this.billingDetailsForm.get('payerTitle').setValue(this.billingDetailsForm.get('titularTitle').value);
    this.billingDetailsForm.get('payerCountry').setValue(this.billingDetailsForm.get('titularCountry').value);
    this.billingDetailsForm.get('payerAddress2').setValue(this.billingDetailsForm.get('titularAddress2').value);
    this.billingDetailsForm.get('payerAddress3').setValue(this.billingDetailsForm.get('titularAddress3').value);
    if (this.billingDetailsForm.get('isOrasTitularAddress').value) {
      this.billingDetailsForm.get('payerAddressFrench').setValue(this.billingDetailsForm.get('titularAddressFrench').value);
    } else {
      this.billingDetailsForm.get('payerAddress4').setValue(this.billingDetailsForm.get('titularAddress4').value);
      this.billingDetailsForm.get('payerZipCode').setValue(this.billingDetailsForm.get('titularZipCode').value);
      this.billingDetailsForm.get('payerCity').setValue(this.billingDetailsForm.get('titularCity').value);
    }
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
    if (this.isOrasPayerAddress) {
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
    this.payerAddressFrench.reset();
    this.billingDetailsForm.get('payerFirstName').setValue('');
    this.billingDetailsForm.get('payerLastName').setValue('');
    this.billingDetailsForm.get('payerCompany').setValue('');
    this.billingDetailsForm.get('payerSiren').setValue(null);
    this.billingDetailsForm.get('payerCountry').setValue('FRANCE');
    this.billingDetailsForm.get('payerAddress4').setValue('');
    this.billingDetailsForm.get('payerTitle').setValue(PenicheCivilite.MME);
    this.billingDetailsForm.get('payerAddress2').setValue('');
    this.billingDetailsForm.get('payerAddress3').setValue('');
    this.billingDetailsForm.get('payerZipCode').setValue('');
    this.billingDetailsForm.get('payerCity').setValue('');
  }

}
