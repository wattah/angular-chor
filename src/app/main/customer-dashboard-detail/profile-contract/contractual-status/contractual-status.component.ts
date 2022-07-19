import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PersonVO } from '../../../../_core/models/person-vo';
import { ProfilContractService } from '../profil-contract.service';
import { CustomerVO } from '../../../../_core/models/customer-vo';

@Component({
  selector: 'app-contractual-status',
  templateUrl: './contractual-status.component.html',
  styleUrls: ['./contractual-status.component.scss']
})
export class ContractualStatusComponent implements OnInit {

  @Input()
  person: PersonVO;

  @Input()
  customer: CustomerVO;

  consultationModePage$: BehaviorSubject<boolean>;

  // to prevent new data of  form
  @Output() changeCustomerFormStatus = new EventEmitter<CustomerVO>();

  @Output() changePersonFormStatus = new EventEmitter<PersonVO>();

  @Output() changeDirtyStatusContractualForm = new EventEmitter<boolean>();

  @Input()
  isSelected: boolean;

  constructor(private readonly profilContractService: ProfilContractService) { }

  ngOnInit(): void {
    this.consultationModePage$ = this.profilContractService.getConsultationModePage();
  }

  onUpdateContractualStatus(mode: boolean): void {
    this.profilContractService.updateConsultationModePage(mode);
  }

  onChangePersonStatutForm(person: PersonVO): void {
   this.changePersonFormStatus.emit(person);
  }

  onChangeCustomerStatutForm(customer: CustomerVO): void {
    this.changeCustomerFormStatus.emit(customer);
  }

  onChangeDirtyStatusContractualForm(val: boolean): void {
    this.changeDirtyStatusContractualForm.emit(val);
  }

}
