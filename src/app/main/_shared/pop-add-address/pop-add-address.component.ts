import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { OrasAddressService } from '../../../_core/services/oras-address.service';
import { OrasPostalAddress,  ReferenceDataVO } from '../../../_core/models';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { ContactMethodService, PersonService, ReferenceDataTypeService } from '../../../_core/services';
import { CmPostalAddressVO } from '../../../_core/models/cm-postaladdress-vo';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { TYPE_CM_INTERLOCUTOR } from '../../../_core/constants/constants';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-pop-add-address',
  templateUrl: './pop-add-address.component.html',
  styleUrls: ['./pop-add-address.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopAddAddressComponent implements OnInit {

  @Input() 
  personId: number;

  @Input()
  isParticular = false;

  @Input()
  customerId: string;

  companyName: string;

  isFrench = new FormControl();
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
  @Output()
  resultCmPostalAddressVO = new EventEmitter();


  adresseFrancaisValide = true;
  formatAddressValid = true;
  addressCountryValide = true;
  adresseValide = true;

  isNotValid = false;

  form: FormGroup = this.fb.group({
    isFrench: true,
    adresseFrench: this.adresseFrench,
    addressCountry: this.addressCountry,
    appt: this.appt,
    batiment: this.batiment,
    codePorte: this.codePorte,
    adresse: this.adresse,
    ville: this.ville,
    codePostal: this.codePostal

  });

  constructor(readonly activeModal: NgbActiveModal,
    readonly fb: FormBuilder,
    readonly confirmationDialogService: ConfirmationDialogService, 
    readonly orasAddressService: OrasAddressService, 
    readonly referenceDataTypeService: ReferenceDataTypeService,
    readonly contactMethodService: ContactMethodService, 
    private readonly _snackBar: MatSnackBar,
    private readonly personService: PersonService) {
  }
  ngOnInit(): void {
    this.initCountry();
    this.getFilterAddress();
    this.initValidate();

    this.filteredCountry = this.form.get('addressCountry').valueChanges.pipe(
      startWith(''),
      map(ref => ref ? this._filterCountry(ref) : this.listCountry.slice())
     );

     this.personService.getCompanyNameByCustomerIdAndRoleEntrepriseAndBenef(this.personId, this.customerId).subscribe(
      data => {
        if(data !== '') {
          this.companyName = data;
        }else {
          this.companyName = null;
        }
       
      });
  }

  initCountry(): void {
    this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('COUNTRY',1).subscribe(data => {
     this.listCountry = data;
   });
  }

  private _filterCountry(value: string): ReferenceDataVO[] {
    if(value !== '' && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.listCountry.filter(ref => ref.label.toLowerCase().indexOf(filterValue) === 0);
    }
    return this.listCountry;
  }

  onChangeCheckIsAddressFrench(){
    this.isFrench = this.form.get('isFrench').value;
  }


  getFilterAddress(): void {
    this.filteredAddress$ = this.form.get('adresseFrench').valueChanges.pipe(
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

  displayCountry(value: any): string {
    return value ? value.label : '';
  }

  destroy(): void {
    this.isNotValid = false
    this.initValidate();
    if(this.checkIsSaisir()) {
          const title = 'Erreur!';
          const comment = 'Êtes-vous sûr de vouloir annuler votre création ?';
          const btnOkText = 'Oui, j\'annule ma création';
          const btnCancelText = 'Non je reviens à ma création';
          this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText, 'lg',true)
          .then((confirmed) => {
              if(confirmed) {
                this.activeModal.close(false);
              }
           })
          .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
      this.initValidate();
      } else {
        this.activeModal.close(false);
      }
    
  }
  checkIsSaisir(): boolean {
    let isSaisir = false;
    if( this.isFrenchSaisir() || 
       (this.form.get('isFrench').value === false && ((this.form.get('addressCountry').value !== null && this.form.get('addressCountry').value !== '') || 
       (this.form.get('ville').value !== null && this.form.get('ville').value !== '') || 
       (this.form.get('codePostal').value !== null && this.form.get('codePostal').value !== '') || 
       (this.form.get('adresse').value !== null && this.form.get('adresse').value !== ''))) || 
       (this.form.get('appt').value !== null &&  this.form.get('appt').value !== '') || 
       (this.form.get('batiment').value !== null &&  this.form.get('batiment').value !== '') ||
       (this.form.get('codePorte').value !== null &&  this.form.get('codePorte').value !== '')) {
      isSaisir = true;
   } 
   return isSaisir;
  }

  isFrenchSaisir(): boolean {
    return (this.form.get('isFrench').value === true && 
    (this.form.get('adresseFrench').value !== null && 
    this.form.get('adresseFrench').value !== ''))
  }


  initValidate(): void {
    this.adresseFrancaisValide = true;
    this.addressCountryValide = true;
    this.adresseValide = true;
    this.formatAddressValid = true;
    this.isNotValid = false;
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

  save(): void {
    this.initValidate();
    if(!this.validAddress() && !this.isDepasse69caracter()) {
     this.contactMethodService.addAddress(this.preparedObjetToSave()).subscribe( data => {
      this.resultCmPostalAddressVO.emit(data);
      this.openSnackBar("L'adresse temporaire a bien été enregistrée");
      this.activeModal.close(true);
      }); 
    }
  }

  preparedObjetToSave(): CmPostalAddressVO {
    const addressPostal = {} as CmPostalAddressVO;
    addressPostal.typeKey = TYPE_CM_INTERLOCUTOR.TEMPORAIRE.key;
    addressPostal.personId = this.personId;
    if(this.isFrench) {
    addressPostal.city = this.adresseFrench.value.cityName;
    addressPostal.postalCode = this.adresseFrench.value.postalCode;
    addressPostal.streetExtension = this.adresseFrench.value.streetExtension;
    addressPostal.streetName = this.adresseFrench.value.streetName;
    addressPostal.streetNumber = this.adresseFrench.value.streetNumber;
    addressPostal.streetType = this.adresseFrench.value.streetType;
    addressPostal.geoCodeX = this.adresseFrench.value.geoCodeX;
    addressPostal.orasId = this.adresseFrench.value.orasId;
    addressPostal.inseeCode = this.adresseFrench.value.cityInseeId;
    addressPostal.rivoliCode = this.adresseFrench.value.rivoliCode;
    addressPostal.cedex = this.adresseFrench.value.cedex;
    addressPostal.geoCodeY = this.adresseFrench.value.geoCodeY;
    addressPostal.addrLine5 = this.adresseFrench.value.line5;
    addressPostal.addrLine4 = this.adresseFrench.value.line4;
    
    if(!isNullOrUndefined(this.adresseFrench.value.line6)) {
      addressPostal.addrLine6 = this.adresseFrench.value.line6;
    } else {
      addressPostal.addrLine6 = this.addrLine6France(addressPostal, this.adresseFrench.value);
    }
    addressPostal.country = this.adresseFrench.value.country;
    } else {
      addressPostal.city = this.ville.value;
      addressPostal.country = this.addressCountry.value.key;
      addressPostal.postalCode = this.codePostal.value;
      addressPostal.addrLine4 = this.adresse.value;
    } 
      addressPostal.active = true;
      addressPostal.addrLine2 = this.batiment.value;
      addressPostal.logisticInfo = this.codePorte.value;
      addressPostal.addrLine3 = this.appt.value;
      addressPostal.companyName = this.companyName;
      
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

  validAddress(): boolean {
    if(this.isFrench) {
       if(this.adresseFrench.value === null || this.adresseFrench.value === '') {
         this.adresseFrancaisValide = false;
       } else if (this.adresseFrench.value !== '' && typeof this.adresseFrench.value !== 'object') {
        this.formatAddressValid = false;
       }
    } else {
      this.checkAddressHorsFrench();
    }
    return this.checkValide();
   }

   checkValide(): boolean {
    if(!this.adresseFrancaisValide ||
       !this.addressCountryValide || !this.adresseValide || !this.formatAddressValid) {
        this.isNotValid = true;
      } else {
        this.isNotValid = false;
      }
    return this.isNotValid;
  }

   checkAddressHorsFrench(): void {
    if(this.addressCountry.value === null || this.addressCountry.value === '') {
      this.addressCountryValide = false;
    }
    if(this.adresse.value === null || this.adresse.value === '') {
      this.adresseValide = false;
    }
   }

   isSelectionAddress(): boolean {
    if(!isNullOrUndefined(this.adresseFrench)) {
      const value = this.adresseFrench.value;
    return (value !== '' && typeof value !== 'object') ;
    }
    return false;
  }


   /** SNACK BAR */
   openSnackBar(text: string): void {
    this._snackBar.open(
      text, undefined, 
      { duration: 3000, panelClass: ['center-snackbar', 'snack-bar-container'] });
  }
}
