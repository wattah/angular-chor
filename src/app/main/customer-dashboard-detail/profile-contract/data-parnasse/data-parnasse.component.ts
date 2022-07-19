import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { CustomerProfileVO } from '../../../../_core/models/customer-profile-vo';
import { ProfilContractService } from '../profil-contract.service';

@Component({
  selector: 'app-data-parnasse',
  templateUrl: './data-parnasse.component.html',
  styleUrls: ['./data-parnasse.component.scss']
})
export class DataParnasseComponent implements OnInit {

  consultationModePage$: BehaviorSubject<boolean>;

  @Input() customerProfile: CustomerProfileVO;
  @Input() isSelected = false;

  @Output() changeDataParnasseForm = new EventEmitter<Object>();

  typeCustomer: string;

  constructor(private readonly route: ActivatedRoute, private readonly profilContractService: ProfilContractService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe( params => {
      this.typeCustomer = params.get('typeCustomer');
    });
    this.consultationModePage$ = this.profilContractService.getConsultationModePage();
  }

  onUpdateDataParnasse(mode: boolean): void {
    this.profilContractService.updateConsultationModePage(mode);
  }

  onChangeDataParnasseForm(customerProfileVO: CustomerProfileVO): void {
    this.changeDataParnasseForm.emit(customerProfileVO);
  }

}
