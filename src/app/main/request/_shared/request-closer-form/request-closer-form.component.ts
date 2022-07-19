import { getEncryptedValue } from 'src/app/_core/utils/functions-utils';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RequestVO } from '../../../../_core/models/request/crud/request';
import { RequestService } from '../../../../_core/services/request.service';
import { RequestTypeVO } from '../../../../_core/models/models';
import { RequestCustomerVO } from '../../../../_core/models/request-customer-vo';
const URL_PATERN = '/customer-dashboard';

@Component({
  selector: 'app-request-closer-form',
  templateUrl: './request-closer-form.component.html',
  styleUrls: ['./request-closer-form.component.scss']
})
/**
 * @author YOUNESS FATHI
 */
export class RequestCloserFormComponent implements OnInit {
  @Input() customerId;
  @Input() requestDescription: RequestCustomerVO = {} as RequestCustomerVO;
  @Input() requestId: number;
  @Input() isClosureTask = false;
  @Input() closerOutsideProcess = false; 
  @Input() clotureFromPencel = false;
  @Input() request: RequestVO = {} as RequestVO;
  @Output() onFormGroupChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() onCanceledChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onSubmittedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  closedRequestId: number;
  form: FormGroup;
  submitted: boolean;
  defaultMinute = 3;
  requestType: RequestTypeVO;
  realEndHour: number;
  RealEndMinute: number;
  RealEndHours = [];
  RealEndMinutes = [];
  defaultRealEndHours: number;
  defaultRealEndMinute: number;
  requestClosure: FormGroup;
  invalidResolution = false;
  isValid = true;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly fb: FormBuilder,
    private readonly requestService: RequestService
  ) {
  }

  ngOnInit(): void {
    if ( !this.requestId || !this.customerId) {
      this.requestId = Number(this.route.snapshot.paramMap.get('idRequest'));
      this.route.root.firstChild.firstChild.paramMap.subscribe( (params: ParamMap) => {
        this.customerId = params.get('customerId');
      });
    } 
    this.setIdRequestForUpdateStatus(this.requestId);
    this.createForm();
    this.initHourParams();
    this.initMinuteParams();
   
  }
  setIdRequestForUpdateStatus(id: number): any {
    if (this.requestId !== 0) {
      this.request.id = this.requestId;
    }
  }
  /**
   * THE ROLE OF THIS FUNCTION IS MINUTE INITIALIZATION
   * @author YOUNESS FATHI
   */
  initMinuteParams(): any {
    this.RealEndMinute = new Date().getMinutes();
    this.defaultRealEndMinute = this.RealEndMinute;
  }
  /**
   * @ROLE :OF THIS FUNCTION IS HOUR INITIALIZATION
   * @author YOUNESS FATHI
   */
  initHourParams(): any {
    this.realEndHour = new Date().getHours();
    this.defaultRealEndHours = this.realEndHour;
  }

  createForm(): void {
    this.requestClosure = this.fb.group({
      echeanceDate: this.fb.control({ value: new Date(), disabled: true }),
      resolution: this.fb.control(null),
      comment: this.fb.control('')
    });
  }

  onChangeTimeRealEnd(time: string): void {
    this.realEndHour = Number(time.substring(0, 2));
    this.RealEndMinute = Number(time.substring(4, 7));
  }

  /**
   * @ROLE : detecte change on resolution select
   * @author YOUNESS FATHI
   */
  onChangeResolutionValue(): void {
    if (this.requestClosure.value.resolution !== '') {
      this.invalidResolution = false;
      this.isValid = true;
    } else {
      this.invalidResolution = true;
      this.isValid = false;
    }
    
  }
  /**
   * @ROLE : SEND CLOSURE DATA TO SERVICE BACK END
   * @author YOUNESS FATHI
   */
  onCloseImmediately(): void {

    this.submittedChange(true);
    this.prepareClosureRequest();
    if (!this.invalidResolution) {
      this.requestService
        .clotureRequest(this.request)
        .subscribe(data => {
          this.closedRequestId = data.id;
          this.goToTaskList();
          this.formGroupChange(this.requestClosure);
          this.cancelCreation(false);
        });
    }

    this.isValid = false;
  }
  /**
   * @ROLE : construct the closure request
   * @author YOUNESS FATHI
   */
  prepareClosureRequest(): void {
    const realEndDate = this.requestClosure.get('echeanceDate').value;
    this.setRealEndDateOfClotureRequest(realEndDate);
    this.request.closureComment = this.requestClosure.value.comment;
    const resolution = this.requestClosure.value.resolution;
    if (resolution === null) { 
      this.invalidResolution = true; 
    } else { this.request.conclusionType = resolution; }
    this.request.customerId = Number(getEncryptedValue(this.customerId));
  }

  /**
   * @ROLE : set real date in requestDescription
   * @author YOUNESS FATHI
   */
  setRealEndDateOfClotureRequest(realEndDate: Date): void {
    const datePattern = 'dd/MM/yyyy HH:mm';
    this.request.realEndDate = new Date(
        realEndDate.getFullYear(),
        realEndDate.getMonth(),
        realEndDate.getDate(),
        this.realEndHour,
        this.RealEndMinute
    );
    this.request.realEndDateAsString = this.datePipe.transform(this.request.realEndDate, datePattern);
  }

  goToTaskList(): void {
    if (this.isClosureTask) {
      this.router.navigate(
        [
          URL_PATERN,
          this.customerId,
          'detail',
          'request',
          this.requestId
        ],
        { queryParamsHandling: 'merge' }
      );
    } else {
     
      this.router.navigate(
        [URL_PATERN, this.customerId, 'detail', 'request', this.closedRequestId],
        { queryParamsHandling: 'merge' }
      );
    }
  }

  annuler(): void {
    this.onCanceledChange.emit(true);
    if (this.isClosureTask ) {
      this.router.navigate(
        [
          URL_PATERN,
          this.customerId,
          'detail',
          'request',
          this.requestId
        ],
        { queryParamsHandling: 'merge' }
      );
    } else {
      this.router.navigate(
        [URL_PATERN, this.customerId, 'request', 'parcours'],
        { queryParamsHandling: 'merge' }
      );
    }
  }

  /**
   * @ROLE : log
   * @author YOUNESS FATHI
   */
  log(message: string, params: any): void {
    console.log(message, params);
  }

  formGroupChange(form: FormGroup): void {
    this.onFormGroupChange.emit(form);
  }

  cancelCreation(canceled: boolean): void {
    this.onCanceledChange.emit(canceled);
  }

  submittedChange(submitted: boolean): void {
    this.onSubmittedChange.emit(true);
  }

}
