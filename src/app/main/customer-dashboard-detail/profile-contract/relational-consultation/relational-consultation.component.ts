import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PersonVO } from '../../../../_core/models/person-vo'; 
import { ProfilContractService } from '../profil-contract.service';

@Component({
  selector: 'app-relational-consultation',
  templateUrl: './relational-consultation.component.html',
  styleUrls: ['./relational-consultation.component.scss']
})
export class RelationalConsultationComponent {

  @Input() person: PersonVO;

  @Input() typeCustomer: string;

  @Output() updateRelational = new EventEmitter<boolean>(null);

  constructor(private readonly profilContractService: ProfilContractService, private readonly route: ActivatedRoute) {}

  onUpdateRelational(): void {
    this.updateRelational.emit(false);
  }

  formatLabel(value: string, type: string): string {
    return this.profilContractService.formatLabel(value, type) ;
  }

  formattedLabelPotentielCooptation(ordinal: number): string {      
    return this.profilContractService.formattedLabelPotentielCooptation(ordinal);
  }

}
