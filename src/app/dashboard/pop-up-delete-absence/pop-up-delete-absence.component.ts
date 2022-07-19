import { RequestChangeAbsenceStatusVO } from './../../_core/models/RequestChangeAbsenceStatusVO';
import { AuthTokenService } from './../../_core/services/auth_token';
import { NotificationService } from './../../_core/services/notification.service';
import { AbsenceService } from './../../_core/services/absence.service';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pop-up-delete-absence',
  templateUrl: './pop-up-delete-absence.component.html',
  styleUrls: ['./pop-up-delete-absence.component.scss']
})
export class PopUpDeleteAbsenceComponent implements OnInit{

  absenceId;
  fullName;
  startDate;
  endDate;
  connectedUserId;
  constructor(readonly activeModal: NgbActiveModal,
              private readonly route: Router,
              readonly location: Location,
              private readonly changeStatusNotificationService:NotificationService,
              private readonly absenceService:AbsenceService,
              private readonly authToken:AuthTokenService) { }

  ngOnInit() {
    this.connectedUserId = this.authToken.applicationUser.coachId;
  }

  deleteAbsence(){
    const changeAbsenceStatusRequest = {} as RequestChangeAbsenceStatusVO;
    changeAbsenceStatusRequest.absenceId = this.absenceId;
    changeAbsenceStatusRequest.connectedUserId = this.connectedUserId;
    this.absenceService.changeAbsenceStatus(changeAbsenceStatusRequest).subscribe(
      (deleted: boolean)=>this.changeStatusNotificationService.absenceDeleted(deleted)
    );
    this.activeModal.close(true);
  }

  destroy() {
    this.activeModal.close(true);
    this.route.navigateByUrl('/absence-monitoring');
  }

}
