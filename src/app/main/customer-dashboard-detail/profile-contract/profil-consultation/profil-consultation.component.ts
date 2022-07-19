import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from './../../../../_core/utils/string-utils';
import { CustomerCivilityService } from '../customer-civility.service';

@Component({
  selector: 'app-profil-consultation',
  templateUrl: './profil-consultation.component.html',
  styleUrls: ['./profil-consultation.component.scss']
})
export class ProfilConsultationComponent implements OnInit, OnChanges {

  @Output() updateProfil = new EventEmitter<boolean>(null);
  @Input() person;
  fullCustomer: any;
  customerId: string;
  birthdate: any;
  civility: string;

  @Input()
  photo: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly datePipe: DatePipe,
    private readonly customerCivilityService: CustomerCivilityService
    ){}

  onUpdateProfil(): void {
    this.updateProfil.emit(false);
  }

  ngOnChanges(change: SimpleChanges){
    if(change['person'] && this.person){
      this.getCustomerFull();
    }
  }

  ngOnInit(){
  }

  getCustomerFull(): void {
    if(!isNullOrUndefined(this.person.birthdate)) {
      const newDate = this.person.birthdate.toString();
      this.birthdate = this.datePipe.transform(newDate,'dd/MM/yyyy');
    }
    this.civility = this.customerCivilityService.getPersonTitle(this.person.title);
  }

  loadImageProfil(): string {
    return 'assets/images/customer-dashboard/profile-avatar.png';
  }

  

}
