import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable, of } from 'rxjs';
import { map, startWith, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { ContactMethodService, ReferenceDataTypeService, PersonService } from '../../../_core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined, checkListOfEmailsIsValid, checkEmailIsValidToShowError } from '../../../_core/utils/string-utils';
import { getDecryptedValue } from '../../../_core/utils/functions-utils';
import { Interlocutor } from '../../../_core/models/interlocutor/crud/interlocutor';
import { ROLE_INTERLOCUTOR, TYPE_CM_INTERLOCUTOR, CM_MEDIA_REF_KEY, PERSON_CATEGORY,
  REF_FAVORITE_LANGUAGE } from '../../../_core/constants/constants';
import { OrasPostalAddress, ReferenceDataVO } from '../../../_core/models';
import { OrasAddressService } from '../../../_core/services/oras-address.service';
import { ContactMethodNew } from '../../../_core/models/interlocutor/crud/contact-methode-new';
import { CmPostalAddressVO } from '../../../_core/models/cm-postaladdress-vo';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { Role } from '../../../_core/models/interlocutor/crud/role';
  
@Component({
  selector: 'app-modification-particulier',
  templateUrl: './modification-particulier.component.html',
  styleUrls: ['./modification-particulier.component.scss']
})
export class ModificationParticulierComponent extends ComponentCanDeactivate implements OnInit, AfterViewInit {


  submitted: boolean;
  
  
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  customerId;
  typeCustomer;
  personId: number;
  isInterlocutor = false;
  roleCtrl = new FormControl();
  filteredRoles: Observable<Array<{key:string , value:string}>>;
  roles: Role[] = [];
  allRoles: Array<{key:string , value:string}> = [];
  addressFrench = new FormControl();
  addressCountry = new FormControl();
  appt = new FormControl();
  batiment = new FormControl();
  codePorte = new FormControl();
  codePostal = new FormControl();
  ville = new FormControl();
  adresse = new FormControl();
  listCountry: ReferenceDataVO[] = [];
  filteredCountry: Observable<ReferenceDataVO[]>[] = [];
  filteredAddress$: Observable<OrasPostalAddress[]> [] = [];
  interLocutor: Interlocutor;
  interlocutorRole: string;
  @ViewChild('roleInput', { static: false }) roleInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('chipList', { static: false }) chipList;
  typeCmInterlocutor = TYPE_CM_INTERLOCUTOR;
  roleValid = true;
  listCmToRemove: number[] = [];
  civilite = new FormControl();
  firstName = new FormControl();
  lastName = new FormControl();
  favoritLanguage = new FormControl();
  listfavoriteLanguage: Array<{key: string, value: string}> = [];
  cmAddressArray: FormArray;
  cmFixeArray: FormArray;
  cmMobileArray: FormArray;
  cmMailArray: FormArray;
  nomValide = true;
  prenomValid = true;
  adressFrancaisValide = true;
  paysHorsFrancaisValide = true;
  adresseHorsFrancaisValide = true;
  formatAddressValid = true;
  mailValid = true;
  indexOfInvalidEmails = [];
  isAffect = false;
  clickValidIsAffect = false;
  nameAffect = '';
  roleDejaAffect = '';
  roleDejaAffectKey = '';
  CM_MAIL_ARRAY = 'cmMailArray';
  CM_FIXE_ARRAY = 'cmFixeArray';
  CM_MOBILE_ARRAY = 'cmMobileArray';
  CM_ADDRESS_ARRAY = 'cmAddressArray';
  CONTROLS = 'controls';
  companyName: string;
  
  constructor( private readonly fb: FormBuilder, 
    private readonly contactMethodService: ContactMethodService,
    private readonly route: ActivatedRoute, 
    private readonly referenceDataTypeService: ReferenceDataTypeService,
    private readonly orasAddressService: OrasAddressService, 
    private readonly router: Router,
    private readonly personService: PersonService,
    private readonly _snackBar: MatSnackBar) {
   super();
   this.initializeTextOfCancelPopUp();
  }

  initializeTextOfCancelPopUp(): void {
    this.message = 'Êtes-vous sûr de vouloir annuler votre modification ?';
    this.btnOkText = 'Oui, j’annule ma modification';
    this.btnCancelText = 'Non, je reviens à ma modification';
  }

  form = this.fb.group({
    civilite: this.civilite,
    firstName: this.firstName,
    lastName: this.lastName,
    favoritLanguage: this.favoritLanguage,
    cmAddressArray: new FormArray([]),
    cmFixeArray: new FormArray([]),
    cmMobileArray: new FormArray([]),
    cmMailArray: new  FormArray([])
  });
  
  ngOnInit(): void {
    
    this.route.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
    });

    this.route.queryParamMap.subscribe(params => {
      this.typeCustomer = params.get('typeCustomer');
      this.initRoles();
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

    this.route.paramMap.subscribe(params => {
      this.isInterlocutor = params.get('isInterlocutor') === 'true';
    });

    this.initCountry();
    this.initLCm();
    this.initLFavoritLanguage();

    this.filteredRoles = this.roleCtrl.valueChanges.pipe( 
       startWith(''),
          map(option => option ? this._filter(option) : this.allRoles.slice())
    );
  }

  ManageNameControlAddressFrench(index: number) {
    const arrayControl = this.form.get('cmAddressArray') as FormArray;
    const item = arrayControl.at(index);
    this.filteredAddress$[index] = item.get('addressFrench').valueChanges.pipe(
        startWith(''),
        debounceTime(0),
        switchMap(value => {
          if (value !== '') {
            return this.lookup(value);
          } else {
            return of(null);
          }
        })
      );
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
    

    ManageNameControlCountry(index: number) {
      const arrayControl = this.form.get('cmAddressArray') as FormArray;
      const item = arrayControl.at(index);
      this.filteredCountry[index] = item.get('addressCountry').valueChanges
          .pipe(
              startWith(''),
              map(value => value ? this._filterCountry(value) : this.listCountry.slice())
          );
      }

  initLFavoritLanguage(): void {
    this.listfavoriteLanguage.push({key: 'EN', value: 'Anglais'});
    this.listfavoriteLanguage.push({key: 'AR', value: 'Arabe'});
    this.listfavoriteLanguage.push({key: 'FR', value: 'Français'});
    this.listfavoriteLanguage.push({key: 'IT', value: 'Italien'});
    this.listfavoriteLanguage.push({key: 'RU', value: 'Russe'});
  }

  initRoles(): void {
    if(this.typeCustomer === 'beneficiary') {
      this.allRoles.push(ROLE_INTERLOCUTOR.ROLE_DELEGUE);
      this.allRoles.push(ROLE_INTERLOCUTOR.ROLE_ASSISTANT_DIRECTION);
      this.allRoles.push(ROLE_INTERLOCUTOR.ROLE_RESPONSABLE_FACTURATION);
      this.allRoles.push(ROLE_INTERLOCUTOR.ROLE_RESPONSABLE_SI);
    } else if(this.typeCustomer === 'company') {
      this.allRoles.push(ROLE_INTERLOCUTOR.ROLE_ADMINISTRATEUR);
      this.allRoles.push(ROLE_INTERLOCUTOR.ROLE_ASSISTANT_DIRECTION);
      this.allRoles.push(ROLE_INTERLOCUTOR.ROLE_RESPONSABLE_FACTURATION);
      this.allRoles.push(ROLE_INTERLOCUTOR.ROLE_RESPONSABLE_SI);
      this.allRoles.push(ROLE_INTERLOCUTOR.ROLE_LEGAL_REPRESENTATIVE);
    } else if(this.typeCustomer === 'particular') {
      this.allRoles.push(ROLE_INTERLOCUTOR.ROLE_DELEGUE);
      this.allRoles.push(ROLE_INTERLOCUTOR.ROLE_ASSISTANT_DIRECTION);
    }
  }

  initCountry(): void {
    this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('COUNTRY',1).subscribe(data => {
     this.listCountry = data;
   });
 }

  initLCm(): void {
      this.route.paramMap.subscribe(params => {
        this.contactMethodService.findInterlocutorByPersonId(Number(params.get('personId')), getDecryptedValue(this.customerId)).subscribe( data => {
         this.interLocutor = data;
         if (!isNullOrUndefined(this.interLocutor)) {
           this.interlocutorRole = this.formatterRole(this.interLocutor.roles);
            this.roles = this.interLocutor.roles;
            this.firstName.setValue(this.interLocutor.firstName);
            this.lastName.setValue(this.interLocutor.lastName);
            this.civilite.setValue(this.interLocutor.civilite);
            this.favoritLanguage.setValue(this.initFavoritLanguage(this.interLocutor.favoritLanguageKey));
            if(!this.isInterlocutor) {
              this.roles.splice(this.roles.findIndex(role => role.key === ROLE_INTERLOCUTOR.ROLE_BENEFICIARE.key), 1 )
             }
            this.initFormArray(this.interLocutor.listCm);
         }
      });
    });
  }

  initFormArray(list: ContactMethodNew[]): void {
    for (const cm of list) { 
      if(cm.refMediaKey === CM_MEDIA_REF_KEY.TEL_FIXE) {
        this.addCmFixeValue(true, cm);
      } 
      if (cm.refMediaKey === CM_MEDIA_REF_KEY.EMAIL) {
        this.addCmMailValue(true, cm);
      }
      if (cm.refMediaKey === CM_MEDIA_REF_KEY.POSTAL_ADDRESS) {
        this.addCmAddressValue(true, cm);
      } 
      if (cm.refMediaKey === CM_MEDIA_REF_KEY.TEL_MOBILE) {
        this.addCmMobileValue(true, cm);
      }
    }
  }

 /** fixe  */

 createItemFixe(existPrin): FormGroup {
   if(existPrin) {
    return this.fb.group({
      idFixe: 0,
      typeFixe: '',
      phoneFixe: '',
      checkProFixe: false
    });
   }
  return this.fb.group({
    idFixe: 0,
    typeFixe: TYPE_CM_INTERLOCUTOR.PRINCIPAL.key,
    phoneFixe: '',
    checkProFixe: false
  });
}

createItemFixeForInit(cm: ContactMethodNew, key: string): FormGroup {
  if(!isNullOrUndefined(cm)) {
    let num = cm.value;
    const numChartAt = cm.value.charAt(0);
    if(numChartAt === '0') {
      num = `+33${cm.value.substring(1)}`;
    }
    return this.fb.group({
      idFixe: cm.idCm,
      typeFixe: key,
      phoneFixe: num,
      checkProFixe: false
    });
  }
  return this.createItemFixe(false);
}
   

getListTypesFixe(i): any[] {
  const listResult = [];
  const lIndexSecondaire = [];
  listResult.push(TYPE_CM_INTERLOCUTOR.PRINCIPAL);
  listResult.push(TYPE_CM_INTERLOCUTOR.PROFESSIONNEL);
  if(!this.isInterlocutor) {
     listResult.push(TYPE_CM_INTERLOCUTOR.SECONDAIRE);
  }
  listResult.push(TYPE_CM_INTERLOCUTOR.TEMPORAIRE);   
  this.form.get('cmFixeArray')['controls'].map(x =>  {
    if(x.value.typeFixe === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key && 
      this.form.get('cmFixeArray')['controls'].indexOf(x) !== i ) {
      listResult.splice(listResult.findIndex(type => type.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key), 1);
   } 

   if((x.value.typeFixe === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key && 
    this.form.get('cmFixeArray')['controls'].indexOf(x) !== i ) ||
     (x.value.checkProFixe === true) ) {
        listResult.splice(listResult.findIndex(type => type.key === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key), 1);
    }

    if (x.value.typeFixe === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key && 
      this.form.get(this.CM_FIXE_ARRAY)[this.CONTROLS].indexOf(x) !== i ) {
      lIndexSecondaire.push(this.form.get(this.CM_FIXE_ARRAY)[this.CONTROLS].indexOf(x));
    }
  });

  if (lIndexSecondaire.length >= 6 && !lIndexSecondaire.includes(i) ) {
    listResult.splice(listResult.findIndex(type => type.key === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key), 1);
  }
  return listResult;
}

addCmFixeValue(isDefault: boolean, cm: ContactMethodNew): void {
  this.cmFixeArray = this.form.get('cmFixeArray') as FormArray;
  if(isDefault) {
    if(!isNullOrUndefined(cm.types)) {
    for (const cmType of cm.types) {
      if(cmType.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key ||
         cmType.key === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key ||
         cmType.key === TYPE_CM_INTERLOCUTOR.TEMPORAIRE.key || 
         cmType.key === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key ) {
         this.cmFixeArray.push(this.createItemFixeForInit(cm, cmType.key));
        }
      }
    }
  } else {
    let existPri = false;
    this.form.get('cmFixeArray')['controls'].map( x => {
      if(x.value.typeFixe === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key) {
        existPri = true;
      }
    });
    this.cmFixeArray.push(this.createItemFixe(existPri));
  }
}
 

 deleteCmFixeValue(index) {
   const value = this.form.get('cmFixeArray')['controls'][index]['controls'].idFixe.value;
   if(value !== 0) {
     this.listCmToRemove.push(value);
   }
  
   this.cmFixeArray.removeAt(index);
 }


 onChangeCheckFixeHandler(i) {
   const value = this.form.get('cmFixeArray')['controls'][i]['controls'].checkProFixe.value;
  this.form.get('cmFixeArray')['controls'].map(x =>  {
        if( x.value.checkProFixe === true) {
          x.patchValue({
            checkProFixe: false
          })
        }
      });
      this.form.get('cmFixeArray')['controls'][i].patchValue({
        checkProFixe: value,
      });
  }

  disbaledCheckPro(i) : boolean {
    return this.form.get('cmFixeArray')['controls'][i]['controls'].checkProFixe.value;
  }

  disabledChoixTypePro(i): boolean {
    const type = this.form.get('cmFixeArray')['controls'][i]['controls'].typeFixe.value;
    return type === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key;
  }

  disbaledCheckProFixe() : boolean {
    let isDisable = false;
    this.form.get('cmFixeArray')['controls'].map(x =>  {
      if( x.value.typeFixe === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key) {
        isDisable = true;
      }
    });
    return isDisable;
  }


 /** end fixe  */

 createItemMobile(isExistPr): FormGroup {
   if(isExistPr) {
    return this.fb.group({
      idMobile: 0,
      typeMobile: '',
      phoneMobile: '',
      checkProMobile: ''
    });
   }
  return this.fb.group({
    idMobile: 0,
    typeMobile: TYPE_CM_INTERLOCUTOR.PRINCIPAL.key,
    phoneMobile: '',
    checkProMobile: ''
  });
}

 createItemMobileForInit(cm: ContactMethodNew, key: string): FormGroup {
   if(!isNullOrUndefined(cm)) {
    let numMobile = cm.value;
    const numChartAt = cm.value.charAt(0);
    if(numChartAt === '0') {
      numMobile = `+33${cm.value.substring(1)}`;
    }
    return this.fb.group({
      idMobile: cm.idCm,
      typeMobile: key,
      phoneMobile: numMobile,
      checkProMobile: ''
    });
   }
   return this.createItemMobile(false);
}




   

getListTypesMobile(i): any[] {
  const listResult = []; 
  const lIndexSecondaire = [];
  const lIndexPrincipal = [] as Array<{index: number}>;    
  listResult.push(TYPE_CM_INTERLOCUTOR.PRINCIPAL);
  listResult.push(TYPE_CM_INTERLOCUTOR.PROFESSIONNEL);
  if(!this.isInterlocutor) {
    listResult.push(TYPE_CM_INTERLOCUTOR.SECONDAIRE);
   }
  listResult.push(TYPE_CM_INTERLOCUTOR.TEMPORAIRE);
 this.form.get('cmMobileArray')['controls'].map(x =>  {
   if(x.value.typeMobile === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key) {
     lIndexPrincipal.push(this.form.get('cmMobileArray')['controls'].indexOf(x));
   }
    if( (x.value.typeMobile === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key && 
      this.form.get('cmMobileArray')['controls'].indexOf(x) !== i) || x.value.checkProMobile === true) {
       listResult.splice(listResult.findIndex(type => type.key === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key), 1);
      }
      
   if (x.value.typeMobile === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key && 
      this.form.get(this.CM_MOBILE_ARRAY)[this.CONTROLS].indexOf(x) !== i ) {
     lIndexSecondaire.push(this.form.get(this.CM_MOBILE_ARRAY)[this.CONTROLS].indexOf(x));
   } 
    });

    if(lIndexPrincipal.length >= 2 && !lIndexPrincipal.includes(i) ) {
      listResult.splice(listResult.findIndex(type => type.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key), 1);
    } 

  if (lIndexSecondaire.length >= 6 && !lIndexSecondaire.includes(i) ) {
    listResult.splice(listResult.findIndex(type => type.key === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key), 1);
  }
  return listResult;
}

addCmMobileValue(isDefault, cm: ContactMethodNew): void {
  this.cmMobileArray = this.form.get('cmMobileArray') as FormArray;
  if(isDefault) {
    for (const cmType of cm.types) {
      if(cmType.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key ||
         cmType.key === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key ||
         cmType.key === TYPE_CM_INTERLOCUTOR.TEMPORAIRE.key || 
         cmType.key === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key ) {
    this.cmMobileArray.push(this.createItemMobileForInit(cm, cmType.key));
      }
    } 
  } else {
    let existP = false;
    this.form.get('cmMobileArray')['controls'].map( x => {
      if(x.value.typeMobile === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key) {
        existP = true;
      }
    });
    this.cmMobileArray.push(this.createItemMobile(existP));
  }
}

isDeleteMobile(i) : boolean {
  let visible = false;
  if(!isNullOrUndefined(this.form.get('cmMobileArray')['controls'][i]) 
  && this.form.get('cmMobileArray')['controls'][i]['controls'].idMobile.value !== 0 
  && !this.isInterlocutor 
  && this.form.get('cmMobileArray')['controls'][i]['controls'].typeMobile.value === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key) {
      visible = true;
  }
  return visible;
}
 

 deleteCmMobileValue(index) {
  const value = this.form.get('cmMobileArray')['controls'][index]['controls'].idMobile.value;
  if(value !== 0) {
     this.listCmToRemove.push(value);
  }
  this.cmMobileArray.removeAt(index); 
 }


 onChangeCheckMobileHandler(i) {
   const value = this.form.get('cmMobileArray')['controls'][i]['controls'].checkProMobile.value;
  this.form.get('cmMobileArray')['controls'].map(x =>  {
        if( x.value.checkProMobile === true) {
          x.patchValue({
            checkProMobile: false
          })
        }
      });
      this.form.get('cmMobileArray')['controls'][i].patchValue({
        checkProMobile: value
      });
  }

  disbaledCheckProMobile() : boolean {
    let isDisable = false;
    this.form.get('cmMobileArray')['controls'].map(x =>  {
      if( x.value.typeMobile === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key) {
        isDisable = true;
      }
    });
    return isDisable;
  }

 /** end traitement mobile  */

 /** traitement Mail  */

 createItemMail(existPrMail): FormGroup {
   if(existPrMail) {
    return this.fb.group({
      idMail: 0,
      typeMail: '',
      mail: '',
      checkProMail: ''
    });
   }
   return this.fb.group({
    idMail: 0,
    typeMail: TYPE_CM_INTERLOCUTOR.PRINCIPAL.key,
    mail: '',
    checkProMail: ''
  });
  
}

createItemMailForInit(cm: ContactMethodNew, key: string): FormGroup {
  return this.fb.group({
    idMail: cm.idCm,
    typeMail: key,
    mail: cm.value,
    checkProMail: ''
  });
}

addCmMailValue(isDefault, cm: ContactMethodNew): void {
  this.cmMailArray = this.form.get('cmMailArray') as FormArray;
  if(isDefault) {
    if(!isNullOrUndefined(cm.types)) {
    for (const cmType of cm.types) {
      if(cmType.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key ||
         cmType.key === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key ||
         cmType.key === TYPE_CM_INTERLOCUTOR.TEMPORAIRE.key || 
         cmType.key === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key ) {
        this.cmMailArray.push(this.createItemMailForInit(cm, cmType.key ))
      }
    }
   }
  } else {
    let existPrMail = false;
    this.form.get('cmMailArray')['controls'].map( x => {
      if(x.value.typeMail === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key) {
        existPrMail = true;
      }
    });
    this.cmMailArray.push(this.createItemMail(existPrMail));
  }
  
}
 

 deleteCmMailValue(index) {
  const value = this.form.get('cmMailArray')['controls'][index]['controls'].idMail.value;
  if(value !== 0) {
    this.listCmToRemove.push(value);
  }
  this.cmMailArray.removeAt(index);
  this.indexOfInvalidEmails.splice(this.indexOfInvalidEmails.findIndex[index],1);
  this.validEmail();
 }

 onChangeCheckMailHandler(i) {
   const value = this.form.get('cmMailArray')['controls'][i]['controls'].checkProMail.value;
  this.form.get('cmMailArray')['controls'].map(x =>  {
        if( x.value.checkProMail === true) {
          x.patchValue({
            checkProMail: false
          })
        }
      });
      this.form.get('cmMailArray')['controls'][i].patchValue({
        checkProMail: value
      });
  }

  getListTypesMail(i): any[] {
    const listResult = [];   
    const lIndexSecondaire = [];
    listResult.push(TYPE_CM_INTERLOCUTOR.PRINCIPAL);
    listResult.push(TYPE_CM_INTERLOCUTOR.PROFESSIONNEL);
    if(!this.isInterlocutor) {
      listResult.push(TYPE_CM_INTERLOCUTOR.SECONDAIRE);
    }
    listResult.push(TYPE_CM_INTERLOCUTOR.TEMPORAIRE); 
     
    this.form.get('cmMailArray')['controls'].map(x =>  {
      if(x.value.typeMail === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key &&
         this.form.get('cmMailArray')['controls'].indexOf(x) !== i ) {
        listResult.splice(listResult.findIndex(type => type.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key), 1);
     } 

      if( (x.value.typeMail === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key &&
         this.form.get('cmMailArray')['controls'].indexOf(x) !== i) || x.value.checkProMail === true ) {
          listResult.splice(listResult.findIndex(type => type.key === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key), 1);
      } 

      if (x.value.typeMail === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key && 
        this.form.get(this.CM_MAIL_ARRAY)[this.CONTROLS].indexOf(x) !== i ) {
        lIndexSecondaire.push(this.form.get(this.CM_MAIL_ARRAY)[this.CONTROLS].indexOf(x));
      }
    });

    if (lIndexSecondaire.length >= 6 && !lIndexSecondaire.includes(i) ) {
      listResult.splice(listResult.findIndex(type => type.key === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key), 1);
    }

    return listResult;
  }

  disbaledCheckProMail() : boolean {
    let isDisable = false;
    this.form.get('cmMailArray')['controls'].map(x =>  {
      if( x.value.typeMail === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key) {
        isDisable = true;
      }
    });
    return isDisable;
  }

  
  isDeleteMail(i) : boolean {
    let visible = false;
    if(!isNullOrUndefined(this.form.get('cmMailArray')['controls'][i]) 
    && this.form.get('cmMailArray')['controls'][i]['controls'].idMail.value !== 0 
    && !this.isInterlocutor
    && this.form.get('cmMailArray')['controls'][i]['controls'].typeMail.value === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key) {
        visible = true;
    }
    return visible;
  }

/** end */


 /** address */

createItemAddress(isPriExist: boolean): FormGroup {
  const addressFrenchCtrl = new FormControl;
  if(isPriExist) {
    return this.fb.group({
      idAddress: 0,
      typeAddress: '',
      checkIsFrench: true,
      checkProAddress: '',
      addressFrench: addressFrenchCtrl,
      appt: '',
      batiment: '',
      codePorte: '',
      addressCountry: this.addressCountry,
      codePostal: '',
      ville: '',
      adresse: ''
    });
  }
    return this.fb.group({
      idAddress: 0,
      typeAddress: TYPE_CM_INTERLOCUTOR.PRINCIPAL.key,
      checkIsFrench: true,
      checkProAddress: '',
      addressFrench: addressFrenchCtrl,
      appt: '',
      batiment: '',
      codePorte: '',
      addressCountry: this.addressCountry,
      codePostal: '',
      ville: '',
      adresse: ''
    });
  
}


createItemAddressForInit(cm: ContactMethodNew, key: string): FormGroup {
  this.addressFrench = new FormControl();
  const addressCountryCtrl = new FormControl();
  const apptCtrl = new FormControl();
  const batimentCtrl = new FormControl();
  const codePorteCtrl = new FormControl();
  const codePostalCtrl = new FormControl();
  const villeCtrl = new FormControl();
  const adresseCtrl = new FormControl();
  let isFrench = false;
  const orasPostalAddress = {} as OrasPostalAddress;
  apptCtrl.setValue(cm.addressPostal.addrLine3);
  batimentCtrl.setValue(cm.addressPostal.addrLine2);
  codePorteCtrl.setValue(cm.addressPostal.logisticInfo);
  if(cm.addressPostal.country === 'France') {
    isFrench = true;
    orasPostalAddress.postalCode = cm.addressPostal.postalCode;
    orasPostalAddress.cityName = cm.addressPostal.city;
    if(!isNullOrUndefined(cm.addressPostal.streetNumber)) {
       orasPostalAddress.streetNumber = String(cm.addressPostal.streetNumber);
    }
    orasPostalAddress.line4 = cm.addressPostal.addrLine4;
    orasPostalAddress.streetType = cm.addressPostal.streetType;
    orasPostalAddress.streetName = cm.addressPostal.streetName;
    orasPostalAddress.orasId = String(cm.addressPostal.orasId);
    orasPostalAddress.streetExtension = cm.addressPostal.streetExtension;
    orasPostalAddress.geoCodeX = String(cm.addressPostal.geoCodeX);
    orasPostalAddress.cityInseeId = cm.addressPostal.inseeCode;
    orasPostalAddress.rivoliCode = cm.addressPostal.rivoliCode;
    orasPostalAddress.cedex = cm.addressPostal.cedex;
    orasPostalAddress.geoCodeY = String(cm.addressPostal.geoCodeY);
    orasPostalAddress.line5 = cm.addressPostal.addrLine5;
    orasPostalAddress.line6 = cm.addressPostal.addrLine6;
  }
    addressCountryCtrl.setValue(cm.addressPostal.refCountry);
    this.addressFrench.setValue(orasPostalAddress);
    codePostalCtrl.setValue(cm.addressPostal.postalCode);
    villeCtrl.setValue(cm.addressPostal.city);
    adresseCtrl.setValue(cm.addressPostal.addrLine4);
    
  return this.fb.group({
    idAddress: cm.idCm,
    typeAddress: key,
    checkIsFrench: isFrench,
    checkProAddress: false,
    addressFrench: this.addressFrench,
    appt: apptCtrl,
    batiment: batimentCtrl.value,
    codePorte: codePorteCtrl.value,
    addressCountry: addressCountryCtrl,
    codePostal: codePostalCtrl.value,
    ville: villeCtrl.value,
    adresse: adresseCtrl.value
  });
}

initFormatAddress(cm: CmPostalAddressVO): string {
  let result = '';
  if(!isNullOrUndefined(cm.streetNumber)) {
    result += cm.streetNumber;
  }
  if(!isNullOrUndefined(cm.streetType)) {
    result += cm.streetType;
  }
  if(!isNullOrUndefined(cm.streetName)) {
    result += cm.streetName;
  }
  if(!isNullOrUndefined(cm.postalCode)) {
    result += cm.postalCode;
  }
  if(!isNullOrUndefined(cm.city)) {
    result += cm.city;
  }
  return result;
}

addCmAddressValue(isDefault, cm: ContactMethodNew): void {
  this.cmAddressArray = this.form.get('cmAddressArray') as FormArray;
  let isExistType = false
  if(isDefault) {
    for (const cmType of cm.types) {
      if(cmType.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key ||
         cmType.key === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key ||
         cmType.key === TYPE_CM_INTERLOCUTOR.TEMPORAIRE.key || 
         cmType.key === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key ) {
       isExistType = true;
     }
    }
    if(isExistType) {
      this.cmAddressArray.push(this.createItemAddressForInit(cm, cm.types[0].key));
      
    }
  } else {
    let existPricpal = false;
    this.form.get('cmAddressArray')['controls'].map( x => {
      if(x.value.typeAddress === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key) {
        existPricpal = true;
      }
    })
    this.cmAddressArray.push(this.createItemAddress(existPricpal));
  }
  
  this.ManageNameControlAddressFrench(this.cmAddressArray.length - 1);
  this.ManageNameControlCountry(this.cmAddressArray.length - 1);
  this.initValidateAddresse();
}

initValidateAddresse(): void {
  this.adressFrancaisValide = true;
  this.paysHorsFrancaisValide = true;
  this.adresseHorsFrancaisValide = true;
  this.formatAddressValid = true;
}
  

getListTypesAddress(i): any[] {
  const listResult = []; 
  const lIndexSecondaire = [];
  listResult.push(TYPE_CM_INTERLOCUTOR.PRINCIPAL);
  listResult.push(TYPE_CM_INTERLOCUTOR.PROFESSIONNEL);
  if(!this.isInterlocutor) {
    listResult.push(TYPE_CM_INTERLOCUTOR.SECONDAIRE);
  }
  listResult.push(TYPE_CM_INTERLOCUTOR.TEMPORAIRE);   
  this.form.get('cmAddressArray')['controls'].map(x =>  {
    if(x.value.typeAddress === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key && 
      this.form.get('cmAddressArray')['controls'].indexOf(x) !== i ) {
      listResult.splice(listResult.findIndex(type => type.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key), 1);
   } 

    if ( (x.value.typeAddress === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key && 
      this.form.get('cmAddressArray')['controls'].indexOf(x) !== i ) || x.value.checkProAddress === true ) {
        listResult.splice(listResult.findIndex(type => type.key === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key), 1);
    } 

    if (x.value.typeAddress === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key && 
      this.form.get(this.CM_ADDRESS_ARRAY)[this.CONTROLS].indexOf(x) !== i ) {
      lIndexSecondaire.push(this.form.get(this.CM_ADDRESS_ARRAY)[this.CONTROLS].indexOf(x));
    }

  });

  if (lIndexSecondaire.length >= 6 && !lIndexSecondaire.includes(i) ) {
    listResult.splice(listResult.findIndex(type => type.key === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key), 1);
  }

  return listResult;
}

isCheckFrench(i): boolean {
  return this.form.get('cmAddressArray')['controls'][i]['controls'].checkIsFrench.value;
}

displayCountry(value: any): string {
  return value ? value.label : '';
}

disbaledCheckProAddress() : boolean {
  let isDisable = false;
  this.form.get('cmAddressArray')['controls'].map(x =>  {
    if( x.value.typeAddress === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key) {
      isDisable = true;
    }
  });
  return isDisable;
}



checkValidAddress(i, val, attribut): boolean {
  const add = this.form.get('cmAddressArray')['controls'][i]['controls'];
  let isValid = true;
  const isFrench = this.form.get('cmAddressArray')['controls'][i]['controls'].checkIsFrench.value;
  if(attribut === 'addressFrench' && isFrench === true 
  && (isNullOrUndefined(add.addressFrench.value) || add.addressFrench.value === '') && !val) {
    isValid =  false;
  } else if (attribut === 'addressCountry' && isFrench === false
    && (isNullOrUndefined(add.addressCountry.value) || add.addressCountry.value === '' ) && !val) {
    isValid =  false;
  } else {
    isValid = this.checkValidAddressHorFrench(i, val, attribut);
  }
  
  return isValid;
}

checkValidAddressHorFrench(i, val, attribut): boolean {
  const add = this.form.get('cmAddressArray')['controls'][i]['controls'];
  let isValid = true;
  const isFrench = this.form.get('cmAddressArray')['controls'][i]['controls'].checkIsFrench.value;
     if ((attribut === 'codePostal' && isFrench === false 
    && (isNullOrUndefined(add.codePostal.value) || add.codePostal.value === '') && !val) || 
    (attribut === 'ville' && isFrench === false && (isNullOrUndefined(add.ville.value) || add.ville.value === '') && !val) || 
    (attribut === 'adresse' && isFrench === false && (isNullOrUndefined(add.adresse.value) || add.adresse.value === '') && !val)) {
       isValid = false;
    }
return isValid;
}

isSelectionAddress(i): boolean {
  const value = this.form.get('cmAddressArray')['controls'][i]['controls'].addressFrench.value;
  return (value !== '' && typeof value !== 'object') ;
  
}

isDeleteAddress(i) : boolean {
  let visible = false;
  if(!isNullOrUndefined(this.form.get('cmAddressArray')['controls'][i])
  && !this.isInterlocutor
  && this.form.get('cmAddressArray')['controls'][i]['controls'].idAddress.value !== 0
  && this.form.get('cmAddressArray')['controls'][i]['controls'].typeAddress.value === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key) {
      visible = true;
  }
  return visible;
}

lookup(value: string): Observable<OrasAddressService[]> {
  return this.orasAddressService.getFullAdresse(value).pipe(
    map(results => results),
    catchError(_ => {
      return of(null);
    })
  );
}

onChangeCheckIsAddressFrench(i): boolean {
  this.initValidateAddresse();
  return this.form.get('cmAddressArray')['controls'][i]['controls'].checkIsFrench.value;
}




deleteCmAddressValue(index) {
  const value = this.form.get('cmAddressArray')['controls'][index]['controls'].idAddress.value;
  if(value !== 0) {
    this.listCmToRemove.push(value);
  }
  this.cmAddressArray.removeAt(index);
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
    // CHIPLIST FUNCTIONS
  
  ngAfterViewInit(): void {
    if(this.isInterlocutor) {
      setTimeout(() => {
        this.chipList.errorState = false;
      });
    }
      
  }  

  checkValide(): boolean {
    if(!this.adressFrancaisValide 
      || !this.paysHorsFrancaisValide  ||
       !this.adresseHorsFrancaisValide || (this.isInterlocutor && (!this.prenomValid || !this.nomValide || !this.roleValid )) || !this.formatAddressValid  || !this.mailValid) {
        return true;
      }
    return false;
  }
  
  remove(role: any): void {
    if(role.key ===  this.roleDejaAffectKey) {
      this.isAffect = false;
    }
    const index = this.roles.indexOf(role);
    if (index >= 0) {
      this.roles.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const exist = this.roles.some(option => option.key === event.option.value.key)
    if(!exist && !this.isAffect) {
      this.personService.isAffectOtherInterlocutor(getDecryptedValue(this.customerId), event.option.value.key, this.personId ).subscribe(data => { 
        if(!isNullOrUndefined(data)) {
           this.isAffect =  true;
           this.nameAffect = data;
           this.roleDejaAffect = event.option.value.value;
           this.roleDejaAffectKey = event.option.value.key;
         } else {
           this.isAffect = false;
         }
        });
        if(!this.roles.includes(event.option.value)) {
          this.roles.push(event.option.value);
          this.roleInput.nativeElement.value = '';
          this.roleCtrl.setValue(null);
          this.chipList.errorState = false;
      }
    }
  }
  
  private _filter(value: string): Array<{key:string , value:string}> {
    if(typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.allRoles.filter(role => role.value.toLowerCase().indexOf(filterValue) === 0);
    }
    return [];
  }

  private _filterCountry(value: string): ReferenceDataVO[] {
    if(typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.listCountry.filter(ref => ref.label.toLowerCase().indexOf(filterValue) === 0);
    }
    return [];
  }


  formatterRole(roles: Array<{key:string , value:string}>): string {
    let result = '';
    if(!this.isInterlocutor) {
      if(this.typeCustomer === 'particular') {
          result = 'Particulier';  
      } else if (this.typeCustomer === 'beneficiary') {
        result = 'Bénéficiaire';  
      }
  } else {
    return this.formatterRolesIsInterlocutor(roles)
  }
    return result;
  }

  formatterRolesIsInterlocutor(values: Array<{key:string , value:string}>): string {
    let result = '';
    if(!isNullOrUndefined(values)) {
      for(const role of values) {
        result += role.value;
        if(values.indexOf(role) < values.length - 1 ) {
          result += ', ';
        }
      }
    }
    return result.replace(ROLE_INTERLOCUTOR.ROLE_BENEFICIARE.value, '');
    
  }

  getLengthNumber(i, type: string): number {
    let num = '0';
    if(type === 'fixe' && !isNullOrUndefined(this.form.get('cmFixeArray')['controls'][i]['controls'].phoneFixe.value)) {
      num = this.form.get('cmFixeArray')['controls'][i]['controls'].phoneFixe.value;
    } else if(type === 'mobile' && !isNullOrUndefined(this.form.get('cmMobileArray')['controls'][i]['controls'].phoneMobile.value)) {
      num = this.form.get('cmMobileArray')['controls'][i]['controls'].phoneMobile.value;
    }
    
    if(num.includes('+33')) {
      return 13;
    } 
    return 100;
  }


  initValidate(): void {
    this.roleValid = true;
    this.initValidateAddresse();
  }

  

  notValidateForm(): boolean {
     
     if(this.isInterlocutor) {
      this.validFormForInter();
     }
     this.valideAddress();
     this.validEmail();
     return this.checkValide();
    }

    /**
   * This function check if the format of emails is valid or not, if one is not valid 
   * we push its index in indexOfInvalidEmails to show the error in the right input
   */
    validEmail(){
     this.indexOfInvalidEmails = checkListOfEmailsIsValid(this.form.get('cmMailArray')['controls']);
      if(this.indexOfInvalidEmails.length > 0){
        this.mailValid = false;
      }else{
        this.mailValid = true;
      }
    }

   /**
   * This function check if the index of the input exists in indexOfInvalidEmails list to show or not the error
   */
  checkEmailIsValidToShowError(index){
   return checkEmailIsValidToShowError(this.indexOfInvalidEmails, index);
  }

    validFormForInter(): void {
      if (this.form.get('lastName').value === '') {
        this.nomValide = false;
      }
      if (this.form.get('firstName').value === '')  {
        this.prenomValid = false;
      }
      
      if (this.roles.length === 0) {
        this.chipList.errorState = true;
        this.roleValid = false;
      }
    }

    valideAddress(): void {
      this.form.get('cmAddressArray')['controls'].map(x => {
        if(x.value.checkIsFrench === true && ( x.value.addressFrench === null || x.value.addressFrench === '')) {
          this.adressFrancaisValide = false;
        } else if (x.value.addressFrench !== '' && typeof x.value.addressFrench !== 'object') {
          this.formatAddressValid = false;
        } else {
            this.checkAddressNotFrench(x);
        }
        
      });
    }

    checkAddressNotFrench(x: any): void {
      if(x.value.checkIsFrench === false && (x.value.addressCountry === null || x.value.addressCountry === '')) {
        this.paysHorsFrancaisValide = false;
      }
      if(x.value.checkIsFrench === false && ( x.value.adresse === null || x.value.adresse === '') ) {
        this.adresseHorsFrancaisValide = false;
      }
  }

  initFavoritLanguage(value: string): string {
    if(value === REF_FAVORITE_LANGUAGE.FRENCH) {
      return 'FR';
    } else if (value === REF_FAVORITE_LANGUAGE.ENGLISH) {
      return 'EN';
    } else if (value === REF_FAVORITE_LANGUAGE.ARABIC) {
      return 'AR';
    } else if( value === REF_FAVORITE_LANGUAGE.RUSSE) {
      return 'RU';
    } else if (value === REF_FAVORITE_LANGUAGE.ITALIE){
      return 'IT';
    }
    return '';
  }

  getFavoriteLanguage(value: string) : string {
    if(value === 'FR') {
      return REF_FAVORITE_LANGUAGE.FRENCH;
    } else if (value === 'EN') {
      return REF_FAVORITE_LANGUAGE.ENGLISH;
    } else if (value === 'IT') {
      return REF_FAVORITE_LANGUAGE.ITALIE;
    } else if (value === 'AR') {
      return REF_FAVORITE_LANGUAGE.ARABIC;
    } else if (value === 'RU') {
      return REF_FAVORITE_LANGUAGE.RUSSE;
    }
    return '';
  }

  isDepasse69caracter(): boolean {
    let isExist = false;
    this.form.get('cmAddressArray')['controls'].map(x => {
      let number = 0;
      if(x.value.batiment !== null) {
        number = number + x.value.batiment.length;
      }
      if (x.value.codePorte !== null) {
        number = number + x.value.codePorte.length
      }
      if (x.value.appt !== null) {
        number = number + x.value.appt.length
      }
      if ( number > 69) {
        isExist =  true;
      }
    });

    return isExist;
  }

  update(): void {
    this.initValidate();
    if(!this.notValidateForm() && !this.isAffect && !this.isDepasse69caracter()) {
      if(this.listCmToRemove !== []) {
        this.contactMethodService.deleteContactMethodById(this.listCmToRemove).subscribe (data => {
        });
      }
      this.personService.updateInterlocutor(this.preparedObjetToUpdate()).subscribe( data => {
      if(data === true) {
        this.openSnackBar('vos données ont bien été enregistrées.', undefined);
      }
       this.redirect(false, true);
     });
   }
  }

  getZeroNum(value: string): string{
    if(value.includes('+33')) {
      return value.replace('+33', '0')
    }
    return value;
  }

  getMFixeForSave(x: any, interlocutor: Interlocutor) {
    if(x.value.typeFixe !== null && this.getZeroNum(x.value.phoneFixe) !== '0' &&  this.getZeroNum(x.value.phoneFixe) !== '') {
      let cm = new ContactMethodNew(x.value.idFixe, x.value.typeFixe, this.getZeroNum(x.value.phoneFixe), CM_MEDIA_REF_KEY.TEL_FIXE, null, x.value.checkProFixe);
      interlocutor.listCm.push(cm);
      if(x.value.checkProFixe === true ) {
        cm = new ContactMethodNew(0, TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key, 
          this.getZeroNum(x.value.phoneFixe), CM_MEDIA_REF_KEY.TEL_FIXE, null, x.value.checkProFixe);
        interlocutor.listCm.push(cm);
      }
    }
  }

  getMobileForSave(x: any, interlocutor: Interlocutor) {
    if(x.value.typeMobile !== null && this.getZeroNum(x.value.phoneMobile) !== '0' && this.getZeroNum(x.value.phoneMobile) !== '') {
      let cm = new ContactMethodNew(x.value.idMobile, x.value.typeMobile, this.getZeroNum(x.value.phoneMobile), CM_MEDIA_REF_KEY.TEL_MOBILE, null, x.value.checkProMobile); 
      interlocutor.listCm.push(cm);
      if(x.value.checkProMobile === true ) {
        cm = new ContactMethodNew(0, TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key, 
          this.getZeroNum(x.value.phoneMobile), CM_MEDIA_REF_KEY.TEL_MOBILE, null, x.value.checkProMobile);
        interlocutor.listCm.push(cm);
      }
    }
  }

  getMailForSave(x: any, interlocutor: Interlocutor) {
    if(x.value.typeMail !== null && x.value.mail !== '') {
     let cm = new ContactMethodNew(x.value.idMail, x.value.typeMail, x.value.mail, CM_MEDIA_REF_KEY.EMAIL, null, x.value.checkProMail);
      interlocutor.listCm.push(cm); 
      if(x.value.checkProMail === true ) {
        cm = new ContactMethodNew(0, TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key, x.value.mail, CM_MEDIA_REF_KEY.EMAIL, null, x.value.checkProMail); 
        interlocutor.listCm.push(cm);
      }
    }
  }

  preparedObjetToUpdate(): Interlocutor{
    const interlocutor = {} as Interlocutor;
    interlocutor.listCm = [] ;
    let cm = {} as ContactMethodNew;
    interlocutor.customerId = getDecryptedValue(this.customerId);
    interlocutor.idPerson = this.interLocutor.idPerson;
    if(this.isInterlocutor) {
      if(this.typeCustomer === 'company') {
        interlocutor.categoryPersonKey = PERSON_CATEGORY.MORALE;
      } else {
        interlocutor.categoryPersonKey = PERSON_CATEGORY.PHYSIQUE;
      }
    interlocutor.firstName = this.form.get('firstName').value;
    interlocutor.lastName = this.form.get('lastName').value;
    
    interlocutor.civilite = this.form.get('civilite').value;
    interlocutor.favoritLanguage = this.getFavoriteLanguage(this.form.get('favoritLanguage').value);
  }
    interlocutor.roles = this.roles;
  
    this.form.get('cmFixeArray')['controls'].map(x =>  {
      this.getMFixeForSave(x, interlocutor);
      
    });
  
     cm = {} as ContactMethodNew;
    this.form.get('cmMobileArray')['controls'].map(x =>  {
      this.getMobileForSave(x, interlocutor);
      
    });
  
     cm = {} as ContactMethodNew;
    this.form.get('cmMailArray')['controls'].map(x =>  {
      this.getMailForSave(x, interlocutor);
    });
  
     
    this.form.get('cmAddressArray')['controls'].map(x => {
      if(x.value.typeAddress !== null && x.value.typeAddress !=='') {
        cm = {} as ContactMethodNew;
        cm.addressPostal = this.preparedObjetAdressOras(x.value, x.value.checkIsFrench);
        cm = new ContactMethodNew(x.value.idAddress, x.value.typeAddress, x.value.typeAddress,
          CM_MEDIA_REF_KEY.POSTAL_ADDRESS, cm.addressPostal , x.value.checkProAddress);

        interlocutor.listCm.push(cm);

        if(x.value.checkProAddress === true) {
          cm = new ContactMethodNew(0, TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key, 
            x.value.typeAddress, CM_MEDIA_REF_KEY.POSTAL_ADDRESS, cm.addressPostal, x.value.checkProAddress); 
            interlocutor.listCm.push(cm);
        }
      }
      
    });
  
    return interlocutor; 
  
    } 

    preparedObjetAdressOras(addressOras: any, checkIsPro): CmPostalAddressVO {
      const addressPostal = {} as CmPostalAddressVO;
      addressPostal.personId = this.interLocutor.idPerson;
      if(checkIsPro === true) {
          addressPostal.city = addressOras.addressFrench.cityName;
          addressPostal.postalCode = addressOras.addressFrench.postalCode;
          addressPostal.streetExtension = addressOras.addressFrench.streetExtension;
          addressPostal.streetName = addressOras.addressFrench.streetName;
          addressPostal.streetNumber = addressOras.addressFrench.streetNumber;
          addressPostal.streetType = addressOras.addressFrench.streetType;
          addressPostal.geoCodeX = addressOras.addressFrench.geoCodeX;
          addressPostal.orasId = addressOras.addressFrench.orasId;
          addressPostal.inseeCode = addressOras.addressFrench.cityInseeId;
          addressPostal.rivoliCode = addressOras.addressFrench.rivoliCode;
          addressPostal.cedex = addressOras.addressFrench.cedex;
          addressPostal.geoCodeY = addressOras.addressFrench.geoCodeY;
          addressPostal.addrLine5 = addressOras.addressFrench.line5;
          addressPostal.country = addressOras.addressFrench.country;
          addressPostal.addrLine4 = addressOras.addressFrench.line4;
            if(!isNullOrUndefined(addressOras.addressFrench.line6)) {
              addressPostal.addrLine6 = addressOras.addressFrench.line6;
             } else {
              addressPostal.addrLine6 = this.addrLine6France(addressPostal, addressOras.addressFrench);
            }
      } else {
        addressPostal.city = addressOras.ville;
        addressPostal.country = addressOras.addressCountry.key;
        addressPostal.postalCode = addressOras.codePostal;
        addressPostal.addrLine4 = addressOras.adresse;
      } 
        addressPostal.addrLine2 = addressOras.batiment;
        addressPostal.logisticInfo = addressOras.codePorte
        addressPostal.addrLine3 = addressOras.appt;
        
        if(this.isInterlocutor) {
          addressPostal.title = this.civilite.value;
          addressPostal.lastName = this.lastName.value;
          addressPostal.firstName = this.firstName.value;
          addressPostal.companyName = null;
        } else {
          addressPostal.title = this.interLocutor.civilite;
          addressPostal.lastName = this.interLocutor.lastName;
          addressPostal.firstName = this.interLocutor.firstName;
          addressPostal.companyName = this.companyName;
        }
        
      return addressPostal;
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

  annuler(): void {
  this.redirect(true, false);
  }

  redirect(canceled: boolean, submitted: boolean): void {
    this.canceled = canceled;
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

  getDefaultCountry(i, type: string): string {
    let num = '';
    if(type === 'fixe' && !isNullOrUndefined(this.form.get('cmFixeArray')['controls'][i]['controls'].phoneFixe.value)) {
      num = this.form.get('cmFixeArray')['controls'][i]['controls'].phoneFixe.value;
    } else if(type === 'mobile' && !isNullOrUndefined(this.form.get('cmMobileArray')['controls'][i]['controls'].phoneMobile.value)) {
      num = this.form.get('cmMobileArray')['controls'][i]['controls'].phoneMobile.value;
    }
    
    if(isNullOrUndefined(num) || num === null || num === '') {
      return 'fr'
    }

    return '';
  }

  
}
