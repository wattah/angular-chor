import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ContactMethodService, PersonService, ReferenceDataTypeService } from '../../../_core/services';
import { emailIsValid, isNullOrUndefined } from '../../../_core/utils/string-utils';
import { Interlocutor } from '../../../_core/models/interlocutor/crud/interlocutor';
import { getDecryptedValue } from '../../../_core/utils/functions-utils';
import { ContactMethodNew } from '../../../_core/models/interlocutor/crud/contact-methode-new';
import { TYPE_CM_INTERLOCUTOR, CM_MEDIA_REF_KEY } from '../../../_core/constants/constants';
import { CmPostalAddressVO } from '../../../_core/models/cm-postaladdress-vo';
import { OrasPostalAddress, ReferenceDataVO } from '../../../_core/models';
import { Observable, of } from 'rxjs';
import { startWith, debounceTime, switchMap, map, catchError } from 'rxjs/operators';
import { OrasAddressService } from '../../../_core/services/oras-address.service';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Role } from '../../../_core/models/interlocutor/crud/role';


@Component({
  selector: 'app-modification-entreprise',
  templateUrl: './modification-entreprise.component.html',
  styleUrls: ['./modification-entreprise.component.scss']
})
export class ModificationEntrepriseComponent extends ComponentCanDeactivate implements OnInit {

  customerId: string;
  typeCustomer: string;
  personId: number;
  companyName: string;
  interlocutor: Interlocutor;
  roles: Role[] = [];
  phoneFixe = new FormControl();
  cmFixe: ContactMethodNew = {} as ContactMethodNew;
  mobile = new FormControl();
  cmMobile: ContactMethodNew = {} as ContactMethodNew;
  mail = new FormControl(); 
  cmMail: ContactMethodNew = {} as ContactMethodNew;
  address = new FormControl();
  cmAdrress: ContactMethodNew = {} as ContactMethodNew;
  checkIsFrench = new FormControl();
  adresseFrench = new FormControl();
  addressCountry = new FormControl();
  codePostal = new FormControl();
  ville = new FormControl();
  adresse = new FormControl();
  appt = new FormControl();
  batiment = new FormControl();
  codePorte = new FormControl();
  filteredAddress$: Observable<OrasPostalAddress[]> = null;
  filteredCountry: Observable<ReferenceDataVO[]>;
  listCountry: ReferenceDataVO[] = [];


  fixeValide = true;
  mobileValide = true;
  numeroValid = true;
  mailValide = true;
  formatMailValide = true;
  adresseFrancaisValide = true;
  addressCountryValide = true;
  adresseValide = true;
  formatAddressValid = true;


  form: FormGroup = this.fb.group({
    phoneFixe: this.phoneFixe,
    mobile: this.mobile,
    email: this.mail,
    checkIsFrench: this.checkIsFrench,
    adresseFrench: this.adresseFrench,
    addressCountry: this.addressCountry,
    codePostal: this.codePostal,
    ville: this.ville,
    adresse: this.adresse,
    appt: this.appt,
    batiment: this.batiment,
    codePorte: this.codePorte
  });

  submitted: boolean;
  
  constructor(private readonly route: ActivatedRoute, private readonly fb: FormBuilder, 
    private readonly contactMethodService: ContactMethodService, 
    private readonly orasAddressService: OrasAddressService, 
    private readonly referenceDataTypeService: ReferenceDataTypeService,
    private readonly router: Router, 
    private readonly _snackBar: MatSnackBar,
    private readonly personService: PersonService) {
      super();
  }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
    });

    this.route.paramMap.subscribe(params => {
      this.personId = Number(params.get('personId'));
      this.personService.getCompanyNameByCustomerIdAndRoleEntrepriseAndBenef(this.personId, this.customerId).subscribe(
        data => {
          if(data !== '') {
            this.companyName = data;
          } else {
            this.companyName = null;
          }
         
        });
    });

    this.route.queryParamMap.subscribe(params => {
      this.typeCustomer = params.get('typeCustomer');
    });

    this.initLCm(); 
    this.initCountry();
    this.getFilterAddress();

    this.filteredCountry = this.addressCountry.valueChanges.pipe(
      startWith(''),
      map(ref => ref ? this._filterCountry(ref) : this.listCountry.slice())
     );
  }

  initLCm(): void {
    this.route.paramMap.subscribe(params => {
      this.contactMethodService.findInterlocutorByPersonId(Number(params.get('personId')), getDecryptedValue(this.customerId)).subscribe( data => {
       this.interlocutor = data;
       if (!isNullOrUndefined(this.interlocutor)) {
          this.roles = this.interlocutor.roles;
          this.getCm(this.interlocutor.listCm);
       }
      });
    });
  }

  getCm(cms: ContactMethodNew[]) {
    if(!isNullOrUndefined(cms)) {
      this.getCmMailPricipal(cms);
      this.getCmFixePricipal(cms);
      this.getCmMobilePricipal(cms);

      this.initAddress(this.getCmAdressPricipal(cms));
    }
  }

  getCmMailPricipal(cms: ContactMethodNew[]) {
    for(const cm of cms) {
      for(const type of cm.types) {
        if(type.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key && cm.refMediaKey === CM_MEDIA_REF_KEY.EMAIL)  {
         this.mail.setValue(cm.value);
         this.cmMail.idCm = cm.idCm;
         this.cmMail.value = cm.value;
         this.cmMail.refMediaKey = cm.refMediaKey;
         this.cmMail.typeKey = TYPE_CM_INTERLOCUTOR.PRINCIPAL.key;
          break;
        }
      }
    }
  }

  preventSpecialCharacters(event: any): void {
    let key: any;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text');
    } else {
      key = event.keyCode || event.which;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]/;
    if ( !regex.test(key) ) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }
  
  getCmMobilePricipal(cms: ContactMethodNew[]) {
    for(const cm of cms) {
      for(const type of cm.types) {
        if(type.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key && cm.refMediaKey === CM_MEDIA_REF_KEY.TEL_MOBILE)  {
          this.mobile.setValue(this.initNumAndDrapeau(cm.value));
          this.cmMobile.idCm = cm.idCm;
          this.cmMobile.value = cm.value;
          this.cmMobile.refMediaKey = cm.refMediaKey;
          this.cmMobile.typeKey = TYPE_CM_INTERLOCUTOR.PRINCIPAL.key;
          break;
        }
      }
    }
  }
  getCmFixePricipal(cms: ContactMethodNew[]) {
    for(const cm of cms) {
      for(const type of cm.types) {
        if(type.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key && cm.refMediaKey === CM_MEDIA_REF_KEY.TEL_FIXE)  {
          this.phoneFixe.setValue(this.initNumAndDrapeau(cm.value));
          this.cmFixe.idCm = cm.idCm;
          this.cmFixe.value = cm.value;
          this.cmFixe.refMediaKey = cm.refMediaKey;
          this.cmFixe.typeKey = TYPE_CM_INTERLOCUTOR.PRINCIPAL.key;
          break;
        }
      }
    }
  }

  initNumAndDrapeau(num: string): string {
    let numMobile = num;
    const numChartAt = !isNullOrUndefined(num) ? num.charAt(0) : '';
    if(numChartAt === '0') {
      numMobile = `+33${num.substring(1)}`;
    }
    return numMobile;
  }

  getCmAdressPricipal(cms: ContactMethodNew[]): ContactMethodNew {
    let exist = false;
    for(const cm of cms) {
      for(const type of cm.types) {
        if(type.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key && cm.refMediaKey === CM_MEDIA_REF_KEY.POSTAL_ADDRESS)  {
          this.cmAdrress.idCm = cm.idCm;
         this.cmAdrress = cm;
         this.cmAdrress.refMediaKey = cm.refMediaKey;
         this.cmAdrress.typeKey = TYPE_CM_INTERLOCUTOR.PRINCIPAL.key;
         exist = true;
          break;
        }
      }
      if(exist === true) {
        break;
      }
    }
    return this.cmAdrress;
  }

  initAddress(adresse: ContactMethodNew): void {
      if(!isNullOrUndefined(adresse) && !isNullOrUndefined(adresse.idCm)) {
            const orasPostalAddress = {} as OrasPostalAddress;
            this.appt.setValue(adresse.addressPostal.addrLine3);
            this.batiment.setValue(adresse.addressPostal.addrLine2);
            this.codePorte.setValue(adresse.addressPostal.logisticInfo)
        if(!isNullOrUndefined(adresse.addressPostal.country) &&
            adresse.addressPostal.country === 'France') {
              this.checkIsFrench.setValue(true);
              orasPostalAddress.postalCode = adresse.addressPostal.postalCode;
              orasPostalAddress.cityName = adresse.addressPostal.city;
              if(!isNullOrUndefined(adresse.addressPostal.streetNumber)) {
                orasPostalAddress.streetNumber = String(adresse.addressPostal.streetNumber);
              }
              orasPostalAddress.line4 = adresse.addressPostal.addrLine4;
              orasPostalAddress.streetType = adresse.addressPostal.streetType;
              orasPostalAddress.streetName = adresse.addressPostal.streetName;
              orasPostalAddress.orasId = String(adresse.addressPostal.orasId);
              orasPostalAddress.streetExtension = adresse.addressPostal.streetExtension;
              orasPostalAddress.geoCodeX = String(adresse.addressPostal.geoCodeX);
              orasPostalAddress.cityInseeId = adresse.addressPostal.inseeCode;
              orasPostalAddress.rivoliCode = adresse.addressPostal.rivoliCode;
              orasPostalAddress.cedex = adresse.addressPostal.cedex;
              orasPostalAddress.geoCodeY = String(adresse.addressPostal.geoCodeY);
              orasPostalAddress.line5 = adresse.addressPostal.addrLine5;
              orasPostalAddress.line6 = adresse.addressPostal.addrLine6;
              this.adresseFrench.setValue(orasPostalAddress);
          } else if(!isNullOrUndefined(adresse.addressPostal.refCountry)){
            this.addressCountry.setValue(adresse.addressPostal.refCountry);
            this.codePostal.setValue(adresse.addressPostal.postalCode);
            this.ville.setValue(adresse.addressPostal.city);
            this.adresse.setValue(adresse.addressPostal.addrLine4);
        }
      } else {
        this.checkIsFrench.setValue(true);
      }
     }

getFilterAddress(): void {
  this.filteredAddress$ = this.adresseFrench.valueChanges.pipe(
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

displayCountry(value: any): string {
  return value ? value.label : '';
}

lookup(value: string): Observable<OrasAddressService[]> {
  return this.orasAddressService.getFullAdresse(value).pipe(
    map(results => results),
    catchError(_ => {
      return of(null);
    })
  );
}

private _filterCountry(value: string): ReferenceDataVO[] {
  if(typeof value === 'string') {
    const filterValue = value.toLowerCase();
    return this.listCountry.filter(ref => ref.label.toLowerCase().indexOf(filterValue) === 0);
  }
  return [];
}

initCountry(): void {
  this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('COUNTRY',1).subscribe(data => {
   this.listCountry = data;
 });
}

isCheckFrench(): boolean {
  if(! isNullOrUndefined(this.form.get('checkIsFrench'))) {
    return this.form.get('checkIsFrench').value;
  }
  return false;
}

isSelectionAddress(): boolean {
  if(!isNullOrUndefined(this.adresseFrench)) {
    const value = this.adresseFrench.value;
  return (value !== '' && typeof value !== 'object') ;
  }
  return false;
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

checkValide(): boolean {
  if(!this.numeroValid || !this.mailValide || !this.formatMailValide || !this.adresseFrancaisValide ||
     !this.addressCountryValide   || !this.adresseValide || !this.formatAddressValid) {
      return true;
    }
  return false;
}


isDepasse69caracter(): boolean {
  let isExist = false;
  let number = 0;
  if(this.batiment.value !== null) {
    number = number + this.batiment.value.length;
  }
  if (this.codePorte.value !== null) {
    number = number + this.codePorte.value.length
  }
  if (this.appt.value !== null) {
    number = number + this.appt.value.length
  }
    if ( number > 69) {
      isExist =  true;
    }
  return isExist;
}

update(): void {
  this.initValidate();
  if(!this.notValidateForm() && !this.isDepasse69caracter()) {
    this.personService.updateTitulaire(this.preparedObjetToUpdate()).subscribe( data => {
      if(data === true) {
        this.openSnackBar('vos données ont bien été enregistrées.', undefined);
      }
    this.redirect(false, true);
    });
  } 
}

preparedObjetToUpdate(): Interlocutor {
  const interlocutor = {} as Interlocutor;
  interlocutor.listCm = [] ;
  interlocutor.idPerson = this.personId;
  const numFixe = this.getNumWithoutFrench(this.phoneFixe.value);

  if(isNullOrUndefined(this.cmFixe.idCm )) {
     this.cmFixe.idCm = 0;
     this.cmFixe.refMediaKey = CM_MEDIA_REF_KEY.TEL_FIXE;
     this.cmFixe.typeKey = TYPE_CM_INTERLOCUTOR.PRINCIPAL.key;
   }

   if(numFixe !== null && numFixe !== '0' && numFixe !== '' ) {
    this.cmFixe.value = numFixe;
    interlocutor.listCm.push(this.cmFixe) 
   }

  if(isNullOrUndefined(this.cmMobile.idCm )) {
    this.cmMobile.idCm = 0;
    this.cmMobile.refMediaKey = CM_MEDIA_REF_KEY.TEL_MOBILE;
    this.cmMobile.typeKey = TYPE_CM_INTERLOCUTOR.PRINCIPAL.key;
  }
  const numMobile = this.getNumWithoutFrench(this.mobile.value);
    
  if(numMobile !== null &&numMobile !== '0' && numMobile !== '' ) {
    this.cmMobile.value = numMobile;
    interlocutor.listCm.push(this.cmMobile) 
  }

  const ids = [];

   if( ( numFixe === null || numFixe === '0' || numFixe === '' ) && this.cmFixe.idCm > 0) {
     ids.push(this.cmFixe.idCm);
   }

  if( ( numMobile === null || numMobile === '0' || numMobile === '' ) && this.cmMobile.idCm > 0) {
    ids.push(this.cmMobile.idCm);
  }

  this.contactMethodService.deleteContactMethodById(ids).subscribe( data => console.log(data));

  if(isNullOrUndefined(this.cmMail.idCm )) {
    this.cmMail.idCm = 0;
    this.cmMail.refMediaKey = CM_MEDIA_REF_KEY.EMAIL;
    this.cmMail.typeKey = TYPE_CM_INTERLOCUTOR.PRINCIPAL.key;
  }

  this.cmMail.value = this.mail.value
  interlocutor.listCm.push(this.cmMail) 

  if(isNullOrUndefined(this.cmAdrress.idCm )) {
    this.cmAdrress.idCm = 0;
    this.cmAdrress.refMediaKey = CM_MEDIA_REF_KEY.POSTAL_ADDRESS;
    this.cmAdrress.typeKey = TYPE_CM_INTERLOCUTOR.PRINCIPAL.key;
  }
  this.cmAdrress.addressPostal = this.preparedObjetForAddress();
  
  interlocutor.listCm.push(this.cmAdrress);
  return interlocutor
}

preparedObjetForAddress(): CmPostalAddressVO {
  this.cmAdrress.addressPostal = {} as CmPostalAddressVO;
  this.cmAdrress.addressPostal.personId = this.personId;
  if(this.checkIsFrench.value === true && !isNullOrUndefined(this.adresseFrench.value)) {
      this.cmAdrress.addressPostal.city = this.adresseFrench.value.cityName;
      this.cmAdrress.addressPostal.postalCode = this.adresseFrench.value.postalCode;
      this.cmAdrress.addressPostal.streetExtension = this.adresseFrench.value.streetExtension;
      this.cmAdrress.addressPostal.streetName = this.adresseFrench.value.streetName;
      this.cmAdrress.addressPostal.streetNumber = this.adresseFrench.value.streetNumber;
      this.cmAdrress.addressPostal.streetType = this.adresseFrench.value.streetType;
      this.cmAdrress.addressPostal.geoCodeX = this.adresseFrench.value.geoCodeX;
      this.cmAdrress.addressPostal.orasId = this.adresseFrench.value.orasId;
      this.cmAdrress.addressPostal.inseeCode = this.adresseFrench.value.cityInseeId;
      this.cmAdrress.addressPostal.rivoliCode = this.adresseFrench.value.rivoliCode;
      this.cmAdrress.addressPostal.cedex = this.adresseFrench.value.cedex;
      this.cmAdrress.addressPostal.geoCodeY = this.adresseFrench.value.geoCodeY;
      this.cmAdrress.addressPostal.addrLine5 = this.adresseFrench.value.line5;
      this.cmAdrress.addressPostal.addrLine4 = this.adresseFrench.value.line4;
    
      if(!isNullOrUndefined(this.adresseFrench.value.line6)) {
        this.cmAdrress.addressPostal.addrLine6 = this.adresseFrench.value.line6;
      } else {
        this.cmAdrress.addressPostal.addrLine6 = this.addrLine6France(this.cmAdrress.addressPostal, this.adresseFrench.value);
      }
      this.cmAdrress.addressPostal.country = this.adresseFrench.value.country;
   } else {
    this.cmAdrress.addressPostal.city = this.ville.value;
    this.cmAdrress.addressPostal.country = this.addressCountry.value.key;
    this.cmAdrress.addressPostal.postalCode = this.codePostal.value;
    this.cmAdrress.addressPostal.addrLine4 = this.adresse.value;
  } 
  this.cmAdrress.addressPostal.active = true;
  this.cmAdrress.addressPostal.addrLine2 = this.batiment.value;
  this.cmAdrress.addressPostal.logisticInfo = this.codePorte.value
  this.cmAdrress.addressPostal.addrLine3 = this.appt.value;
  this.cmAdrress.addressPostal.lastName = this.interlocutor.lastName;
  this.cmAdrress.addressPostal.firstName = this.interlocutor.firstName;
  this.cmAdrress.addressPostal.title = this.interlocutor.civilite;
  this.cmAdrress.addressPostal.companyName = this.companyName;
  return this.cmAdrress.addressPostal;
}

addrLine4(addressOras: any): string {
  let resultStr = '';
      if(!isNullOrUndefined(addressOras.streetNumber)) {
        resultStr += `${addressOras.streetNumber} `;
      }
      if(!isNullOrUndefined(addressOras.streetType)) {
        resultStr += `${addressOras.streetType} `;
      }
      if(!isNullOrUndefined(addressOras.streetName)) {
        resultStr += `${addressOras.streetName} `;
      }
    return resultStr;
  }

addrLine6France(postalAddress: CmPostalAddressVO, addressOras: any ): string{
  const addr1 = `${addressOras.postalCode}  ${addressOras.cityName}  ${addressOras.cedex}`;
  const addr2 = `${addressOras.postalCode} ${addressOras.cityName}`;
  if(!isNullOrUndefined(addressOras.cedex) && (isNullOrUndefined(postalAddress.id) 
  || (!isNullOrUndefined(postalAddress.addrLine6) 
  && addr1.toLowerCase() !== postalAddress.addrLine6.toLowerCase())) ){
    return addr1;
  }else if(!isNullOrUndefined(addressOras.cedex) && 
  (isNaN(postalAddress.id) || (!isNullOrUndefined(postalAddress.addrLine6) && 
  addr2.toLowerCase() !== postalAddress.addrLine6.toLowerCase())) ){
    return addr2;
  }
return postalAddress.addrLine6;
}


getNumWithoutFrench(value): string {
  let num = value;
    if(!isNullOrUndefined(num) && num.includes('+33')) {
      num = num.replace('+33', '0');
    }
    return num;
}

notValidateForm(): boolean {
  if(this.phoneFixe.value === null || this.getNumWithoutFrench(this.phoneFixe.value) === '' || this.getNumWithoutFrench(this.phoneFixe.value) === '0') {
    this.fixeValide = false;
  }
  if(this.mobile.value === null || this.getNumWithoutFrench(this.mobile.value) === '' || this.getNumWithoutFrench(this.mobile.value) === '0') {
    this.mobileValide = false;
  }
  if(this.mail.value === null || this.mail.value === '') {
    this.mailValide = false;
  }else {
    this.validEmail();
  }

  if(!this.fixeValide && !this.mobileValide) {
    this.numeroValid = false;
  }

   this.validAddress();

   return this.checkValide();
 }

 validEmail(){
    this.formatMailValide = emailIsValid(this.mail.value);
}

 validAddress(): void {
  if(this.checkIsFrench.value) {
     if(this.adresseFrench.value === null || this.adresseFrench.value === '') {
       this.adresseFrancaisValide = false;
     } else if (this.adresseFrench.value !== '' && typeof this.adresseFrench.value !== 'object') {
      this.formatAddressValid = false;
     }
  } else {
    this.checkAddressHorsFrench();
  }
 }

 checkAddressHorsFrench(): void {
  if(this.addressCountry.value === null || this.addressCountry.value === '') {
    this.addressCountryValide = false;
  }
  if(this.adresse.value === null || this.adresse.value === '') {
    this.adresseValide = false;
  }
 }

initValidate(): void {
  this.fixeValide = true;
  this.mobileValide = true;
  this.mailValide = true;
  this.formatMailValide = true;
  this.adresseFrancaisValide = true;
  this.addressCountryValide = true;
  this.adresseValide = true;
  this.formatAddressValid = true;
  this.numeroValid = true;
}

getLengthNumber(type: string): number {
  let num = '0';
  if(type === 'fixe' && !isNullOrUndefined(this.phoneFixe.value)) {
     num = this.phoneFixe.value;
  } else if (type === 'mobile' && !isNullOrUndefined(this.mobile.value)) {
     num = this.mobile.value;
  }

  if(num.includes('+33')) {
    return 13;
  }
  
  return 100;
}

annuler(): void {
  this.redirect(true, false);
}


redirect(canceled: boolean, submitted: boolean): void {
  this.canceled = canceled ;
  this.submitted = submitted;
  
  if(this.typeCustomer === 'company') {
    this.router.navigate(
      ['customer-dashboard', 'entreprise', this.customerId],
      {
        queryParams: { typeCustomer: this.typeCustomer },
        queryParamsHandling: 'merge'
      }
    );
  } else {
    this.router.navigate(
      ['customer-dashboard', 'particular', this.customerId],
      {
        queryParams: { typeCustomer: this.typeCustomer },
        queryParamsHandling: 'merge'
      }
    );
  }    
}

openSnackBar(message: string, action: string): void {
  this._snackBar.open(message, action, {
    duration: 3000,
    panelClass: ['center-snackbar', 'snack-bar-container']
  });
}

getDefaultCountry(attr): string {
  if(attr === 'fixe' && !isNullOrUndefined(this.phoneFixe.value)) {
    console.log(this.phoneFixe.value);
    return '';
  } else if (attr === 'mobile' && !isNullOrUndefined(this.mobile.value)) {
    return '';
  }
  return 'fr';
}

}
