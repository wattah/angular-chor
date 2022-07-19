import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GassiMockLoginService } from '../../../_core/services';
import { PersonNoteVo } from '../../../_core/models/person-note';
import { PersonNoteService } from '../../../_core/services/person-note.service';
import { getCustomerIdFromURL } from '../../customer-dashboard/customer-dashboard-utils';

@Component({
  selector: 'app-good-to-know-modification',
  templateUrl: './good-to-know-modification.component.html',
  styleUrls: ['./good-to-know-modification.component.scss']
})
export class GoodToKnowModificationComponent implements OnInit {

  customerId: string;
  personIdNote: number;
  goodToKhow: PersonNoteVo;
  value: string;
  typeCustomer: string ;
  currentUserId: number ;
  valueInfoChanged = false ;

  constructor(readonly  route: ActivatedRoute, 
    readonly  router: Router, 
    private readonly mockLoginService: GassiMockLoginService,
    readonly  personNoteService: PersonNoteService) { }

  ngOnInit(): void {
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.customerId = getCustomerIdFromURL(this.route);
    this.personIdNote = Number(this.route.snapshot.paramMap.get('personIdNote'));

      this.personNoteService.getGoodToKnow(this.customerId).subscribe(data => {
        if (data !== null) {
          this.value = data.value;
          
        } 
      });

    this.getCurrentUser() ;
    
  }

  isValueChanged(): void{
    this.valueInfoChanged = true ;
  }

  enregistrer(): void {
    if(this.valueInfoChanged){
    if (!isNaN(this.personIdNote)) {
      this.personNoteService.updateInfoNoteGoodToKhow(this.personIdNote, this.value, this.currentUserId).subscribe(data => {
      });  
    } else {
      this.personNoteService.saveInfoNoteGoodToKhow(this.customerId, this.value, this.currentUserId).subscribe(data => {
      });
    } 
  } 
  }

  getCurrentUser(): void {
    this.mockLoginService.getCurrentUserId().subscribe((userId) => {
      this.currentUserId = userId;
    });
  }


}
