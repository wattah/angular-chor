import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-profil-entreprise-consultation',
  templateUrl: './profil-entreprise-consultation.component.html',
  styleUrls: ['./profil-entreprise-consultation.component.scss']
})
export class ProfilEntrepriseConsultationComponent implements OnInit {

  @Output() updateProfilEntreprise = new EventEmitter<boolean>(null);
  @Input() person;
  @Input() photo: string;

  constructor() { }

  ngOnInit() {
  }
  
  onUpdateProfilEntreprise(): void {
    this.updateProfilEntreprise.emit(false);
  }

  loadImageProfil(): string {
    return 'assets/images/customer-dashboard/avatar-entreprise.svg';
  }
}
