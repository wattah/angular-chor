import { getDecryptedValue } from 'src/app/_core/utils/functions-utils';
import { RequestVO } from 'src/app/_core/models/request/crud/request';
import { ComponentCanDeactivate } from 'src/app/_core/guards/component-can-deactivate';
import { RequestService } from 'src/app/_core/services/request.service';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { Person } from '../../../_core/models/person';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RequestTypeVO, ReferenceDataVO } from '../../../_core/models/models';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router ,ParamMap} from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-request-immediate-closure',
  templateUrl: './request-immediate-closure.component.html',
  styleUrls: ['./request-immediate-closure.component.scss']
})
/**
 * @author YOUNESS FATHI
 */
export class RequestImmediateClosureComponent implements OnInit {
  @Input() customerId;
  @Input() requestDescription: RequestCustomerVO = {} as RequestCustomerVO;
  @Input() requestId: number;
  @Input() isClosureTask = false;
  @Input() request: RequestVO = {} as RequestVO;
  @Output() onFormGroupChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() onCanceledChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onSubmittedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  closedRequestId: number;
  form: FormGroup;
  submitted: boolean;
  defaultMinute: number = 3;
  requestType: RequestTypeVO;
  realEndHour: number;
  RealEndMinute: number;
  RealEndHours = [];
  RealEndMinutes = [];
  defaultRealEndHours: number;
  defaultRealEndMinute: number;
  requestClosure: FormGroup;
  invalidResolution: boolean = false;
  isValid: boolean = true;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private requestService: RequestService
  ) {
  }

  ngOnInit() {
    this.setIdRequestForUpdateStatus(this.requestId);
    this.createForm();
    this.initHourParams();
    this.initMinuteParams();
   
  }

  setIdRequestForUpdateStatus(id: number) {
    if (this.requestId !== 0) {
      this.request.id = this.requestId;
    }
  }
  /**
   * THE ROLE OF THIS FUNCTION IS MINUTE INITIALIZATION
   * @author YOUNESS FATHI
   */
  public initMinuteParams() {
    this.RealEndMinute = new Date().getMinutes();
    this.defaultRealEndMinute = this.RealEndMinute;
  }
  /**
   * @ROLE :OF THIS FUNCTION IS HOUR INITIALIZATION
   * @author YOUNESS FATHI
   */
  public initHourParams() {
    this.realEndHour = new Date().getHours();
    this.defaultRealEndHours = this.realEndHour;
  }

  public createForm(): void {
    this.requestClosure = this.fb.group({
      echeanceDate: this.fb.control({ value: new Date(), disabled: true }),
      resolution: this.fb.control(null),
      comment: this.fb.control('')
    });
  }

  public onChangeTimeRealEnd(time: string): void {
    this.realEndHour = Number(time.substring(0, 2));
    this.RealEndMinute = Number(time.substring(4, 7));
  }

  /**
   * @ROLE : detecte change on resolution select
   * @author YOUNESS FATHI
   */
  onChangeResolutionValue() {
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
  public onCloseImmediately(): void {

    this.submittedChange(true);
    this.prepareClosureRequest();
    if (!this.invalidResolution)
      this.requestService
        .clotureRequest(this.request)
        .subscribe(data => {
          this.closedRequestId = data.id;
          this.goToTaskList();
          this.formGroupChange(this.requestClosure);
          this.cancelCreation(false);
        });

        this.isValid = false;
  }
  /**
   * @ROLE : construct the closure request
   * @author YOUNESS FATHI
   */
  public prepareClosureRequest(): void {
    const realEndDate = this.requestClosure.get('echeanceDate').value;
    this.setRealEndDateOfClotureRequest(realEndDate);
    this.request.closureComment = this.requestClosure.value.comment;
    let resolution = this.requestClosure.value.resolution;
    if (resolution == null) this.invalidResolution = true;
    else this.request.conclusionType = resolution;
    this.request.customerId = getDecryptedValue(this.customerId);
  }

  /**
   * @ROLE : set real date in requestDescription
   * @author YOUNESS FATHI
   */
  public setRealEndDateOfClotureRequest(realEndDate: Date) {
    const datePattern = 'dd/MM/yyyy HH:mm'
    this.request.realEndDate = new Date(
        realEndDate.getFullYear(),
        realEndDate.getMonth(),
        realEndDate.getDate(),
        this.realEndHour,
        this.RealEndMinute
    );
    this.request.realEndDateAsString = this.datePipe.transform(this.request.realEndDate, datePattern)
  }

  goToTaskList(): void {
    if (this.isClosureTask) {
      this.router.navigate(
        [
          '/customer-dashboard',
          this.customerId,
          'detail',
          'request',
          this.requestId
        ],
        { queryParamsHandling: 'merge' }
      );
    } else {
     
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'detail', 'request', this.closedRequestId],
        { queryParamsHandling: 'merge' }
      );
    }
  }

  annuler(): void {
    this.onCanceledChange.emit(true);
    if (this.isClosureTask ) {
      this.router.navigate(
        [
          '/customer-dashboard',
          this.customerId,
          'detail',
          'request',
          this.requestId
        ],
        { queryParamsHandling: 'merge' }
      );
    } else {
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'request', 'parcours'],
        { queryParamsHandling: 'merge' }
      );
    }
  }

  /**
   * @ROLE : log
   * @author YOUNESS FATHI
   */
  public log(message: string, params: any) {
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
