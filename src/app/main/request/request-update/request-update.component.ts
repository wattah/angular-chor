import { getDecryptedValue } from 'src/app/_core/utils/functions-utils';
import { Component, OnInit } from '@angular/core';
import { RequestCustomerVO } from 'src/app/_core/models/request-customer-vo';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';

import { UserVo } from '../../../_core/models';
import { RequestVO } from '../../../_core/models/request/crud/request';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { RequestDetailsService } from '../../../_core/services/request-details.service';
import { RequestService } from 'src/app/_core/services/request.service';
import { LIST_UPDATED_OF_WORKFLOW_WITH_CART } from '../../../_core/constants/constants';

@Component({
  selector: 'app-request-update',
  templateUrl: './request-update.component.html',
  styleUrls: ['./request-update.component.scss']
})
export class RequestUpdateComponent extends ComponentCanDeactivate implements OnInit {

    /**
     * debut declaration variable
     */

  currentRequest: RequestVO;
  users: UserVo[];
  idPorteur: number;
  idRespCom: number;
  idRespAffaire: number;
  startDate: Date;
  form: FormGroup;
  submitted: boolean;
  requestUpdateForm: FormGroup;
  hourRequest: number;
  minuteRequest: number; 
  request: RequestVO;
  idRequest: number;
  customerId: string;
  customerIdNumber : number;

  fromRequestMonitoring = false;
  commercialAndBusinessAccountsRequired = false;

  /**
   * fin declaration
   */

/**
 * construct 
 * @param route 
 */

  constructor(private route: ActivatedRoute, private datePipe: DatePipe, private fb: FormBuilder,
     private requestService: RequestService, private router: Router) {
    super();
    this.requestUpdateForm = this.createFormGroup();
  }
    
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idRequest = Number.parseInt(params.get('idRequest'), 10);      
    });
  
    this.route.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
      this.customerIdNumber = getDecryptedValue(this.customerId);
    });

    if (this.route.snapshot.queryParamMap.get('fromMonitoring'))  {
      this.fromRequestMonitoring = true;
    }

    this.route.data.subscribe(resolversData => {
      this.currentRequest = resolversData['currentRequest'];
      if ( this.currentRequest) {
        this.startDate = new Date(this.datePipe.transform(this.currentRequest.createdAt, 'yyyy-MM-dd'));
        this.idPorteur = this.currentRequest.attachedUserId;
        this.idRespCom = this.currentRequest.salesReprentatifId;
        this.idRespAffaire = this.currentRequest.accountManagerUserId;
        this.hourRequest = new Date(this.currentRequest.createdAt).getHours();
        this.minuteRequest = new Date(this.currentRequest.createdAt).getMinutes();
        this.checkIfCommercialAndBusinessAccountsMustBeMondatory();
      }
      this.users = resolversData['users'];
    });

    this.onFormGroupChange(this.requestUpdateForm);
    this.onSubmittedChange(false);
    this.onCanceledChange(false);    
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      startDate: this.fb.control(''),
      porteur: this.fb.control(''),
      commercial: this.commercialAndBusinessAccountsRequired ? this.fb.control('',[Validators.required]) : this.fb.control('') ,
      affaire: this.commercialAndBusinessAccountsRequired ? this.fb.control('',[Validators.required]) : this.fb.control(''),
      description: this.fb.control('')

    });
  }

  checkIfCommercialAndBusinessAccountsMustBeMondatory(){
    if(LIST_UPDATED_OF_WORKFLOW_WITH_CART.includes(this.currentRequest.requestTypeLabel)){
      this.commercialAndBusinessAccountsRequired = true;
    }
  }

  updateRequest(): void {
    if (this.requestUpdateForm.valid) {
      const datePattern = 'dd/MM/yyyy HH:mm';
      const dateDebut = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), 
      this.startDate.getDate(), this.hourRequest, this.minuteRequest );
      const dateModif = new Date();
      this.currentRequest.modifiedAt = new Date(dateModif.getFullYear(), dateModif.getMonth(),
       dateModif.getDate(), dateModif.getHours(), dateModif.getMinutes(), dateModif.getSeconds() );
       this.currentRequest.modifiedAtAsString = this.datePipe.transform(this.currentRequest.modifiedAt , datePattern);
       this.currentRequest.creationDateAsString =  this.datePipe.transform(dateDebut , datePattern);
       console.log(this.currentRequest.modifiedAt)
       console.log(dateDebut)
      this.currentRequest.createdAt = dateDebut;
      this.currentRequest.customerId = this.customerIdNumber;
      this.requestService.updateRequest(this.currentRequest).subscribe(() => {
        this.goToTaskList();
        this.onSubmittedChange(true);
      });
    }
  }

  goToTaskList(): void {
    this.onSubmittedChange(true);
    if (this.fromRequestMonitoring) {
      this.router.navigate(
        ['/request-monitoring']
      );
    } else {
      this.router.navigate(
      ['/customer-dashboard', this.customerId, 'detail', 'request', this.idRequest],
      { queryParamsHandling: 'merge' }
    );
    }
  }

  routerAfterCanceling(): string {
    let routeCanceling = '';
    if (this.fromRequestMonitoring) {
      routeCanceling = '/request-monitoring'; 
    } else {
      routeCanceling = `/customer-dashboard/${this.customerId}/detail/request/${this.idRequest}`;
    }
    return routeCanceling;
  }

  onChangeTimeStart( time: string): void {
    this.hourRequest = Number(time.substring(0, 2));
    this.minuteRequest = Number(time.substring(4, 7));
  }

  onSubmittedChange( submitted: boolean): void {
    this.submitted = submitted;
  }

  onCanceledChange( canceled: boolean): void {
    this.canceled = canceled;
  }

  onFormGroupChange( form: FormGroup): void {
    this.form = form;
  }

}
