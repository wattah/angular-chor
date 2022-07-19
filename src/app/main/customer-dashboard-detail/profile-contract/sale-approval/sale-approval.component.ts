import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AcquisitionCanalLight } from '../../../../_core/models/models';
import { CustomerVO } from '../../../../_core/models/customer-vo';
import { PersonVO } from '../../../../_core/models/person-vo';
import { ProfilContractService } from '../profil-contract.service';


@Component({
  selector: 'app-sale-approval',
  templateUrl: './sale-approval.component.html',
  styleUrls: ['./sale-approval.component.scss']
})
export class SaleApprovalComponent implements OnInit {

  @Input()
  person: PersonVO;

  @Input()
  customer: CustomerVO;

  @Input()
  isSelected: boolean;
  @Output() changeSaleApprovalForm = new EventEmitter<CustomerVO>();
  @Output() changeAcquistionCanal = new EventEmitter<AcquisitionCanalLight[]>();
  @Output() changeDirtySaleApprovalForm = new EventEmitter<boolean>();
 
  consultationModePage$: BehaviorSubject<boolean>;
  constructor(private readonly profilContractService: ProfilContractService) { }

  ngOnInit() {
    this.consultationModePage$ = this.profilContractService.getConsultationModePage();
  }
  onUpdateSaleApproval(mode: boolean): void {
    this.profilContractService.updateConsultationModePage(mode);
  }

  onChangeSaleApprovalForm(cus: CustomerVO): void {
    this.changeSaleApprovalForm.emit(cus);
  }

  onChangeAcquistionCanal(acqui: AcquisitionCanalLight[]): void {
   this.changeAcquistionCanal.emit(acqui);
  }

  OnChangeDirtySaleApprovalForm(val: boolean): void {
    this.changeDirtySaleApprovalForm.emit(val);
  }

}
