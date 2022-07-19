import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';

import { TaskVo, UserVo } from '../../../_core/models';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { RequestAnswersVO } from '../../../_core/models/models';
import { RedirectionService } from '../../../_core/services/redirection.service';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';

@Component({
  selector: 'app-task-assignment',
  templateUrl: './task-assignment.component.html',
  styleUrls: ['./task-assignment.component.scss'],
  providers: [DatePipe]
})
export class AssignmentTaskComponent extends ComponentCanDeactivate implements OnInit, OnDestroy {
  
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
  toNextTasks = false;

  constructor(private readonly route: ActivatedRoute, private readonly redirectionService: RedirectionService) {
    super();
  }

  ngOnInit(): void {

    this.nextIdTask = Number(this.route.snapshot.queryParamMap.get('nextIdTask'));    
    this.route.parent.paramMap.subscribe(params => {
      this.customerId =params.get('customerId'); 
    }); 
    this.processInstanceId = this.route.snapshot.queryParamMap.get('processInstanceId');
    this.route.data.subscribe(resolversData => { 
      this.detailRequest = resolversData['detailRequest'];
      this.users = resolversData['users'];
      this.requestAnswers = resolversData['requestAnswers'];
      this.task = resolversData['currentTask'];
    });
    this.thetisTaskId = this.route.snapshot.queryParamMap.get('thetisTaskId');
  }

  onFormGroupChange( form: FormGroup): void {
    this.form = form;
    this.form.markAsDirty();
  }

  onSubmittedChange( submitted: boolean): void {
    this.submitted = submitted;
  }

  onCanceledChange( canceled: boolean): void {
    console.log(canceled)
    this.canceled = canceled;
  }

  onToAffectChange(toAffect: boolean): void {
   this.toAffect = toAffect;
  }
  
  onToclosurRequestChange(toClose: boolean): void {
    if(toClose=== false ){
    this.toNextTasks = true
    this.initializeTextCancelPopUp();
    this.redirectionService.setAllowSwitchingRole(false);
    }else{
      this.toNextTasks= false;
    }
   this.toClosurRequest = toClose;
  }

  onLoadingChange(load: boolean): void {
    this.loading = load;
  }

  initializeTextCancelPopUp(): void {
    this.message = `<strong class="athena">ATTENTION</strong> <br/> Quitter cette page sans finaliser l'affectation 
    des tâches entraînera la fin du parcours. Merci de terminer l'affectation des tâches suivantes.`;
    this.btnOkText = 'Quitter la page';
    this.btnCancelText = 'Rester sur la page';
  }

  ngOnDestroy(): void {
    this.redirectionService.setAllowSwitchingRole(true);
  }

}
