import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PersonVO } from '../../../../_core/models/person-vo';
import { ProfilContractService } from '../profil-contract.service';

@Component({
  selector: 'app-profil-entreprise',
  templateUrl: './profil-entreprise.component.html',
  styleUrls: ['./profil-entreprise.component.scss']
})
export class ProfilEntrepriseComponent implements OnInit {

  consultationModePage$: BehaviorSubject<boolean>;
  @Input() person;
  @Output() changeProfilEntrepriseForm = new EventEmitter<PersonVO>();
  @Output() changeDirtyProfilEntrepriseForm = new EventEmitter<boolean>();
  @Input() photo: string;
  @Input() isSelected: boolean;

  constructor(private readonly profilContractService: ProfilContractService) { }

  ngOnInit(): void {
    this.consultationModePage$ = this.profilContractService.getConsultationModePage();
  }

  onUpdateProfilEntreprise(mode: boolean): void {
    this.profilContractService.updateConsultationModePage(mode);
  }

  onChangeProfilEntrepriseForm(event) {
    this.changeProfilEntrepriseForm.emit(event);
  }

  onChangeDirtyProfilEntrepriseForm(event): void {
    this.changeDirtyProfilEntrepriseForm.emit(event);
  }
}
