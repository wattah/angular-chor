import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators';

import { CONSTANTS } from '../../../../_core/constants/constants';
import { UserVo } from '../../../../_core/models';
import { CustomerAutocomplete } from '../../../../_core/models/customer-autocomplete';
import { CustomerProfileVO } from '../../../../_core/models/customer-profile-vo';
import { CustomerReferentVO } from '../../../../_core/models/customer-referent-vo';
import { CustomerService, UserService } from '../../../../_core/services';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { ProfilContractService } from '../profil-contract.service';

@Component({
  selector: 'app-data-parnasse-modification',
  templateUrl: './data-parnasse-modification.component.html',
  styleUrls: ['./data-parnasse-modification.component.scss']
})
export class DataParnasseModificationComponent implements OnInit {

  @Input() typeCustomer: string;

  @Input() customerProfile: CustomerProfileVO;

  @Input() isSelected =  false;

  @Output() changeForm = new EventEmitter<Object>();

  formDataParnasse: FormGroup;

  errors: string[];

  errorText = '';

  recoveryProfilList = [ 'BP', 'AS', 'MP', 'TMP' ];
  FREE_MANAGEMENT = { name : 'freeManagement', value: 'Gestion'};
  DATE_DEBUT_COMPLAINT = { name : 'dateDebutComplaint', value: 'Date de début' };
  COMPLAINT_VALUE = { name : 'complaintValue', value: 'Commentaire' };
  COACH = { name : 'coach', value: 'Coach' };
  DESK = { name : 'desk', value: 'Desk' };

  showComplaintData: boolean;

  deskList: UserVo[];
  filterdDeskList: Observable<UserVo[]>;

  coachList: UserVo[];
  filterdCoachList: Observable<UserVo[]>;
  filterdCoachReferentList: Observable<UserVo[]>;

  selectedCoach: UserVo;
  selectedDesk: UserVo;
  selectedCoachReferent: UserVo;

  updatedReferents: CustomerReferentVO[];

  filteredTitulaires$: Observable<CustomerAutocomplete[]> = null;
  isProspectOrContact = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  titleControl = new FormControl();
  filteredAffiliates$: Observable<CustomerAutocomplete[]> = null;
  selectedAffiliates: any[] = [];
  idsActualBeneficiaries: number[] = [];
  isFormValide = false;
  @ViewChild('affiliatesInput', { static: false }) affiliatesInput: ElementRef<HTMLInputElement>;
  asterix: string;
  constructor(private readonly fb: FormBuilder,
     private readonly userService: UserService,
      private readonly customerService: CustomerService,
      private readonly profilContractService: ProfilContractService) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.onChangeForm();
    this.onChangeIsComplaint(this.customerProfile.customer.isComplaint);
    this.formDataParnasse.get('isComplaint').valueChanges.subscribe( value => this.onChangeIsComplaint(value));
    this.initDesk();
    this.onChangeDesk();
    this.initCoach();
    this.onChangeCoach();
    this.initCoachReferent();
    this.onChangeCoachReferent();
    this.updatedReferents = [ ...this.customerProfile.customer.referents ];
    this.initTitulaire();
    this.changeTitulaire();
    this.initSelectedAffiliates();
    this.changeAffiliates();
    this.profilContractService.getIsProspectOrContact().subscribe(value => {
      this.asterix = this.profilContractService.getAsterix(value);
      this.isProspectOrContact = value;
      this.changeForm.emit({
        value : this.constructObjectDataParnasse(this.formDataParnasse.value),
        dirty: this.formDataParnasse.dirty,
        errors: this.setErrors(),
        invalid: this.isFormValide
      });
     })
  }

  buildForm(): void {
    this.formDataParnasse = this.fb.group({
      newsletter: this.fb.control(Boolean(this.customerProfile.customer.newsletter)),
      recoveryProfil: this.fb.control(this.customerProfile.customer.recoveryProfil),
      recoveryComment : this.fb.control(this.customerProfile.customer.recoveryComment),
      recoveryExtensionAllowed : this.fb.control(this.customerProfile.customer.recoveryExtensionAllowed),
      recoveryExtensionComment : this.fb.control(this.customerProfile.customer.recoveryExtensionComment),
      isComplaint : this.fb.control(Boolean(this.customerProfile.customer.isComplaint)),
      isSensible : this.fb.control(Boolean(this.customerProfile.customer.isComplaint)),
      dateDebutComplaint : this.fb.control(
        (!isNullOrUndefined(this.customerProfile.customer.dateDebutComplaint))
        ? new Date(this.customerProfile.customer.dateDebutComplaint)
        : null
        ),
      complaintValue : this.fb.control(this.customerProfile.customer.complaintValue),
      dateFinComplaint: this.fb.control((!isNullOrUndefined(this.customerProfile.customer.dateFinComplaint)) ? new Date(this.customerProfile.customer.dateFinComplaint) : null),
      freeManagement: this.fb.control(this.customerProfile.customer.freeManagement, [ Validators.required ]),
      coach: this.fb.control(null),
      desk:  this.fb.control(null),
      coachReferent: this.fb.control(null),
      titulaire: this.fb.control(null),
      optionAdmin: this.fb.control(this.initOptionAdmin()),
      affiliates: this.fb.control(null)
    });
  }

  constructObjectDataParnasse(value: any): {} {
    return {
      customer : {
        newsletter : value.newsletter,
        recoveryProfil : value.recoveryProfil,
        recoveryComment : value.recoveryComment,
        recoveryExtensionAllowed : value.recoveryExtensionAllowed,
        recoveryExtensionComment : value.recoveryExtensionComment,
        isComplaint : value.isComplaint,
        isSensible : value.isComplaint,
        dateDebutComplaint : value.dateDebutComplaint,
        complaintValue : value.complaintValue,
        dateFinComplaint : value.dateFinComplaint,
        freeManagement: value.freeManagement,
        referents : this.updatedReferents,
        coachRefId: (!isNullOrUndefined(this.selectedCoachReferent)) ? this.selectedCoachReferent.id : 0,
        coachRefName: (!isNullOrUndefined(this.selectedCoachReferent)) ? `${this.selectedCoachReferent.lastName} ${this.selectedCoachReferent.firstName}` : null,
        companyCustomerId: (!isNullOrUndefined(value.titulaire)) ? value.titulaire.id : null,
        companyCustomerFullName: (!isNullOrUndefined(value.titulaire)) ? value.titulaire.name : null,
        idsActualBeneficiaries: this.idsActualBeneficiaries
      }
    };
  }

  setErrors(): string[] {
    const errors = [];
      if (this.isValidForm(this.FREE_MANAGEMENT.name)) {
        errors.push(this.setErrorText(this.FREE_MANAGEMENT.value));
      }
      if(this.isValidForm(this.DATE_DEBUT_COMPLAINT.name) && this.showComplaintData) {
        errors.push(this.setErrorText(this.DATE_DEBUT_COMPLAINT.value));
      }
      if(this.isValidForm(this.COMPLAINT_VALUE.name) && this.showComplaintData) {
        errors.push(this.setErrorText(this.COMPLAINT_VALUE.value));
      }
      if(this.isValidForm(this.COACH.name)) {
        errors.push(this.setErrorText(this.COACH.value));
      }
      if(this.isValidForm(this.DESK.name)) {
        errors.push(this.setErrorText(this.DESK.value));
      }
      if(!isNullOrUndefined(errors) && errors.length !== 0) {
        this.isFormValide = true;
      } else {
        this.isFormValide = false;
      }
    return errors;
  }

  setErrorText(name: string): string {
    return `- Veuillez renseigner ${name} sur Données Parnasse`;
  }

  onChangeForm(): void {
    this.formDataParnasse.valueChanges.subscribe( (_values) => {
      this.changeForm.emit({
        value : this.constructObjectDataParnasse(_values),
        dirty: this.formDataParnasse.dirty,
        errors: this.setErrors(),
        invalid: this.isFormValide
      });
    });
  }

  onChangeIsComplaint(value: boolean): void {
    this.showComplaintData = value;
    if (value) {
      this.formDataParnasse.get('dateDebutComplaint').setValidators(Validators.required);
      this.formDataParnasse.get('complaintValue').setValidators(Validators.required);
    } else {
      this.formDataParnasse.get('dateDebutComplaint').clearValidators();
      this.formDataParnasse.get('complaintValue').clearValidators();
    }
    this.formDataParnasse.get('dateDebutComplaint').updateValueAndValidity();
    this.formDataParnasse.get('complaintValue').updateValueAndValidity();
    this.formDataParnasse.updateValueAndValidity();
  }

  /****************************************************
   * TEAM PARNASSE FUNCTION INITAILISATION AND CHANGE *
   ***************************************************/

  getUserIdInReferentList(roleId: number): number {
    if(!isNullOrUndefined(this.customerProfile.customer.referents)) {
      for (const ref of this.customerProfile.customer.referents) {
        if(ref.roleId === roleId) {
          return ref.userId;
        }
      }
    }
    return 0;
  }

  initCoachReferent(): void {
    this.userService.getUsersByIdRole(CONSTANTS.ROLE_COACH).subscribe((data) => {
      this.coachList = data;
      this.selectedCoachReferent = this.coachList.filter( c => c.id === this.customerProfile.customer.coachRefId)[0];
      this.formDataParnasse.get('coachReferent').setValue(this.selectedCoachReferent);
      this.filterdCoachReferentList = this.formDataParnasse.get('coachReferent').valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.label),
          map(name => name ? this._filterUserList(this.coachList, name) : this.coachList.slice())
        );
      });
  }

  initDesk(): void {
    this.userService.getUsersByIdRole(CONSTANTS.ROLE_DESK).subscribe((data) => {
      this.deskList = data;
      this.selectedDesk = this.deskList.filter( d => d.id === this.getUserIdInReferentList(CONSTANTS.ROLE_DESK))[0];
      this.formDataParnasse.get('desk').setValue(this.selectedDesk);
      this.filterdDeskList = this.formDataParnasse.get('desk').valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.label),
          map(name => name ? this._filterUserList(this.deskList, name) : this.deskList.slice())
        );
    });
  }

  initCoach(): void {
    this.userService.getUsersByIdRole(CONSTANTS.ROLE_COACH).subscribe((data) => {
      this.coachList = data;
      this.selectedCoach = this.coachList.filter( c => c.id === this.getUserIdInReferentList(CONSTANTS.ROLE_COACH))[0];
      this.formDataParnasse.get('coach').setValue(this.selectedCoach);
      this.filterdCoachList = this.formDataParnasse.get('coach').valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.label),
          map(name => name ? this._filterUserList(this.coachList, name) : this.coachList.slice())
        );
    });
  }

  onChangeDesk(): void {
    this.formDataParnasse.get('desk').valueChanges.subscribe( value => {
      if(typeof value === 'object') {
        this.selectedDesk = value;
        this.changeReferent(CONSTANTS.ROLE_DESK, value.id, value, 'DESK');
      } else {
        this.changeReferent(CONSTANTS.ROLE_DESK, null, null, 'DESK');
      }
    });
  }

  changeReferent(roleId: number, userId: number, userVo, roleName): void {
    const { referents } = this.customerProfile.customer;
    const elementsIndex = referents.findIndex(element => element.roleId === roleId );
    if(elementsIndex !== -1 && (userId === null || userVo === null)) {
      referents.splice(elementsIndex, 1);
    } else if(elementsIndex === -1 && !isNullOrUndefined(userVo)) {
      referents.push(this.serUserVoToReferent(userVo, roleId, roleName));
    } else {
      referents[elementsIndex] = { ...referents[elementsIndex], userId };
    }
    this.updatedReferents = referents;
  }

  serUserVoToReferent(user: UserVo, roleId, roleName): CustomerReferentVO {
    const custmerRef = {} as CustomerReferentVO;
    custmerRef.userId = user.id;
    custmerRef.roleId = roleId;
    custmerRef.firstName = user.firstName;
    custmerRef.lastName = user.lastName;
    custmerRef.roleName = roleName;
    custmerRef.parnasseEmail = user.parnasseEmail;
    custmerRef.userName = user.name;
    custmerRef.customerId = this.customerProfile.customer.id;
    return custmerRef;
  }

  onChangeCoachReferent(): void {
    this.formDataParnasse.get('coachReferent').valueChanges.subscribe( value => {
      if (typeof value === 'object') {
        this.selectedCoachReferent = value;
      } else {
        this.selectedCoachReferent = null;
      }
    });
  }

  onChangeCoach(): void {
    this.formDataParnasse.get('coach').valueChanges.subscribe( value => {
      if(typeof value === 'object') {
        this.selectedCoach = value;
        this.changeReferent(CONSTANTS.ROLE_COACH, value.id, value, 'COACH');
      } else {
        this.changeReferent(CONSTANTS.ROLE_COACH, null, null, 'COACH');
      }
    });
  }

  _filterUserList(users: UserVo[], value: string): UserVo[] {
    return users.filter(option => option.lastName.toLowerCase().indexOf(value) === 0);
  }

  displayUser(user: UserVo): string {
    return user ? `${user.lastName} ${user.firstName}` : '--';
  }

  /****************************************
   *  Titulaire                           *
   ****************************************/

  initTitulaire(): void {
    if ( ! isNullOrUndefined(this.customerProfile.customer.companyCustomerId)) {
      this.formDataParnasse.get('titulaire').setValue({
        categoryCustomer: 'ENTREPRISE',
        holderBenefName: null,
        id: this.customerProfile.customer.companyCustomerId,
        name: this.customerProfile.customer.companyCustomerFullName,
        nicheIdentifier: null,
        referenceKey: 'ref_customer_person_role_type_titulaire',
        status: null
      });
      this.formDataParnasse.get('titulaire').updateValueAndValidity();
    }
  }

  changeTitulaire(): void {
    this.filteredTitulaires$ = this.searchMemmbres(this.formDataParnasse.get('titulaire'));
  }

  lookup(value: string): Observable<CustomerAutocomplete[]> {
    const status = [];
    return this.customerService.autoCompleteClient(value, 1, status, '', false).pipe(
      map(results => results),
      catchError(_ => of(null))
    );
  }

  displayClient(value: any): string {
    return value ? value.name : '';
  }

  afficherNumContrat(value: string): string {
    if (!isNullOrUndefined(value)) {
      return `N° contrat ${value}`;
    }
    return '';
  }

  initOptionAdmin(): boolean {
    const { offerIds } = this.customerProfile.customer;
    if ( 
      !isNullOrUndefined(offerIds) 
      && offerIds.length > 0 
      && offerIds.findIndex(o => CONSTANTS.OFFER_PLURIEL === o) >= 0
      && offerIds.findIndex(o => CONSTANTS.OPTION_ADMIN === o) >= 0
    ) {
      return true;
    }
    return false;
  }

  /****************************************
   *  Bénéficiares                        *
   ****************************************/

  initSelectedAffiliates(): void {
    this.customerProfile.customer.customerAffiliates.forEach( c => {
      this.selectedAffiliates.push({
        id: c.id,
        nicheIdentifier: c.nicheIdentifier,
        name: c.persons[0].fullName,
        categoryCustomer: 'PARTICULAR',
        holderBenefName: null,
        referenceKey: 'ref_customer_person_role_type_beneficiaire',
        status: null
      });
      this.idsActualBeneficiaries.push(c.id);
    });
  }

  changeAffiliates(): void {
    this.filteredAffiliates$ = this.searchMemmbres(this.formDataParnasse.get('affiliates'));
  }
  searchMemmbres(formContol: any): Observable<CustomerAutocomplete[]> {
    return formContol.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      switchMap( (value: string) => {
        if (value !== '' && value.length > 2) {
          return this.lookup(value);
        }
        return of(null);
      })
    );
  }

  remove(affil: CustomerAutocomplete): void {
    this.selectedAffiliates = [...this.selectedAffiliates.filter( t => affil.id !== t.id)];
    this.idsActualBeneficiaries = [...this.idsActualBeneficiaries.filter( t => affil.id !== t)];
    this.changeForm.emit({
      value : this.constructObjectDataParnasse(this.formDataParnasse.value),
      dirty: this.formDataParnasse.dirty,
      errors: this.setErrors(),
      invalid: this.isFormValide
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const newAffilate = event.option.value;
    const index = this.selectedAffiliates.findIndex( a => a.id === newAffilate.id );
    if (index === -1) {
      this.selectedAffiliates.push(newAffilate);
      this.idsActualBeneficiaries.push(newAffilate.id);
      this.changeForm.emit({
        value : this.constructObjectDataParnasse(this.formDataParnasse.value),
        dirty: this.formDataParnasse.dirty,
        errors: this.setErrors(),
        invalid: this.isFormValide
      });
    }
    this.affiliatesInput.nativeElement.value = '';
  }

  hasError(controlName: string): boolean {
    return (this.formDataParnasse.controls[controlName].touched || this.isSelected) && !this.isProspectOrContact &&
    (this.formDataParnasse.get(controlName).value === null ||
     this.formDataParnasse.get(controlName).value === undefined ||
     this.formDataParnasse.get(controlName).value === '');
  }

  isValidForm(controlName: string): boolean {
    return !this.isProspectOrContact &&
    (this.formDataParnasse.get(controlName).value === null ||
     this.formDataParnasse.get(controlName).value === undefined ||
     this.formDataParnasse.get(controlName).value === '');
  }

}
