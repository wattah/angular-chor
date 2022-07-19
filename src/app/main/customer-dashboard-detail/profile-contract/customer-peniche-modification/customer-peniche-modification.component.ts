import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { OrasPostalAddress } from '../../../../_core/models';
import { ReferenceDataTypeService } from '../../../../_core/services';
import { OrasAddressService } from '../../../../_core/services/oras-address.service';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { PENICHE_CUSTOMER_TYPOLOGY, PERSON_CATEGORY } from '../../../../_core/constants/constants';
import { PenicheCustomerResponseVO, PenicheTypeEnvoiLivrable } from '../../../../_core/models/peniche-customer-response-vo';
import { DatePipe } from '@angular/common';
import { PenicheCountry } from '../../../../_core/constants/peniche-country';
import { CmUsageVO } from '../../../../_core/models/cm-usage-vo';
import { firstNameFormatter } from './../../../../_core/utils/formatter-utils'; 
import { ProfilContractService } from '../profil-contract.service';
@Component({
  selector: 'app-customer-peniche-modification',
  templateUrl: './customer-peniche-modification.component.html',
  styleUrls: ['./customer-peniche-modification.component.scss']
})
export class CustomerPenicheModificationComponent implements OnInit {

  @Input()
  penicheCustomerResponseVO: PenicheCustomerResponseVO = {} as PenicheCustomerResponseVO;

  @Input() cmBillingUsageVO: CmUsageVO;

  // to prevent new data of  form 
  @Output() changeForm = new EventEmitter<PenicheCustomerResponseVO>();

  @Output() changeDirtyPenicheForm = new EventEmitter<boolean>();

  @Output() isAddressFrench = new EventEmitter<boolean>();

  @Output() isFormatValid = new EventEmitter<boolean>();

  @Output() isEntreprise = new EventEmitter<boolean>();

  @Input()
  isPenicheUp = false;
  @Input()
  isClientExist = true;

  @Input()
  identifier: string;

  @Input()
  isSelected = false;
  @Input()
  jiraUrl: string;

  formPeniche: FormGroup;
  typology = new FormControl();
  lTypology = [];
  isCheckFrench = true ;
  isBillReport: boolean;
  isEnvoi = true;
  isEmail = false;
  filteredAddress$: Observable<OrasPostalAddress[]> = null;
  filteredCountry: Observable<Array<{data: string, label: string}>>;
  listCountry: Array<{data: string, label: string}> =  {} as Array<{data: string, label: string}>;
  country = new FormControl();
  addressFrench = new FormControl();
  formatAddressValid = true;

  
showRaisonSociale = false;
showAsterix = true;
civiliteChecked : any ;
isProspectOrContact = false;
  constructor(readonly fb: FormBuilder,
    readonly orasAddressService: OrasAddressService,
    readonly referenceDataTypeService: ReferenceDataTypeService,
    private readonly datePipe: DatePipe,
    private readonly profilContractService: ProfilContractService) { }


  ngOnInit() {
    this.initCountry();
    this.formPeniche = this.buildPenicheFrom();

    if(!isNullOrUndefined(this.penicheCustomerResponseVO)) {
      this.initClienPenicheIsExist();
    }
    this.OnchangeForm();
    this.defaultListTypology();
    this.getFilterAddress();
    this.filteredCountry = this.formPeniche.get('country').valueChanges.pipe(
      startWith(''),
      map(ref => ref ? this._filterCountry(ref) : this.listCountry.slice())
     );
     this.profilContractService.getIsProspectOrContact().subscribe(value => {
      this.isProspectOrContact = value;
     })
  }

    buildPenicheFrom(): any {
    if(!isNullOrUndefined(this.penicheCustomerResponseVO)) {
      return this.fb.group({
        typology: this.typology,
        billReport: this.fb.control(this.penicheCustomerResponseVO.billReport),
        billingTime: this.fb.control(this.penicheCustomerResponseVO.billingTime),
        title: this.fb.control(this.penicheCustomerResponseVO.title),
        society: this.fb.control(this.penicheCustomerResponseVO.society),
        lastName: this.fb.control(this.penicheCustomerResponseVO.lastName),
        firstName: this.fb.control(this.penicheCustomerResponseVO.firstName),
        addressFrench: this.addressFrench,
        deliveryInfo: this.fb.control(this.penicheCustomerResponseVO.deliveryInfo),
        address2: this.fb.control(this.penicheCustomerResponseVO.address2),
        address3: this.fb.control(this.penicheCustomerResponseVO.address3),
        address5: this.fb.control(this.penicheCustomerResponseVO.address5),
        country: this.country,
        zipCode: this.fb.control(this.penicheCustomerResponseVO.zipCode),
        city: this.fb.control(this.penicheCustomerResponseVO.city),
        address4: this.fb.control(this.penicheCustomerResponseVO.address4),
        isCheckFrench: this.fb.control(this.penicheCustomerResponseVO.country === '' ||  this.penicheCustomerResponseVO.country === 'FRANCE'),
        typeEnvoi: this.fb.control(this.penicheCustomerResponseVO.typeEnvoi),
        facture: this.fb.control(''),
        mail: this.fb.control(this.penicheCustomerResponseVO.mailNotification),
        nomInter: this.fb.control('')
      });
    } else {
      this.penicheCustomerResponseVO = {} as PenicheCustomerResponseVO;
      this.penicheCustomerResponseVO.title = 'MME';
      this.penicheCustomerResponseVO.billingTime = 8;
      this.penicheCustomerResponseVO.billReport = false;
      return this.fb.group({
        typology: this.fb.control(PENICHE_CUSTOMER_TYPOLOGY.PARTICULIER),
        billReport: this.fb.control(this.penicheCustomerResponseVO.billReport),
        billingTime: this.fb.control(this.penicheCustomerResponseVO.billingTime),
        title: this.fb.control(this.penicheCustomerResponseVO.title),
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
        isCheckFrench: this.fb.control(true),
        mail: this.fb.control(''),
        nomInter: this.fb.control(''),
        typeEnvoi: this.fb.control(PenicheTypeEnvoiLivrable.PAPIER_AUTO),
        facture: this.fb.control('NON')
      });
    }
    
  }

  initClienPenicheIsExist(): void {
    this.initPostalAddressByOras();
    if(this.penicheCustomerResponseVO.title === 'PM') {
      this.showAsterix = false;
    }

    if(this.penicheCustomerResponseVO.typology === PENICHE_CUSTOMER_TYPOLOGY.ENTREPRISE.key) {
      this.showRaisonSociale = true;
    }

    if(isNullOrUndefined(this.penicheCustomerResponseVO.country) ||
     this.penicheCustomerResponseVO.country === '' ||
     this.penicheCustomerResponseVO.country === 'FRANCE' ) {
      this.formPeniche.get('isCheckFrench').setValue(true);
      this.isCheckFrench = true;
    } else {
      this.formPeniche.get('isCheckFrench').setValue(false);
      this.isCheckFrench = false;
    }
    
    this.checkIsAutoOrManuelOrMail();
  }

  checkIsAutoOrManuelOrMail(): void {
   if(this.penicheCustomerResponseVO.billReport === false ) {
      this.isBillReport =false;
   } else {
      if(!isNullOrUndefined(this.penicheCustomerResponseVO.mailNotification)) {
        this.isEnvoi = false;
        this.isEmail = true;
        this.formPeniche.get('facture').setValue('OUI');
        this.initBillingEmailInfos();
     } else if(this.penicheCustomerResponseVO.typeEnvoi === PenicheTypeEnvoiLivrable.PAPIER_AUTO || 
               this.penicheCustomerResponseVO.typeEnvoi === PenicheTypeEnvoiLivrable.MANUEL) {
        this.formPeniche.get('facture').setValue('NON');
        this.formPeniche.get('typeEnvoi').setValue(this.penicheCustomerResponseVO.typeEnvoi);
        this.isEnvoi = true;
        this.isEmail = false;
     }
      this.isBillReport = true;
    }
 }

 initBillingEmailInfos(): void {
   let personName = ''; 
   if(this.cmBillingUsageVO) {
     this.formPeniche.get('mail').setValue(this.cmBillingUsageVO.cmInterlocuteur.value);
      if (this.cmBillingUsageVO.interlocutor.categoryPersonKey === PERSON_CATEGORY.MORALE) {
      personName= this.cmBillingUsageVO.interlocutor.crmName;   
    } else if (!this.cmBillingUsageVO.interlocutor.firstName && !this.cmBillingUsageVO.interlocutor.lastName) {
      personName = '-';
    } else {
      personName = `${this.cmBillingUsageVO.interlocutor.lastName ?  firstNameFormatter(this.cmBillingUsageVO.interlocutor.lastName) : '-'}  ` + 
            `${this.cmBillingUsageVO.interlocutor.firstName ? firstNameFormatter(this.cmBillingUsageVO.interlocutor.firstName) : '-'}  `;
      }
      this.formPeniche.get('nomInter').setValue(personName);
    }
}

onchangeIsFrench(): void {
  this.isCheckFrench = this.formPeniche.get('isCheckFrench').value;
  this.isAddressFrench.emit(this.isCheckFrench);
}


  initPostalAddressByOras(): OrasPostalAddress {
    const orasPostalAddress = {} as OrasPostalAddress;
    if(!isNullOrUndefined(this.penicheCustomerResponseVO)) {
    orasPostalAddress.orasId = this.penicheCustomerResponseVO.orasId ? String(this.penicheCustomerResponseVO.orasId) : null;
    orasPostalAddress.line4 = this.penicheCustomerResponseVO.address4;
    orasPostalAddress.line6 = this.penicheCustomerResponseVO.address6;
    orasPostalAddress.postalCode = this.penicheCustomerResponseVO.zipCode;
    orasPostalAddress.cityName = this.penicheCustomerResponseVO.city;
    orasPostalAddress.geoCodeX = this.penicheCustomerResponseVO.geocodeX ? String(this.penicheCustomerResponseVO.geocodeX) : null;
    orasPostalAddress.geoCodeY = this.penicheCustomerResponseVO.geocodeY ? String(this.penicheCustomerResponseVO.geocodeY) : null;
    orasPostalAddress.cityInseeId = this.penicheCustomerResponseVO.inseeId;
    orasPostalAddress.rivoliCode = this.penicheCustomerResponseVO.rivoliId;
    orasPostalAddress.streetNumber = this.penicheCustomerResponseVO.streetNumber !== 0 ? String(this.penicheCustomerResponseVO.streetNumber) : '0';
    orasPostalAddress.streetExtension = this.penicheCustomerResponseVO.streetExtension;
    orasPostalAddress.streetType = this.penicheCustomerResponseVO.streetType;
    orasPostalAddress.streetName = this.penicheCustomerResponseVO.streetName;
      this.addressFrench.setValue(orasPostalAddress);
    } else {
      this.addressFrench.setValue(null);
    }
    return orasPostalAddress; 
  }

  initCountry(): void {
     this.listCountry = PenicheCountry.values;
     if(!isNullOrUndefined(this.penicheCustomerResponseVO) && !isNullOrUndefined(this.penicheCustomerResponseVO.country)) {
      this.country.setValue(this.listCountry.find(type => type.data === this.penicheCustomerResponseVO.country))
     }
  }

  getDefaultCountry(val: string): Object {
    return this.listCountry.find(type => type.label.toUpperCase() === val.toUpperCase())
  }

  displayCountry(value: any): string {
    return value ? value.label : '';
  }

  private _filterCountry(value: string): Array<{data: string , label: string}> {
    if(value !== '' && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.listCountry.filter(ref => ref.label.toLowerCase().indexOf(filterValue) === 0);
    }
    return this.listCountry;
    
}

onchangeBillReport(): void {
  this.isBillReport = this.formPeniche.get('billReport').value;
  if(this.isBillReport) {
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

changeFacture(event): void {
  if(event.target.value === 'NON') {
     this.isEnvoi = true;
     this.isEmail = false;
  } else {
    this.isEnvoi = false;
    this.isEmail = true;
    this.initBillingEmailInfos();
  }
}

  defaultListTypology(): void {
    this.lTypology.push(PENICHE_CUSTOMER_TYPOLOGY.PARTICULIER);
    this.lTypology.push(PENICHE_CUSTOMER_TYPOLOGY.ENTREPRISE);
    if(!isNullOrUndefined(this.penicheCustomerResponseVO) && !isNullOrUndefined(this.penicheCustomerResponseVO.typology)) {
      if(this.penicheCustomerResponseVO.typology === PENICHE_CUSTOMER_TYPOLOGY.ENTREPRISE.key) {
        this.typology.setValue(PENICHE_CUSTOMER_TYPOLOGY.ENTREPRISE);
      } else {
        this.typology.setValue(PENICHE_CUSTOMER_TYPOLOGY.PARTICULIER);
      }
    }
  }

  changeTypology(event): void {
    if(this.formPeniche.get('typology').value.key === PENICHE_CUSTOMER_TYPOLOGY.ENTREPRISE.key) {
      this.formPeniche.get('title').setValue('PM');
      this.showRaisonSociale = true;
      this.showAsterix = false ;
    } else {
      this.formPeniche.get('title').setValue('MR');
      this.showAsterix = true ;
      this.showRaisonSociale = false;
    }
  }

 radioChangeCivilite(event: any){
  if(event.target.value === "PM"){
    this.showAsterix = false ;
  }
  if(event.target.value === "MME" || event.target.value === "MR"){
    this.showAsterix = true ;
  }
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

  displayAddress(value: any): string {
    let result = '';
    if(typeof value === 'string') {
      return value;
    }
    this.formatAddressValid = true;
    if(value) {
      if(value.line4) {
        result += `${value.line4} `;
      }
      if(value.postalCode) {
        result += `${value.postalCode} `;
      }
      if(value.cityName) {
        result += `${value.cityName} `;
      }
    } 
    return result;
  }

  isSelectionAddress(): boolean {
    let result  = false;
    if(!isNullOrUndefined(this.addressFrench)) {
      const value = this.formPeniche.get('addressFrench').value;
      result = (value !== '' && typeof value !== 'object') ;
    }
    this.isFormatValid.emit(result);
    return result;
  }
  

  isValidBy(val: string): boolean {
    return ( this.formPeniche.controls[val].touched || this.isSelected) && !this.isProspectOrContact && 
    (this.formPeniche.get(val).value === null || 
    this.formPeniche.get(val).value === undefined || 
    this.formPeniche.get(val).value === '')
  }

  isValidAddressFrench(): boolean {
    return ( this.formPeniche.controls['addressFrench'].touched || this.isSelected) && !this.isProspectOrContact &&
    (this.formPeniche.get('addressFrench').value === null || 
    this.formPeniche.get('addressFrench').value === undefined || 
    this.formPeniche.get('addressFrench').value === '' || this.formPeniche.get('addressFrench').value.line4 === '' ||
    (this.formPeniche.get('billReport').value && (this.formPeniche.get('addressFrench').value.postalCode === null ||
    this.formPeniche.get('addressFrench').value.postalCode === '') && 
    (this.formPeniche.get('addressFrench').value.cityName === null ||
    this.formPeniche.get('addressFrench').value.cityName === '')))
  }

  OnchangeForm(): void {
    if(!isNullOrUndefined(this.formPeniche)) {
      this.formPeniche.valueChanges.subscribe( () => {
        const entreprise = this.formPeniche.get('typology').value.key === PENICHE_CUSTOMER_TYPOLOGY.ENTREPRISE.key;
        this.isEntreprise.emit(entreprise);
        this.isAddressFrench.emit(this.isCheckFrench);
        this.changeDirtyPenicheForm.emit(this.formPeniche.dirty);
        this.changeForm.emit(this.setPenicheVO());
      });
    }
  }

  checkIsEntreprise(val: string): boolean {
    return val === 'PM';
  }

  setPenicheVO(): PenicheCustomerResponseVO {
   const pen = {} as PenicheCustomerResponseVO 
    if(isNullOrUndefined(this.penicheCustomerResponseVO.identifier)) {
      const datePattern = 'yyyy-MM-dd';
      pen.status = 'ACTIF'; 
      pen.trigramme = 'PAR';
      pen.identifier = this.identifier;
      pen.nicheAdmissionDate = this.datePipe.transform(new Date(), datePattern);
      pen.streetNumber = 0;
      pen.typeEnvoi = PenicheTypeEnvoiLivrable.PAPIER_AUTO;
    }

    if(this.formPeniche.get('facture').value === 'OUI' && this.formPeniche.get('billReport').value) {
      pen.mailNotification = this.formPeniche.get('mail').value;
      pen.typeEnvoi =  PenicheTypeEnvoiLivrable.MAIL;
     } else if (this.formPeniche.get('facture').value === 'NON' && this.formPeniche.get('billReport').value) {
      pen.typeEnvoi =  this.formPeniche.get('typeEnvoi').value;
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
    if(this.formPeniche.get('isCheckFrench').value && !isNullOrUndefined(this.formPeniche.get('addressFrench').value)) {
    pen.orasId = this.formPeniche.get('addressFrench').value.orasId;
    pen.address4 = this.formPeniche.get('addressFrench').value.line4 !== '' ? this.formPeniche.get('addressFrench').value.line4 : '' ;
    pen.address6 = this.formPeniche.get('addressFrench').value.line6;
    pen.zipCode = this.formPeniche.get('addressFrench').value.postalCode;
    pen.city = this.formPeniche.get('addressFrench').value.cityName;
    pen.geocodeX = this.formPeniche.get('addressFrench').value.geoCodeX;
    pen.geocodeY = this.formPeniche.get('addressFrench').value.geoCodeY;
    pen.inseeId = this.formPeniche.get('addressFrench').value.cityInseeId;
    pen.rivoliId = this.formPeniche.get('addressFrench').value.rivoliCode;
    pen.streetNumber = isNullOrUndefined(this.formPeniche.get('addressFrench').value.streetNumber) ? 0 :  this.formPeniche.get('addressFrench').value.streetNumber;
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

  showAsterixCity(): boolean {
    return this.formPeniche.get('billReport').value;
  }

  isValidCity(): boolean {
    return ( this.formPeniche.controls['city'].touched || this.isSelected) && 
    (this.formPeniche.get('billReport').value &&
    this.formPeniche.get('city').value === '');
  }

  isValidZipCode(): boolean {
    return ( this.formPeniche.controls['zipCode'].touched || this.isSelected) && 
    (this.formPeniche.get('country').value.data ==='FRANCE' &&
     this.formPeniche.get('billReport').value &&
     this.formPeniche.get('zipCode').value === '');
  }

  showAsterixZipCode(): boolean {
    return this.formPeniche.get('country').value.data ==='FRANCE' && this.formPeniche.get('billReport').value;
  }

  

}
