import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ComponentCanDeactivate } from 'src/app/_core/guards/component-can-deactivate';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TaskVo, RequestAnswersVO } from '../../../_core/models';
import { UserVO } from '../../../_core/models/models';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.scss'],
  providers: [DatePipe]
})
export class UpdateTaskComponent extends ComponentCanDeactivate implements OnInit {
  
  task: TaskVo;
  users: UserVO[];
  customerId: string;
  form: FormGroup;
  submitted: boolean;
  detailRequest: RequestCustomerVO;
  requestAnswers: RequestAnswersVO[];

  constructor(private route: ActivatedRoute, private modalService: NgbModal) { super(); }

  ngOnInit(): void {
    this.route.data.subscribe(resolversData => {
      this.task = resolversData['currentTask'];
      this.users = resolversData['users'];
      this.detailRequest = resolversData['detailRequest'];
      this.requestAnswers = resolversData['requestAnswers'];
    });
    this.route.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId'); 
    }); 
  }

  onFormGroupChange( form: FormGroup): void {
    this.form = form;
  }

  onSubmittedChange( submitted: boolean): void {
    this.submitted = submitted;
  }

  onCanceledChange( canceled: boolean): void {
    this.canceled = canceled;
  }

}
