import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReferenceData } from 'src/app/_core/models/reference-data';

import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { UserVO } from '../../../_core/models/models';
import { RequestAnswersVO } from '../../../_core/models/request-answers-vo';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { CustomerInteractionVO } from '../../../_core/models/request/crud/customer-interaction';
import { RequestVO } from '../../../_core/models/request/crud/request';

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.scss']
})
export class TaskCreationComponent extends ComponentCanDeactivate implements OnInit {

  detailRequest: RequestCustomerVO;
  requestAnswers: RequestAnswersVO[];
  users: UserVO[];
  referenceDataList: ReferenceData[];
  customerId: string;
  form: FormGroup;
  submitted: boolean;
  notOnWfCreation: boolean;

  @Input()
  wfusersList: UserVO[];
  @Input()
  wfRequest:  RequestVO;
  @Input()
  wfCustomerInteraction: CustomerInteractionVO;
  @Input()
  wfReferenceDataList: ReferenceData[];
  
  @Input()
  hasNotInteraction = false;
  @Input() precision : boolean;
  @Input() isCreationRequest = false;

  @Output() onFormGroupChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() onSubmittedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCanceledChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private route: ActivatedRoute, private modalService: NgbModal) { super(); }

  ngOnInit(): void {
    this.notOnWfCreation = Boolean(this.route.snapshot.data['notOnWfCreation']);
    this.route.data.subscribe(resolversData => {
      this.detailRequest = resolversData['detailRequest'];
      this.requestAnswers = resolversData['requestAnswers'];
      this.users = resolversData['users'];
      if (!this.users && this.wfusersList) {
        this.users = this.wfusersList;
      }
      
      this.referenceDataList = resolversData['referenceDataList'];

      if(!this.referenceDataList && this.wfReferenceDataList){
        this.referenceDataList = this.wfReferenceDataList;
      }
    });
    this.route.parent.paramMap.subscribe(params => {
      this.customerId =params.get('customerId'); 
    }); 
  }

  onFormGroupChangeEvent( form: FormGroup): void {
    this.form = form;
    this.onFormGroupChange.emit(this.form);
  }

  onSubmittedChangeEvent( submitted: boolean): void {
    this.submitted = submitted;
    this.onSubmittedChange.emit(this.submitted);
  }

  onCanceledChangeEvent( canceled: boolean): void {
    this.canceled = canceled;
    this.onCanceledChange.emit(this.canceled);
  }

}
