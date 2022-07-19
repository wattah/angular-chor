import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable, of } from 'rxjs';
import { map, startWith, debounceTime, switchMap, catchError } from 'rxjs/operators';

import { TYPE_CM_INTERLOCUTOR, ROLE_INTERLOCUTOR, CM_MEDIA_REF_KEY, REF_FAVORITE_LANGUAGE,
   PERSON_CATEGORY } from '../../../_core/constants/constants';
import { checkEmailIsValidToShowError, checkListOfEmailsIsValid, isNullOrUndefined } from '../../../_core/utils/string-utils';
import { OrasPostalAddress, ReferenceDataVO } from '../../../_core/models';
import { OrasAddressService } from '../../../_core/services/oras-address.service';
import { Interlocutor } from '../../../_core/models/interlocutor/crud/interlocutor';
import { ReferenceDataTypeService, PersonService } from '../../../_core/services';
import { ContactMethodNew } from '../../../_core/models/interlocutor/crud/contact-methode-new';
import { CmPostalAddressVO } from '../../../_core/models/cm-postaladdress-vo';
import { getDecryptedValue } from '../../../_core/utils/functions-utils';
import { Role } from '../../../_core/models/interlocutor/crud/role';

@Component({
  selector: 'app-interlocutor-form',
  templateUrl: './interlocutor-form.component.html',
  styleUrls: ['./interlocutor-form.component.scss']
})
export class InterlocutorFormComponent implements OnInit, AfterViewInit {

  typePage: string;
  @Input() creationMode = true;
  @Input() customerId;
  @Input() typeCustomer: string;

  form: FormGroup;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  roleCtrl = new FormControl();
  addressFrench = new FormControl();
  addressCountry = new FormControl();
  filteredRoles: Observable<Array<{key:string , value:string}>>;
  types: Array<{key: string, value: string}> = [];
  roles:  Role[] = [];
  allRoles: Array<{key:string , value:string}> = [];
  @ViewChild('roleInput', { static: false }) roleInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('chipList', { static: false }) chipList;
  typeCmInterlocutor = TYPE_CM_INTERLOCUTOR;
  favoritLanguage = REF_FAVORITE_LANGUAGE;

  /** var pour cm fixe */
  cmFixeArray: FormArray;
  selectedTypeFixePrincipal: {index:string , value:string} = {} as {index:string , value:string};
  selectedTypeFixeProfessionel: {index:string , value:string} = {} as {index:string , value:string};

  /** var pour cm mobile */
  cmMobileArray: FormArray;
  selectedTypeMobilePrincipal: {index:string , value:string} = {} as {index:string , value:string};
  selectedTypeMobileProfessionel: {index:string , value:string} = {} as {index:string , value:string};

  /** var pour cm Mail */
  cmMailArray: FormArray;
  selectedTypeMailPrincipal: {index:string , value:string} = {} as {index:string , value:string};
  selectedTypeMailProfessionel: {index:string , value:string} = {} as {index:string , value:string};

  /** var pour cm adresse */
  cmAddressArray: FormArray;
  selectedTypeAddressPrincipal: {index:string , value:string} = {} as {index:string , value:string};
  selectedTypeAddressProfessionel: {index:string , value:string} = {} as {index:string , value:string};
  filteredAddress$: Observable<OrasPostalAddress[]>[] = [];

  interlocutorToSave: Interlocutor;
  filteredCountry: Observable<ReferenceDataVO[]>[] = [];
  listCountry: ReferenceDataVO[] = [];

  /** var validated form */
  civiliteValide = true;
  nomValide = true;
  prenomValid = true;
  roleValid = true;
  adressFrancaisValide = true;
  formatAddressValid = true;
  paysHorsFrancaisValide = true;
  adresseHorsFrancaisValide = true;
  mailValid = true;
  indexOfInvalidEmails = [];
  isAffect = false;
  clickValidIsAffect = false;
  nameAffect = '';
  roleDejaAffect = '';
  roleDejaAffectKey = '';
  /** end  */

  @Output() onFormGroupChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() onSubmittedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCanceledChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor( private readonly fb: FormBuilder, private readonly _snackBar: MatSnackBar,
    private readonly route: ActivatedRoute, private readonly router: Router,
    private readonly orasAddressService: OrasAddressService,
    private readonly referenceDataTypeService: ReferenceDataTypeService,
    private readonly personService: PersonService) {
  }

  ngOnInit(): void {
   this.initRoles();
   this.initForm();

   this.initCountry();
   this.onFormGroupChange.emit(this.form);

    this.filteredRoles = this.roleCtrl.valueChanges.pipe( 
       startWith(''),
          map(option => option ? this._filter(option) : this.allRoles.slice())
      );

   this.cmAddressArray = this.form.get('cmAddressArray') as FormArray;
   this.cmFixeArray = this.form.get('cmFixeArray') as FormArray;
   this.cmMobileArray = this.form.get('cmMobileArray') as FormArray;
   this.cmMailArray = this.form.get('cmMailArray') as FormArray;
  }

  initForm(): void {
    this.form = this.fb.group({
      civilite: this.fb.control('oui'),
      firstName: this.fb.control(''),
      lastName: this.fb.control(''),
      favoritLanguage: this.fb.control(this.favoritLanguage.FRENCH),
      cmFixeArray: new FormArray([]),
      cmMobileArray: new FormArray([]),
      cmMailArray: new FormArray([]),
      cmAddressArray: new FormArray([])
    });
  }

  initCountry(): void {
     this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('COUNTRY',1).subscribe(data => {
      this.listCountry = data;
    });
  }

  displayCountry(value: any): string {
    return value ? value.label : '';
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

    ManageNameControlCountry(index: number) {
      const arrayControl = this.form.get('cmAddressArray') as FormArray;
      const item = arrayControl.at(index);
      this.filteredCountry[index] = item.get('addressCountry').valueChanges
          .pipe(
              startWith(''),
              map(value => value ? this._filterCountry(value) : this.listCountry.slice())
          );
      }

  /** gestion de cm fixe  */

  createItemFixe(isDefault): FormGroup {
    if(isDefault) {
      return this.fb.group({
        typeFixe: TYPE_CM_INTERLOCUTOR.PRINCIPAL.key,
        phoneFixe: '',
        checkProFixe: false
      });
    }
    return this.fb.group({
      typeFixe: '',
      phoneFixe: '',
      checkProFixe: false
    });
  }
     
 
  getListTypesFixe(i): any[] {
    const listResult = [];   
    listResult.push(TYPE_CM_INTERLOCUTOR.PRINCIPAL);
    listResult.push(TYPE_CM_INTERLOCUTOR.PROFESSIONNEL);
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
    });
    return listResult;
  }

  addCmFixeValue(): void {
    this.cmFixeArray = this.form.get('cmFixeArray') as FormArray;
    if (!this.cmFixeArray || !this.cmFixeArray.length) {
      this.cmFixeArray.push(this.createItemFixe(true));
    } else {
      this.cmFixeArray.push(this.createItemFixe(false));
    }
  }
   

   deleteCmFixeValue(index) {
     if(isNullOrUndefined(this.cmFixeArray)) {
      this.cmFixeArray = this.form.get('cmFixeArray') as FormArray;
     } else {
      this.cmFixeArray.removeAt(index);
     }
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

    disbaledCheckProFixe() : boolean {
      let isDisable = false;
      this.form.get('cmFixeArray')['controls'].map(x =>  {
        if( x.value.typeFixe === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key) {
          isDisable = true;
        }
      });
      return isDisable;
    }

    disabledChoixTypePro(i): boolean {
      const type = this.form.get('cmFixeArray')['controls'][i]['controls'].typeFixe.value;
      return type === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key;
    }

   /** end gestion fixe */

   /** traitement partie mobile */

   createItemMobile(isDefault): FormGroup {
     if (isDefault) {
      return this.fb.group({
        typeMobile: TYPE_CM_INTERLOCUTOR.PRINCIPAL.key,
        phoneMobile: '',
        checkProMobile: ''
      });
     }
    return this.fb.group({
      typeMobile: '',
      phoneMobile: '',
      checkProMobile: ''
    });
  }
     
 
  getListTypesMobile(i): any[] {
    const listResult = []; 
    const lIndexPrincipal = [] as Array<{index: number}>;    
    listResult.push(TYPE_CM_INTERLOCUTOR.PRINCIPAL);
    listResult.push(TYPE_CM_INTERLOCUTOR.PROFESSIONNEL);
    listResult.push(TYPE_CM_INTERLOCUTOR.TEMPORAIRE);
   this.form.get('cmMobileArray')['controls'].map(x =>  {
     if(x.value.typeMobile === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key) {
       lIndexPrincipal.push(this.form.get('cmMobileArray')['controls'].indexOf(x));
     }
      if( (x.value.typeMobile === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key && 
        this.form.get('cmMobileArray')['controls'].indexOf(x) !== i) || x.value.checkProMobile === true) {
         listResult.splice(listResult.findIndex(type => type.key === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key), 1);
        } 
      });
  
      if(lIndexPrincipal.length >= 2 && !lIndexPrincipal.includes(i) ) {
        listResult.splice(listResult.findIndex(type => type.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key), 1);
      } 
    return listResult;
  }

  addCmMobileValue(): void {
    this.cmMobileArray = this.form.get('cmMobileArray') as FormArray;
    if (!this.cmMobileArray || !this.cmMobileArray.length) {
      this.cmMobileArray.push(this.createItemMobile(true));
    } else {
      this.cmMobileArray.push(this.createItemMobile(false));
    }
  }
   

   deleteCmMobileValue(index) {
     if(!isNullOrUndefined(this.cmMobileArray)) {
      this.cmMobileArray.removeAt(index);
     } else {
      this.cmMobileArray = this.form.get('cmMobileArray') as FormArray;
     }
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

   createItemMail(isDefault): FormGroup {
     if(isDefault) {
      return this.fb.group({
        typeMail: TYPE_CM_INTERLOCUTOR.PRINCIPAL.key,
        mail: '',
        checkProMail: ''
      });
     }
    return this.fb.group({
      typeMail: '',
      mail: '',
      checkProMail: ''
    });
  }

  addCmMailValue(): void {
    this.cmMailArray = this.form.get('cmMailArray') as FormArray;
    if (!this.cmMailArray || !this.cmMailArray.length) {
      this.cmMailArray.push(this.createItemMail(true));
    } else {
      this.cmMailArray.push(this.createItemMail(false));
    }
  }
   

   deleteCmMailValue(index) {
     if(!isNullOrUndefined(this.cmMailArray)) {
      this.cmMailArray.removeAt(index);
      this.indexOfInvalidEmails.splice(this.indexOfInvalidEmails.findIndex[index],1);
      this.validEmail();
     } else {
      this.cmMailArray = this.form.get('cmMailArray') as FormArray;
     }
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
      listResult.push(TYPE_CM_INTERLOCUTOR.PRINCIPAL);
      listResult.push(TYPE_CM_INTERLOCUTOR.PROFESSIONNEL);
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
      });
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

   /** end traitement  */

   /** traitement adress */
   
   createItemAddress(isPrincipalExist): FormGroup {
    const addressFrenchCtrl = new FormControl();
    const addressCountryCtrl = new FormControl();
     if(isPrincipalExist) {
      return this.fb.group({
        typeAddress: '',
        checkIsFrench: true,
        checkProAddress: '',
        addressFrench: addressFrenchCtrl,
        appt: '',
        batiment: '',
        codePorte: '',
        addressCountry: addressCountryCtrl,
        codePostal: '',
        ville: '',
        adresse: ''
      });
     }
     return this.fb.group({
      typeAddress: TYPE_CM_INTERLOCUTOR.PRINCIPAL.key,
      checkIsFrench: true,
      checkProAddress: '' ,
      addressFrench: addressFrenchCtrl,
      appt: '',
      batiment: '',
      codePorte: '',
      addressCountry: addressCountryCtrl,
      codePostal: '',
      ville: '',
      adresse: ''
    });
    
  }
     
 
  getListTypesAddress(i): any[] {
    const listResult = [];   
    listResult.push(TYPE_CM_INTERLOCUTOR.PRINCIPAL);
    listResult.push(TYPE_CM_INTERLOCUTOR.PROFESSIONNEL);
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
    });
    return listResult;
  }

  addCmAddressValue(): void {
    this.cmAddressArray = this.form.get('cmAddressArray') as FormArray;
    let isPrincipalExist = false;
    this.form.get('cmAddressArray')['controls'].map(x=> {
         if(x.value.typeAddress === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key) {
            isPrincipalExist = true;
         }
    });
    this.cmAddressArray.push(this.createItemAddress(isPrincipalExist));
    this.ManageNameControlCountry(this.cmAddressArray.length - 1);
    this.ManageNameControlAddressFrench(this.cmAddressArray.length - 1);
    this.initValidateAddresse();
  }
   

   deleteCmAddressValue(index) {
     if(!isNullOrUndefined(this.cmAddressArray)) {
       this.cmAddressArray.removeAt(index);
     } else {
      this.cmAddressArray = this.form.get('cmAddressArray') as FormArray;
     }
   }


   

   onChangeCheckAddressHandler(i) {
     const value = this.form.get('cmAddressArray')['controls'][i]['controls'].checkProAddress.value;
    this.form.get('cmAddressArray')['controls'].map(x =>  {
          if( x.value.checkProAddress === true) {
            x.patchValue({
              checkProAddress: false
            })
          }
        });
        this.form.get('cmAddressArray')['controls'][i].patchValue({
          checkProAddress: value
        });
    }

    onChangeCheckIsAddressFrench(i): boolean {
      this.initValidateAddresse();
      return this.form.get('cmAddressArray')['controls'][i]['controls'].checkIsFrench.value;
    }

    isCheckFrench(i): boolean {
      return this.form.get('cmAddressArray')['controls'][i]['controls'].checkIsFrench.value;
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

     isSelectionAddress(i): boolean {
       const value = this.form.get('cmAddressArray')['controls'][i]['controls'].addressFrench.value;
       return (value !== '' && typeof value !== 'object') ;
       
     }




    lookup(value: string): Observable<OrasAddressService[]> {
      return this.orasAddressService.getFullAdresse(value).pipe(
        map(results => results),
        catchError(_ => {
          return of(null);
        })
      );
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

    selectedPrincipalDefault(key: string): boolean {
      return key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key;
    }

    /** end traitement addres */

  

  // CHIPLIST FUNCTIONS
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.chipList.errorState = false;
    });
    
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
      if(!this.roles.includes(event.option.value) && !this.isAffect) {
        this.personService.isAffectOtherInterlocutor(getDecryptedValue(this.customerId), event.option.value.key, 0).subscribe(data => { 
          if(!isNullOrUndefined(data) && data !== 'null') {
             this.isAffect =  true;
             this.nameAffect = data;
             this.roleDejaAffect = event.option.value.value;
             this.roleDejaAffectKey = event.option.value.key;
           } else {
             this.isAffect = false;
           }
          });
        this.roles.push(event.option.value);
        this.roleInput.nativeElement.value = '';
        this.roleCtrl.setValue(null);
        this.chipList.errorState = false;
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

  isDepasse69caracter(): boolean {
    let isExist = false;
    this.form.get('cmAddressArray')['controls'].map(x => {
      const number = x.value.batiment.length  + x.value.codePorte.length + x.value.appt.length;
      if ( number > 69) {
        isExist =  true;
      }
    });

    return isExist;
  }



  save(): void {
    this.initValidate();
    if(!this.notValidateForm() && !this.isAffect && !this.isDepasse69caracter()) {
      this.personService.saveInterlocutor(this.preparedObjectToSave()).subscribe( data => {
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

  getFixeForSave(x: any, interlocutor: Interlocutor) {
    if(x.value.typeFixe !==  null && this.getZeroNum(x.value.phoneFixe) !== '0' && this.getZeroNum(x.value.phoneFixe) !== '') {
      let cm = new ContactMethodNew(0, x.value.typeFixe, this.getZeroNum(x.value.phoneFixe), CM_MEDIA_REF_KEY.TEL_FIXE, null, x.value.checkProFixe);
      interlocutor.listCm.push(cm);
      if(x.value.checkProFixe === true ) {
        cm = new ContactMethodNew(0, TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key, this.getZeroNum(x.value.phoneFixe), CM_MEDIA_REF_KEY.TEL_FIXE, null, x.value.checkProFixe);
        interlocutor.listCm.push(cm);
      }
    }
  }

  getMobileForSave(x: any, interlocutor: Interlocutor) {
    if(x.value.typeMobile !==  null && this.getZeroNum(x.value.phoneMobile) !== '0' && this.getZeroNum(x.value.phoneMobile) !== '') {
     let cm = new ContactMethodNew(0, x.value.typeMobile, this.getZeroNum(x.value.phoneMobile), CM_MEDIA_REF_KEY.TEL_MOBILE, null, x.value.checkProMobile); 
      interlocutor.listCm.push(cm);
      if(x.value.checkProMobile === true ) {
        cm = new ContactMethodNew(0, TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key, this.getZeroNum(x.value.phoneMobile), CM_MEDIA_REF_KEY.TEL_MOBILE, null, x.value.checkProMobile);
        interlocutor.listCm.push(cm);
      }
    }
  }

  preparedObjectToSave(): Interlocutor{
  const interlocutor = {} as Interlocutor;
  interlocutor.listCm = [] ;
 
  let cm = {} as ContactMethodNew;
  interlocutor.categoryPersonKey = PERSON_CATEGORY.PHYSIQUE;
  interlocutor.customerId = getDecryptedValue(this.customerId);
  interlocutor.civilite = this.form.get('civilite').value;
  interlocutor.firstName = this.form.get('firstName').value;
  interlocutor.lastName = this.form.get('lastName').value;
  interlocutor.favoritLanguage = this.getFavoriteLanguage(this.form.get('favoritLanguage').value);
  interlocutor.roles = this.roles;

  this.form.get('cmFixeArray')['controls'].map(x =>  {
    this.getFixeForSave(x, interlocutor);
  });

   cm = {} as ContactMethodNew;
  this.form.get('cmMobileArray')['controls'].map(x =>  {
    this.getMobileForSave(x, interlocutor)
  });

   cm = {} as ContactMethodNew;
  this.form.get('cmMailArray')['controls'].map(x =>  {
    if(x.value.typeMail !== null && x.value.mail !== '') {
      cm = new ContactMethodNew(0, x.value.typeMail, x.value.mail, CM_MEDIA_REF_KEY.EMAIL, null, x.value.checkProMail);
      interlocutor.listCm.push(cm); 
      if(x.value.checkProMail === true ) {
        cm = new ContactMethodNew(0, TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key, x.value.mail, CM_MEDIA_REF_KEY.EMAIL, null, x.value.checkProMail); 
        interlocutor.listCm.push(cm);
      }
    }
    
  });

   
  this.form.get('cmAddressArray')['controls'].map(x => {
    if(x.value.typeAddress !== null && x.value.typeAddress !=='') {
      cm = {} as ContactMethodNew;
      cm.addressPostal = this.preparedObjetAdressOras(x.value, x.value.checkIsFrench);

      cm = new ContactMethodNew(0, x.value.typeAddress, x.value.typeAddress, CM_MEDIA_REF_KEY.POSTAL_ADDRESS, cm.addressPostal, x.value.checkProAddress); 
      interlocutor.listCm.push(cm);
      if(x.value.checkProAddress === true) {
        cm = new ContactMethodNew(0, TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key, x.value.typeAddress, CM_MEDIA_REF_KEY.POSTAL_ADDRESS, cm.addressPostal, x.value.checkProAddress); 
        interlocutor.listCm.push(cm);
      }
    }
    
  });

  return interlocutor; 

  }

  preparedObjetAdressOras(addressOras: any, checkIsFrench): CmPostalAddressVO {
    const addressPostal = {} as CmPostalAddressVO;
    if(checkIsFrench === true) {
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
    addressPostal.addrLine4 = addressOras.addressFrench.line4;
    
    if(!isNullOrUndefined(addressOras.line6)) {
      addressPostal.addrLine6 = addressOras.line6;
    } else {
      addressPostal.addrLine6 = this.addrLine6France(addressPostal, addressOras.addressFrench);
    }
    addressPostal.country = addressOras.addressFrench.country;
    } else {
      addressPostal.city = addressOras.ville;
      addressPostal.country = addressOras.addressCountry.key;
      addressPostal.postalCode = addressOras.codePostal;
      addressPostal.addrLine4 = addressOras.adresse;
    } 
      addressPostal.active = true;
      addressPostal.addrLine2 = addressOras.batiment;
      addressPostal.logisticInfo = addressOras.codePorte
      addressPostal.addrLine3 = addressOras.appt;
      addressPostal.lastName = this.form.get('lastName').value;
      addressPostal.firstName = this.form.get('firstName').value;
      addressPostal.title = this.form.get('civilite').value;
      addressPostal.companyName = null;
    return addressPostal;
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

  getFavoriteLanguage(value: string) : string {
    if(value === 'FR') {
      return REF_FAVORITE_LANGUAGE.FRENCH;
    } else if (value === 'EN') {
      return REF_FAVORITE_LANGUAGE.ENGLISH;
    } else if (value === 'AR') {
      return REF_FAVORITE_LANGUAGE.ARABIC;
    }else if (value === 'IT') {
      return REF_FAVORITE_LANGUAGE.ITALIE;
    }else if (value === 'RU') {
      return REF_FAVORITE_LANGUAGE.RUSSE;
    } 
    return REF_FAVORITE_LANGUAGE.FRENCH;
  }

  notValidateForm(): boolean {
  if(this.form.get('civilite').value === '') {
    this.civiliteValide = false;
  }
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

  checkValide(): boolean {
    if(!this.civiliteValide || !this.nomValide || !this.prenomValid  || !this.roleValid || !this.adressFrancaisValide 
      || !this.paysHorsFrancaisValide || !this.adresseHorsFrancaisValide || !this.formatAddressValid || !this.mailValid) {
        return true;
      }
    return false;
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
      if(x.value.checkIsFrench === false && ( x.value.addressCountry === null  || x.value.addressCountry === '') ) {
        this.paysHorsFrancaisValide = false;
      }
      if(x.value.checkIsFrench === false && x.value.adresse === '') {
        this.adresseHorsFrancaisValide = false;
      }
  }

  initValidateAddresse(): void {
    this.adressFrancaisValide = true;
    this.paysHorsFrancaisValide = true;
    this.adresseHorsFrancaisValide = true;
    this.formatAddressValid = true;
  }

  initValidate(): void {
    this.civiliteValide = true;
    this.nomValide = true;
    this.prenomValid = true;
    this.roleValid = true;
    this.initValidateAddresse();
  }


  checkValidAddress(i, val, attribut): boolean {
    let add: any;
    const isFrench = this.form.get('cmAddressArray')['controls'][i]['controls'].checkIsFrench.value;
    if(attribut === 'addressFrench' && isFrench === true ) {
      add = this.form.get('cmAddressArray')['controls'][i]['controls'].addressFrench.value;
    } else if (attribut === 'addressCountry' && isFrench === false) {
      add = this.form.get('cmAddressArray')['controls'][i]['controls'].addressCountry.value;
    } else if (attribut === 'codePostal' && isFrench === false ) {
      add = this.form.get('cmAddressArray')['controls'][i]['controls'].codePostal.value;
    } else if (attribut === 'ville' && isFrench === false) {
      add = this.form.get('cmAddressArray')['controls'][i]['controls'].ville.value;
    } else if (attribut === 'adresse' && isFrench === false) {
      add = this.form.get('cmAddressArray')['controls'][i]['controls'].adresse.value;
    }
     
    if(!val && ( add === null || add === '')) {
      return false;
    }
    return true;
  }

  annuler(): void {
    this.redirect(true, false);
  }

  redirect(canceled: boolean, submitted: boolean): void {
    this.onCanceledChange.emit(canceled);
    this.onSubmittedChange.emit(submitted);
    
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

}
