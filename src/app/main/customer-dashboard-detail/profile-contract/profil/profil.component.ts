import { PersonVO } from './../../../../_core/models/models.d';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProfilContractService } from '../profil-contract.service';
import { ActivatedRoute } from '@angular/router';

export interface User {
  name: string;
}

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  consultationModePage$: BehaviorSubject<boolean>;

  @Input() person;
  @Output() changeProfilForm = new EventEmitter<PersonVO>();

  @Output() changeDirtyProfilForm = new EventEmitter<boolean>();

  typeCustomer: string;
  @Input()
  photo: string;

  @Input()
  isSelected : boolean;

  constructor(private readonly profilContractService: ProfilContractService,
    private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.consultationModePage$ = this.profilContractService.getConsultationModePage();
    this.getTypeCustomer();
  }

  onUpdateProfil(mode: boolean): void {
    this.profilContractService.updateConsultationModePage(mode);
  }

  loadImageProfil(): string {
    return 'assets/images/customer-dashboard/profile-avatar.png';
  }

  getTypeCustomer(): void {
    this.route.queryParamMap.subscribe(data => this.typeCustomer = data.get('typeCustomer'));
  }

  onChangeProfilForm(event){
    this.changeProfilForm.emit(event);
  }

  onChangeDirtyProfilForm(event): void {
    this.changeDirtyProfilForm.emit(event);
  }


  
}
