
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { CustomerProfileVO } from '../../../../_core/models/customer-profile-vo';
import { CONSTANTS } from '../../../../_core/constants/constants';
import { capitalizeFirstLetter, getDefaultStringEmptyValue, isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { firstNameFormatter, fullNameFormatter } from '../../../../_core/utils/formatter-utils';
import { UserService } from '../../../../_core/services';
import { AbsenceLight } from '../../../../_core/models/absence-light';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-data-parnasse-consultation',
  templateUrl: './data-parnasse-consultation.component.html',
  styleUrls: ['./data-parnasse-consultation.component.scss']
})
export class DataParnasseConsultationComponent implements OnInit {

  @Input() typeCustomer: string;

  @Input() customerProfile: CustomerProfileVO;

  @Output() updateDataParnasse = new EventEmitter<boolean>(null);

  desk: string;

  backUpDesk$: Observable<AbsenceLight>; 

  coach: string;
  backUpCoach$: Observable<AbsenceLight>; 

  coachReferent: string;
  backUpCoachReferent$: Observable<AbsenceLight>; 
  formatterCreatedByAndCreationDate : string;

  constructor(readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly datePipe:DatePipe) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe( params => {
      this.typeCustomer = params.get('typeCustomer');
    });
    this.getDeskAndCoach();
    this.formatterNameCreatedAndDateCreated();
  }

  onUpdateDataParnasse(): void {
    this.updateDataParnasse.emit(false);
  }

  getDeskAndCoach(): void {
    this.customerProfile.customer.referents.forEach(element => {
      if (element.roleId === CONSTANTS.ROLE_DESK) {
        this.desk = fullNameFormatter(null , element.lastName , element.firstName);
        this.backUpDesk$ = this.getBackUpOfUser(element.userId);
      } 
      if (element.roleId === CONSTANTS.ROLE_COACH) {
        this.coach = fullNameFormatter(null , element.lastName , element.firstName);
        this.backUpCoach$ = this.getBackUpOfUser(element.userId);
      }
    });
    this.coachReferent = (!isNullOrUndefined(this.customerProfile.customer.coachRefName)) ? capitalizeFirstLetter(this.customerProfile.customer.coachRefName) : '-';
    this.backUpCoachReferent$ = this.getBackUpOfUser(this.customerProfile.customer.coachRefId);
  }

  buildName(word1: string, word2: string ): string {
    return getDefaultStringEmptyValue (fullNameFormatter(null, word1, word2));
  }

  getBackUpOfUser(idUser: number): Observable<AbsenceLight> {
    return this.userService.getUserBackup(idUser);
  }

  formatterNameCreatedAndDateCreated(): void {
    this.formatterCreatedByAndCreationDate = 'Fiche Athéna créée';
    if(!isNullOrUndefined(this.customerProfile) &&
       !isNullOrUndefined(this.customerProfile.customer) &&
       (!isNullOrUndefined(this.customerProfile.customer.creationDate) ||
       !isNullOrUndefined(this.customerProfile.customer.firstNameCreated) ||
       !isNullOrUndefined(this.customerProfile.customer.lastNameCreated))) {
       if(!isNullOrUndefined(this.customerProfile.customer.creationDate)) {
         this.formatterCreatedByAndCreationDate = `${this.formatterCreatedByAndCreationDate} le ${this.datePipe.transform(this.customerProfile.customer.creationDate , 'dd/MM/yyyy')}`;
      }
      if(!isNullOrUndefined(this.customerProfile.customer.firstNameCreated) || !isNullOrUndefined(this.customerProfile.customer.lastNameCreated)) {
        this.formatterCreatedByAndCreationDate = `${this.formatterCreatedByAndCreationDate} par ${firstNameFormatter(this.customerProfile.customer.firstNameCreated)} ${this.customerProfile.customer.lastNameCreated ? this.customerProfile.customer.lastNameCreated.toUpperCase() : ''}`;
      }
    } else {
      this.formatterCreatedByAndCreationDate = '';
    }
  }
}
