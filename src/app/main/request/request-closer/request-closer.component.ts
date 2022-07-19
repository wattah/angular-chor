
import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { RequestAnswersVO } from '../../../_core/models/models';

import { WorkflowService } from '../../../_core/services/workflow.service';

import { TaskVo, UserVo } from '../../../_core/models';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';

@Component({
  selector: 'app-request-closer',
  templateUrl: './request-closer.component.html',
  styleUrls: ['./request-closer.component.scss'],
  providers: [DatePipe]
})

export class RequestCloserComponent extends ComponentCanDeactivate implements OnInit {

  form: FormGroup;
  submitted: boolean;
  customerId: string;
  task: TaskVo;
  detailRequest: RequestCustomerVO;
  requestAnswers: RequestAnswersVO[];
  processInstanceId: string;
  thetisTaskId: string;
  toAffect = false;
  toClosurRequest = false;
  nextIdTask = 0;
  users: UserVo;
  loading: boolean;
  closerOutsideProcess = false;
  @Input() idRequest: number;

  constructor(private readonly route: ActivatedRoute, private readonly workflowService: WorkflowService,
    private readonly router: Router) {super(); }

  ngOnInit(): void {
    this.closerOutsideProcess = Boolean(this.route.snapshot.data['closerOutsideProcess']);
    this.route.data.subscribe(resolversData => {
      this.task = resolversData['currentTask'];
      this.detailRequest = resolversData['detailRequest'];
      this.requestAnswers = resolversData['requestAnswers'];
      this.users = resolversData['users'];
    });
    this.route.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId'); 
    }); 
    this.processInstanceId = this.route.snapshot.queryParamMap.get('processInstanceId');
    this.thetisTaskId = this.route.snapshot.queryParamMap.get('thetisTaskId');
    this.nextIdTask = Number(this.route.snapshot.queryParamMap.get('nextIdTask'));
  }

  onFormGroupChangef( form: FormGroup): void {
    this.form = form;
  }

  onTaskCreated( submitted: boolean): void {
    this.submitted = submitted;
  }

  onCanceledChangef( canceled: boolean): void {
    this.canceled = canceled;
  }

  onToAffectChange(toAffect: boolean): void {
    this.toAffect = toAffect;
  }
  
  onToclosurRequestChange(toClose: boolean): void {
  this.toClosurRequest = toClose;
  }

  onLoadingChange(load: boolean): void {
    this.loading = load;
  }

  doSomethingBeforeLeavePage (): void {}

}
