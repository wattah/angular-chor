import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { ProfilContractService } from '../profil-contract.service';
import { CustomerVO } from '../../../../_core/models/customer-vo';
import { PersonVO } from '../../../../_core/models/person-vo';

@Component({
  selector: 'app-contractual-status-consultation',
  templateUrl: './contractual-status-consultation.component.html',
  styleUrls: ['./contractual-status-consultation.component.scss']
})
export class ContractualStatusConsultationComponent implements OnInit {

  @Input()
  customer: CustomerVO;

  @Input()
  person: PersonVO;


  isMemberValidated: string;


  constructor(readonly profilContractService: ProfilContractService) { }

  ngOnInit() {
    if(!isNullOrUndefined(this.customer)) {
      if(this.customer.isMemberValidated === true) {
        this.isMemberValidated = 'Oui';
      } else if(this.customer.isMemberValidated === false) {
        this.isMemberValidated = 'Non'
      } else {
        this.isMemberValidated = '-';
      }
    }
  }
  @Output() updateContractualStatus = new EventEmitter<boolean>(null);

  onUpdateContractualStatus(): void {
    this.updateContractualStatus.emit(false);
  }

  getStatusCustomer(): string {
    return this.profilContractService.getCustomerStatus(this.customer.status);
  }

  realisationStatut(val: string) : string {
    let result = '-';
    if(!isNullOrUndefined(val)) {
      if(val === 'realise') {
       result = 'Réalisé';
      } else if (val === 'pasRealise') {
        result = 'Pas réalisé';
      } else if (val === 'decale') {
        result = 'Décalé';
      }
    }
    return result;
  }

}
