import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { PersonVO } from '../../../../_core/models/models';

import { ProfilContractService } from '../profil-contract.service';

@Component({
  selector: 'app-relational',
  templateUrl: './relational.component.html',
  styleUrls: ['./relational.component.scss']
})
export class RelationalComponent implements OnInit, OnChanges {

  consultationModePage$: BehaviorSubject<boolean>;

  @Input() person: PersonVO;

  @Output() changeRelationalForm = new EventEmitter<PersonVO>();
  @Output() changeDirtyRelationalForm = new EventEmitter<boolean>();

  typeCustomer: string;

  constructor(private readonly profilContractService: ProfilContractService, private readonly route: ActivatedRoute) {
    this.getTypeCustomer();
  }

  ngOnChanges(_changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.consultationModePage$ = this.profilContractService.getConsultationModePage();
  }

  getTypeCustomer(): void {
    this.route.queryParamMap.subscribe(data => this.typeCustomer = data.get('typeCustomer'));
  }

  onUpdateModeofRelational(mode: boolean): void {
    this.profilContractService.updateConsultationModePage(mode);
  }

  onChangeRelationalForm(newPerson: PersonVO): void {
    this.changeRelationalForm.emit(newPerson);
  }

  onChangeDirtyRelationalForm(val: boolean): void {
    this.changeDirtyRelationalForm.emit(val);
  }

}
