import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { ReferenceDataVO } from '../../../../_core/models/reference-data-vo';
import { CanalMotifHomologation } from '../../../../_core/models/Canal-Motif-homologation-vo';
import { ReferenceDataTypeService, UserService } from '../../../../_core/services';
import { CanalAcquisitionComponent } from '../../homologation/homologation-contractual-information/canal-acquisition/canal-acquisition.component';
import { UserVo } from '../../../../_core/models';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { CONSTANTS } from '../../../../_core/constants/constants';
import { CustomerVO } from '../../../../_core/models/customer-vo';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CustomerReferentVO } from '../../../../_core/models/customer-referent-vo';
import { AcquisitionCanalLight } from '../../../../_core/models/acquisition-canal-light';
import { ProfilContractService } from '../profil-contract.service';

@Component({
  selector: 'app-sale-approval-modification',
  templateUrl: './sale-approval-modification.component.html',
  styleUrls: ['./sale-approval-modification.component.scss']
})
export class SaleApprovalModificationComponent implements OnInit, OnChanges {


  removable = true;
  selectable = true;
  @Input() canalMotifHomologation: CanalMotifHomologation;

  @Input() customer: CustomerVO;
  notHomologatedReasons: ReferenceDataVO[];
  listHomologatedReasons: ReferenceDataVO[];
  updatedReferents: CustomerReferentVO[];
  acquisitionCanalsToUpdate: AcquisitionCanalLight[];
  filteredlistHomologatedReasons: Observable<ReferenceDataVO[]>;
  formSale: FormGroup;
  filteredVendeurs: Observable<UserVo[]>;
  vendeurs: UserVo[];
  selectedVendeur: UserVo;
  lStatusVente: ReferenceDataVO[] = [];
  reasonCtrl = new FormControl();
  @Output() changeDirtySaleApprovalForm = new EventEmitter<boolean>();



  customerId: string;
  @ViewChildren(CanalAcquisitionComponent) canalsViews: QueryList<CanalAcquisitionComponent>;
  defaultReferenceValue = {} as ReferenceDataVO;
  @Output() changeForm = new EventEmitter<CustomerVO>();
  @Output() changeAcquistionCanal = new EventEmitter<AcquisitionCanalLight[]>();

  showMotif = false;
  isMotifValid = true;
  @Input() isSelected = false;
  firstCanalChanged: boolean;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('reasonInput', { static: false }) reasonInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('chipList', { static: false }) chipList;
  asterix: string;
  isProspectOrContact = false;


  constructor(readonly userService: UserService,
    readonly referenceDataTypeService: ReferenceDataTypeService,
    readonly fb: FormBuilder,
    readonly profilContractService: ProfilContractService) { }

  ngOnInit() {
    this.buildForm();
    this.onChangeForm();
    this.initVendeur();
    this.onChangeVendeur();
    this.getistStatusVente();
    this.initReasonHomologation();
    this.updatedReferents = [...this.customer.referents];
    this.acquisitionCanalsToUpdate = [...this.customer.acquisitionCanals];

    this.notHomologatedReasons = [...this.customer.notHomologatedReasons];

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.profilContractService.getIsProspectOrContact().subscribe(value => {
      this.isProspectOrContact = value;
      this.asterix = this.profilContractService.getAsterix(value);
     })
   
}
  buildForm(): void {
    this.formSale = this.fb.group({
      referents: this.fb.control(null),
      reasonCtrl: this.reasonCtrl,
      statutVente: this.fb.control(this.customer.statutVente),
      commentaireVente: this.fb.control(this.customer.commentaireVente),
      selectionCommitteeDecision: this.fb.control(this.initDecision()),
      selectionCommitteeDate: this.fb.control(new Date(this.customer.selectionCommitteeDate ? this.customer.selectionCommitteeDate : ''))
    });
  }

  initDecision(): string {
    let result = null;
    if (!isNullOrUndefined(this.customer.selectionCommitteeDecision)) {
      result = this.customer.selectionCommitteeDecision ? 'true' : 'false';
    }
    return result;
  }

  initReasonHomologation(): void {
    this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('HOMOLOGATION_TYPES', 1).subscribe(data => {
      this.listHomologatedReasons = data;
      this.filteredlistHomologatedReasons = this.reasonCtrl.valueChanges.pipe(
        startWith(''),
        map(option => option ? this._filterReason(option) : this.listHomologatedReasons.slice())
      );
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    if (!this.notHomologatedReasons.includes(event.option.value)) {
      this.notHomologatedReasons.push(event.option.value);
      this.reasonInput.nativeElement.value = '';
      this.reasonCtrl.setValue(null);
      this.changeDirtySaleApprovalForm.emit(true);
      this.chipList.errorState = false;
    }
  }

  remove(ref: any): void {
    const index = this.notHomologatedReasons.indexOf(ref);
    if (index >= 0) {
      this.changeDirtySaleApprovalForm.emit(true);
      this.notHomologatedReasons.splice(index, 1);
    }
  }

  private _filterReason(value: string): ReferenceDataVO[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.listHomologatedReasons.filter(role => role.label.toLowerCase().indexOf(filterValue) === 0);
    }
    return [];
  }

  initVendeur(): UserVo[] {
    this.userService.getUsersByIdRole(CONSTANTS.ROLE_VENTE).subscribe(data => {
      this.vendeurs = data;
      let idRefDefault = 0;
      if (!isNullOrUndefined(this.customer.referents)) {
        for (const ref of this.customer.referents) {
          if (ref.roleId === CONSTANTS.ROLE_VENTE) {
            idRefDefault = ref.userId;
          }
        }
      }
      this.filteredVendeurs = this.formSale.get('referents').valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.label),
          map(name => name ? this._filterUserList(this.vendeurs, name) : this.vendeurs.slice())
        );

      this.selectedVendeur = this.vendeurs.filter(c => c.id === idRefDefault)[0];
      this.formSale.get('referents').setValue(this.selectedVendeur);
    });

    return this.vendeurs;
  }

  _filterUserList(users: UserVo[], value: string): UserVo[] {
    return users.filter(option => option.lastName.toLowerCase().indexOf(value) === 0);
  }

  displayUser(user: UserVo): string {
    return user ? `${user.lastName} ${user.firstName}` : '';
  }

  getistStatusVente(): void {
    this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('CUSTOMER_VENTE_STATUT', 1).subscribe(data => {
      this.lStatusVente = data;
      if (data) {
        this.initStatusVent();
      }
    });
  }

  initStatusVent() {
    if (!this.customer.statutVente) {
      this.formSale.get('statutVente').setValue(null);
    } else {
      this.lStatusVente.forEach(
        (status) => {
          if (status.label === this.customer.statutVente.label) {
            this.formSale.get('statutVente').setValue(status);
          }
        }
      );
    }

  }

  onChangeSecondCanal(event: boolean): void {
    this.changeDirtySaleApprovalForm.emit(true);
  }

  onChangeFirstCanal(event: boolean): void {
    this.changeDirtySaleApprovalForm.emit(true);
    this.firstCanalChanged = event;
    if (!event) {
      this.customer.acquisitionCanals = [];
      const canalComponentArray = this.canalsViews.toArray();
      if (canalComponentArray && canalComponentArray.length > 0) {
        canalComponentArray.forEach(canalComponent => {
          if (canalComponent.numberCanal === 1) {
            canalComponent.acquisitionCanal = null;
            canalComponent.firstCanalControl.setValue(this.defaultReferenceValue);
            canalComponent.updateCanalForm(true, false);
          }
        });
      }
    }
  }

  onUpdateAcquistionCanal(event): void {
    const isNew = true;
    if (!isNullOrUndefined(this.acquisitionCanalsToUpdate) &&
      this.acquisitionCanalsToUpdate.length > 0) {
      this.checkUpdateIsExistAcquisitionCanal(isNew, event);
    } else if (!isNullOrUndefined(event.canalKey)) {
      this.acquisitionCanalsToUpdate = [];
      this.acquisitionCanalsToUpdate.push(event)
    }
    this.changeAcquistionCanal.emit(this.acquisitionCanalsToUpdate);

  }

  checkUpdateIsExistAcquisitionCanal(isNew, event): void {
    let newC = isNew;
    for (const acquisitionCanal of this.acquisitionCanalsToUpdate) {
      if (acquisitionCanal.numberCanal === event.numberCanal) {
        newC = false;
        if (!isNullOrUndefined(event.canalKey)) {
          this.acquisitionCanalsToUpdate[acquisitionCanal.numberCanal] = event;
        } else {
          this.acquisitionCanalsToUpdate.splice(acquisitionCanal.numberCanal, 1);
        }
      }
    }
    if (newC && !isNullOrUndefined(event.canalKey)) {
      this.acquisitionCanalsToUpdate.push(event);
    }
  }

  displayVendeur(value: any): string {
    return value ? value.lastName : '';
  }

  onChangeForm(): void {
    if (!isNullOrUndefined(this.formSale)) {
      this.formSale.valueChanges.subscribe(() => {
        this.changeDirtySaleApprovalForm.emit(this.formSale.dirty);
        this.changeForm.emit(this.setCustomerVO());
      });
    }
  }

  onChangeVendeur(): void {
    this.formSale.get('referents').valueChanges.subscribe(value => {
      if (typeof value === 'object') {
        this.selectedVendeur = value;
        this.changeReferent(CONSTANTS.ROLE_VENTE, value.id, value);
      } else {
        this.changeReferent(CONSTANTS.ROLE_VENTE, null, null);
      }
    });
  }

  changeReferent(roleId: number, userId: number, user: UserVo): void {
    const { referents } = this.customer;
    const elementsIndex = referents.findIndex(element => element.roleId === roleId);
    if(elementsIndex !== -1 && (userId === null || user === null)) {
       referents.splice(elementsIndex, 1)
    } else if (elementsIndex === -1 && !isNullOrUndefined(user)) {
      referents.push(this.serUserVoToReferent(user, roleId, 'VENTE'));
    } else {
      referents[elementsIndex] = { ...referents[elementsIndex], userId };
    }

    this.updatedReferents = referents;
  }

  serUserVoToReferent(user: UserVo, roleId, roleName): CustomerReferentVO {
    if (!isNullOrUndefined(user)) {
      const custmerRef = {} as CustomerReferentVO;
      custmerRef.userId = user.id;
      custmerRef.roleId = roleId;
      custmerRef.firstName = user.firstName;
      custmerRef.lastName = user.lastName;
      custmerRef.roleName = roleName;
      custmerRef.parnasseEmail = user.parnasseEmail;
      custmerRef.userName = user.name;
      custmerRef.customerId = this.customer.id;
      return custmerRef;
    }
    return null;
  }

  setCustomerVO(): CustomerVO {
    const cust = {} as CustomerVO;
    cust.referents = this.updatedReferents;
    cust.statutVente = this.formSale.get('statutVente').value;
    cust.commentaireVente = this.formSale.get('commentaireVente').value;
    cust.acquisitionCanals = this.acquisitionCanalsToUpdate;
    cust.selectionCommitteeDate = this.formSale.get('selectionCommitteeDate').value;
    cust.selectionCommitteeDecision = this.setComitterSelection();
    cust.notHomologatedReasons = this.notHomologatedReasons;
    return cust;
  }

  setComitterSelection(): boolean {
    if (!isNullOrUndefined(this.formSale.get('selectionCommitteeDecision').value)) {
      return this.formSale.get('selectionCommitteeDecision').value === 'true' ? true : false;
    }
    return null;
  }

  isSaleFormValid(value: string): boolean {
    return (this.formSale.controls[value].touched || this.isSelected) && !this.isProspectOrContact &&
      (this.formSale.get(value).value === null ||
        this.formSale.get(value).value === undefined ||
        this.formSale.get(value).value === '');
  }

  getAffichageNotHomoloSelectionner(val: ReferenceDataVO): string {
    if (!isNullOrUndefined(val)) {
      if (!isNullOrUndefined(val.parent)) {
        return ` ${val.parent.label} > ${val.label} `;
      } else {
        return ` ${val.label} `;
      }
    }
    return '';
  }

}

