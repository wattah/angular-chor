import { Component, OnInit, Input, AfterContentChecked, ChangeDetectorRef, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { FormControl, ControlContainer, FormGroupDirective, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { isAfter } from 'date-fns';
import { isNullOrUndefined } from '../../../../../_core/utils/string-utils';
import { GassiMockLoginService } from '../../../../../_core/services/gassi-mock-login.service';
import { InterventionReportVO } from '../../../../../_core/models/cri/intervention-report-vo';
import { JOUR_FERIE } from '../../../../../_core/constants/constants';


@Component({
  selector: 'app-intervention',
  templateUrl: './intervention.component.html',
  styleUrls: ['./intervention.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class InterventionComponent implements OnInit, AfterContentChecked, OnChanges,AfterViewInit {

  @Input() interventionReport: InterventionReportVO;
  @Input() isFirstDayInput: boolean;
  @Input() tabchangedOrSave: boolean;
  @Input() onCheckSecondDay: boolean;
  @Input() allowedToModifyTechnicalInformationTab;
  isFirstDay;
  interventionForm: FormGroup;
  startTimeControl ="startTimeControl";
  endTimeControl ="endTimeControl";
  atCustomerStartControl ="atCustomerStartControl";
  atCustomerEndControl ="atCustomerEndControl";
  formGroupNameLabel ="interventionFirstDay";
  hno = "hno"
  isOnCallDuty = "isOnCallDuty";
  otherDuty = "otherDuty";
  astreinte = "astreinte";
  Autre = "Autre";
  publicHolidayControl = "publicHolidayControl";
  showTechBloc = false;
  showTechBloc2 = false;
  isHnoDisabled = false;
  checkAstreinte = false;
  checkPSE = false;
  isActifDate = false;
  /** Date début d'intervention  */
  startTime = null;
  hourStartDate = 0;
  rangeMaxStartDate : Date;
  rangeMinStartDate : Date;
  minuteStartDate = 0; 
  minHStart = 0;
  minMStart = 0;
  /** Date fin d'intervention  */
  endTime = null;
  hourEndDate = 0;
  minuteEndDate = 0;
  rangeMaxOfEndDate: Date;
  rangeMinOfEndDate: Date;
  minHEnd=0;
  minMEnd=0;
  /** Date d'arrivé chez le client  */
  atCustomerStartTime = null;
  hourAtCustomerStartDate = 0;
  minuteAtCustomerStartDate = 0
  rangeMinOfAtCustomerStartDate: Date;
  rangeMaxOfAtCustomerStartDate: Date;
  minHourAtCustStart = 0;
  minHAtCustS = 0;
  minMAtCustS = 0;
  /** Date départ de chez le client  */
  atCustomerEndTime = null;
  minuteAtCustomerEndDate = 0;
  myControl =  new FormControl();
  hourAtCustomerEndDate = 0;
  rangeMinOfAtCustomerEndDate: Date;
  rangeMaxOfAtCustomerEndDate: Date;
  minHAtCustEnd = 0;
  minMAtCustEnd = 0;
  currenteDate ;
  currentSecond;
  currentHour;
  currentMinute;
  /** pse date start */
  pseStart = null;
  rangeMinOfpseStart: Date;
  rangeMaxOfpseStart : Date;
  hourPseStart = 0;
  minutePseStart = 0;
  minHpseS = 0;
  minMpseS = 0;
   /** pse date End */
  pseEnd = null;
  rangeMinOfpseEnd : Date;
  rangeMaxOfpseEnd : Date ;
  hourPseEnd = 0;
  minutePseEnd = 0;
  minHpseEnd = 0;
  minMpseEnd = 0;
  isPseCheked = false;
  disablePse = true;
  onCreation = true;
  valideStartDate = true;
//vALIDATION
 dateDebutInterInvalid = false;
 dateFinIntervInvalid = false;
 dateDebut2InterInvalid = false;
 dateFin2IntervInvalid = false;
 dateDebutPseInvalid = false;
 dateFinPseInvalid = false;
 modaliteInvalid = false;
isFirstChange = false;
  isOnInit = false;
  initDone = false;
 datePattern = 'dd/MM/yyyy HH:mm'
 oncheckPse = false;
//================================Constructeur======================================
  constructor(private readonly datePipe: DatePipe, 
      private readonly route: ActivatedRoute,
      private readonly _formBuilder: FormBuilder,
      private readonly changeDRef: ChangeDetectorRef,
      public parentCRIForm: FormGroupDirective,
      private readonly mockLoginService: GassiMockLoginService) { 
        this.interventionForm  = new   FormGroup({});
      }
//====================================================================================
  ngAfterViewInit(): void {
    this.initDone = true;
  }
  
//================================ngOnChanges======================================
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['interventionReport'] && this.interventionReport){
      this.isFirstChange = false;
      if(changes['interventionReport'].isFirstChange){
        this.isFirstChange = true;
      }
      this.buildForm();
    }
    if(this.interventionForm && this.interventionForm.get("interventionFirstDay") && this.interventionForm.get("pseForm")){
      this.setRestrictions();
    } 
    if(changes['tabchangedOrSave']){
      this.initValidators();
      if(this.isFirstDayInput){
        this.validateFirstDayDates(this.interventionForm.controls.interventionFirstDay);
        this.validatePse(this.interventionForm.controls.pseForm);
      }
      else{
        if(!this.onCheckSecondDay &&
        this.interventionForm.controls.interventionSurDeuxJrs.value){
         this.validateSecondDayDates(this.interventionForm.controls.interventionSecondDay);
        }
        this.onCheckSecondDay  = false;
      }
    }
  }
  

  setRestrictions(){
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.interventionForm.get("interventionFirstDay").disable();
      if(this.interventionForm && this.interventionForm.get("interventionSecondDay")){
        this.interventionForm.get("interventionSecondDay").disable();
      }
      this.interventionForm.get("pseForm").disable();
    }else{
      this.interventionForm.get("interventionFirstDay").enable();
      if(this.interventionForm && this.interventionForm.get("interventionSecondDay")){
        this.interventionForm.get("interventionSecondDay").enable();
      }
      this.interventionForm.get("pseForm").enable();
    }
    
  }
//==========================================NG ON INIT===============================
  ngOnInit() {
  
    this.currenteDate = new Date();
    this.currentSecond =  this.currenteDate.getSeconds();
    this.currentMinute=  this.currenteDate.getMinutes();
    this.currentHour = this.currenteDate.getHours();
    if(!isNullOrUndefined(this.interventionReport.id)){
      this.onCreation = false;
    }
   this.buildForm();
   this.oncheckAstreint();
    this.setRestrictions();
    this.isOnInit = true;
    this.oncheckPse = true;
  }

  buildForm(){
    this.interventionForm = new   FormGroup({});
    this.interventionForm = this.parentCRIForm.form; 
    if(this.isFirstDayInput){
      this.initFormFirstDay();
      this.initDataFirstDay();
    }
    else{
      this.initFormSecondDay();
      this.initDataSecondDay();
    }
  }
  //======================================ngAfterContentChecked ================
  ngAfterContentChecked(): void {
    this.isFirstDay = this.isFirstDayInput;
   this.changeDRef.detectChanges();
  }
 //===============================on change form===============================
bindDataFirstDayToSave() {
  // bind Dates At String
  this.interventionReport.interventionStartTimeStr = !this.isInvalideDate(this.getDateStart()) ?
  this.datePipe.transform(this.getDateStart(), this.datePattern): null
  this.interventionReport.interventionEndTimeStr = !this.isInvalideDate(this.getDateEnd()) ?
  this.datePipe.transform(this.getDateEnd(), this.datePattern): null;
  this.interventionReport.atCustomerStartTimeStr= !this.isInvalideDate(this.getAtCustomerStartDate()) ?
  this.datePipe.transform(this.getAtCustomerStartDate(), this.datePattern) : null
  this.interventionReport.atCustomerEndTimeStr = !this.isInvalideDate(this.getAtCustomerEndDate()) ?
  this.datePipe.transform(this.getAtCustomerEndDate(), this.datePattern) : null;
  const startPse = (this.pseStart ? new Date(this.pseStart.setHours(this.hourPseStart,
    this.minutePseStart,this.currentSecond)) : null);
  const endPse = (this.pseEnd ? new Date(this.pseEnd.setHours(this.hourPseEnd,
    this.minutePseEnd,this.currentSecond)) : null)
  this.interventionReport.pseStartTimeStr = !this.isInvalideDate(startPse) ? this.datePipe.transform(startPse, this.datePattern): null;
  this.interventionReport.pseEndTimeStr =  !this.isInvalideDate(endPse) ? this.datePipe.transform(endPse, this.datePattern): null;
}
//================================================================================
isInvalideDate(date): boolean{
  return (!isNullOrUndefined(date) ? (date.toString() === 'Invalid Date') : false)
}
//===================================================================================
bindDataSecondDayToSave(){
 this.interventionReport.interventionStartTimeDay2Str = !this.isInvalideDate(this.getDateStart()) ?
  this.datePipe.transform(this.getDateStart(), this.datePattern): null;
  this.interventionReport.interventionEndTimeDay2Str = !this.isInvalideDate(this.getDateEnd()) ?
  this.datePipe.transform(this.getDateEnd(), this.datePattern): null;
  this.interventionReport.atCustomerStartTimeDay2Str= !this.isInvalideDate(this.getAtCustomerStartDate()) ?
  this.datePipe.transform(this.getAtCustomerStartDate(), this.datePattern) : null;
  this.interventionReport.atCustomerEndTimeDay2Str = !this.isInvalideDate(this.getAtCustomerEndDate()) ?
  this.datePipe.transform(this.getAtCustomerEndDate(), this.datePattern) : null;
}
 //==================================Form First Day=================================
  initFormFirstDay(){
     this.interventionForm.addControl('interventionFirstDay', new FormGroup({ 
      startTimeControl : this._formBuilder.control(null, Validators.required),
      endTimeControl: this._formBuilder.control(null, Validators.required),
      atCustomerStartControl : this._formBuilder.control(null),
      atCustomerEndControl : this._formBuilder.control(null),
      hno  : this._formBuilder.control(this.interventionReport.isHno),
      isOnCallDuty : this._formBuilder.control(this.interventionReport.isOnCallDuty ? 'astreinte':'Autre'), 
      publicHolidayControl : this._formBuilder.control(this.interventionReport.isPublicHoliday),
    }))
    this.interventionForm.addControl('pseForm', new FormGroup({ 
      pseStartControl: this._formBuilder.control(null),
      pseEndControl : this._formBuilder.control(null),
      pseckech : this._formBuilder.control(null),

    }))
   this.interventionForm.get('interventionFirstDay').get('hno').setValue(this.interventionReport.isHno);
    this.interventionForm.get('interventionFirstDay').get('isOnCallDuty').setValue(this.interventionReport.isOnCallDuty ? 'astreinte':'Autre');
    this.interventionForm.get('interventionFirstDay').get('publicHolidayControl').setValue(this.interventionReport.isPublicHoliday);
    this.initPse(this.interventionReport.pseStartTimeStr,this.interventionReport.pseEndTimeStr ); 
    this.initFormDates(this.interventionReport.interventionStartTimeStr,
      this.interventionReport.interventionEndTimeStr, 
      this.interventionReport.atCustomerStartTimeStr,
      this.interventionReport.atCustomerEndTimeStr);
  }
  //========================== init pse ==================================
  initPse(pseStartStr,pseEndStr ){
      this.pseStart =  pseStartStr ?new Date(pseStartStr.substring(0, 10)): null;   
      this.pseEnd =  pseEndStr ?new Date(pseEndStr.substring(0, 10)): null; 
      this.hourPseStart = pseStartStr ? pseStartStr.substring(11, 13) : 0;
      this.minutePseStart = pseStartStr ? pseStartStr.substring(14, 16) : 0;
      this.hourPseEnd = pseEndStr ? pseEndStr.substring(11, 13) : 0;
      this.minutePseEnd = pseEndStr ? pseEndStr.substring(14, 16) : 0;
      this.rangeMinOfpseStart = this.pseStart;
      this.rangeMaxOfpseStart = this.pseStart;
      this.rangeMinOfpseEnd= this.pseEnd;
      this.rangeMaxOfpseEnd = this.pseEnd;
  }
  //==================================Form Second Day=================================
 
  initFormSecondDay(){
    
    this.initControleSecondDay();
    this.interventionForm.addControl('interventionSecondDay', new FormGroup({ 
      startTimeDay2Control : this._formBuilder.control(null,[Validators.required]),
      endTimeDay2Control: this._formBuilder.control(null,[Validators.required]),
      atCustomerDay2StartControl : this._formBuilder.control(null),
      atCustomerDay2EndControl : this._formBuilder.control(null),
      hno2  : this._formBuilder.control(this.interventionReport.isHno2),
      isOnCallDuty2  : this._formBuilder.control(this.interventionReport.isOnCallDuty2 ? 'astreinte2':'Autre2'),
      publicHoliday2Control : this._formBuilder.control(this.interventionReport.isPublicHoliday2),
    }))
   
    this.initFormDates(this.interventionReport.interventionStartTimeDay2Str,
      this.interventionReport.interventionEndTimeDay2Str, 
      this.interventionReport.atCustomerStartTimeDay2Str,
      this.interventionReport.atCustomerEndTimeDay2Str)
  }
//=============================== Init Control Second Day ===========================
  initControleSecondDay(){
    this.startTimeControl = "startTimeDay2Control"
    this.endTimeControl ="endTimeDay2Control";
    this.atCustomerStartControl ="atCustomerDay2StartControl";
    this.atCustomerEndControl ="atCustomerDay2EndControl";
    this.formGroupNameLabel="interventionSecondDay";
    this.hno = "hno2"
    this.isOnCallDuty = "isOnCallDuty2"
    this.otherDuty = "otherDuty2";
    this.publicHolidayControl = "publicHoliday2Control";
    this.astreinte = "astreinte2";
    this.Autre = "Autre2";
  }

 //==================================INIT DATES ========================================
  initFormDates(dateStart, dateEnd, atCustStart,atCustEnd){
    if(this.interventionReport){ 
      this.startTime =  dateStart ? new Date(dateStart.substring(0, 10)): null;   
      this.endTime =  dateEnd ? new Date(dateEnd.substring(0, 10)): null;  
      this.atCustomerStartTime = atCustStart ? new Date(atCustStart.substring(0, 10)): null;   
      this.atCustomerEndTime =  atCustEnd ? new Date(atCustEnd.substring(0, 10)): null;   
      this.initFormHoursMinutes(dateStart , dateEnd, atCustStart,atCustEnd);
      this.initRanges();
  }
  
  }
//=================================Transform Date Interve ========================
  transformDateInterven(date):Date{
  const patternDate = "yyyy-MM-dd";
  return date ? new Date(this.datePipe.transform(date, patternDate)): null
  }
//===================================INIT RANGES====================================
  initRanges(){
    if(!isNullOrUndefined(this.atCustomerEndTime) && !isNullOrUndefined(this.startTime) 
    && !isNullOrUndefined(this.endTime) && !isNullOrUndefined(this.atCustomerStartTime) ){
      this.initRangesDefault();
    }
   else{
     if(isNullOrUndefined(this.atCustomerEndTime) && isNullOrUndefined(this.atCustomerStartTime)){
      this.rangeMinOfEndDate = this.startTime;
      this.rangeMaxStartDate = this.endTime;
      this.rangeMinOfAtCustomerStartDate = this.startTime;
      this.rangeMaxOfAtCustomerStartDate  = this.endTime;
      this.rangeMinOfAtCustomerEndDate = this.startTime;
      this.rangeMaxOfAtCustomerEndDate = this.endTime;
      if(this.isFirstDayInput){
        this.rangeMinOfpseStart = this.startTime;
        this.rangeMinOfpseEnd = !isNullOrUndefined(this.pseStart) ? this.pseStart : this.startTime;
        }
     }
     else{
      this.initRangesWhenatCustStartIsNotNull();
      this.initRangesWhenatCustEndIsNotNull();
     }
   
    }
  }
initRangesWhenatCustStartIsNotNull(){
  if(!isNullOrUndefined(this.atCustomerStartTime)){ 
    this.rangeMinOfEndDate = this.atCustomerStartTime;
    this.rangeMaxOfAtCustomerStartDate = this.endTime;
    this.rangeMinOfAtCustomerStartDate = this.startTime;
    this.rangeMinOfAtCustomerEndDate = this.atCustomerStartTime;
    this.rangeMaxOfAtCustomerEndDate = this.endTime;
    this.rangeMaxStartDate = this.atCustomerStartTime;
    if(this.isFirstDayInput){
      this.rangeMinOfpseStart = this.startTime;
      this.rangeMinOfpseEnd = this.pseStart ? this.pseStart : this.startTime;
      }
    }
    
}
initRangesWhenatCustEndIsNotNull(){
  if(!isNullOrUndefined(this.atCustomerEndTime)){
    this.rangeMinOfEndDate = this.atCustomerEndTime;
    this.rangeMaxOfAtCustomerStartDate = this.atCustomerEndTime;
    this.rangeMaxStartDate = this.atCustomerEndTime;
    this.rangeMinOfAtCustomerStartDate = this.startTime;
    this.rangeMinOfAtCustomerEndDate = this.startTime;
    this.rangeMaxOfAtCustomerEndDate = this.endTime;
    if(this.isFirstDayInput){
      this.rangeMinOfpseStart = this.startTime;
      this.rangeMinOfpseEnd = this.pseStart ? this.pseStart : this.startTime;
      }
   }
}
initRangesDefault(){
 // date du fin ne peut pas être inférieur à dép de chez Client
 this.rangeMinOfEndDate = this.atCustomerEndTime;
 // date dép de chez Client ne peut pas être inférieur à arr chez Client
 this.rangeMinOfAtCustomerEndDate = this.atCustomerStartTime;
 // date arr chez Client ne peut pas être inférieur à début inter
 this.rangeMinOfAtCustomerStartDate = this.startTime;
 // date début ne peux pas être supérieur à la date arr chez Client
 this.rangeMaxStartDate = this.atCustomerStartTime;
// date arr chez Client ne peux pas être supérieur à la date  depart
this.rangeMaxOfAtCustomerStartDate = this.atCustomerEndTime;
// date départ  ne peux pas être supérieur à la date fin
this.rangeMaxOfAtCustomerEndDate = this.endTime;

if(this.isFirstDayInput){
this.rangeMinOfpseStart = this.startTime;
this.rangeMinOfpseEnd = this.pseStart ? this.pseStart : this.startTime;
}

  }
//================== Init Hours and Minutes ======================================
  initFormHoursMinutes(dateStart , dateEnd, atCustStart,atCustEnd){
    this.hourStartDate = dateStart ? dateStart.substring(11, 13) : 0;
    this.minuteStartDate = dateStart ? dateStart.substring(14, 16) : 0;
    this.hourEndDate = dateEnd ? dateEnd.substring(11, 13) : 0;
    this.minuteEndDate = dateEnd ? dateEnd.substring(14, 16) : 0;
    this.hourAtCustomerStartDate = atCustStart ? atCustStart.substring(11, 13) : 0;
    this.minuteAtCustomerStartDate = atCustStart ? atCustStart.substring(14, 16) : 0;
    this.hourAtCustomerEndDate = atCustEnd ?  atCustEnd.substring(11, 13) : 0;
    this.minuteAtCustomerEndDate = atCustEnd ? atCustEnd.substring(14, 16) : 0;
  }
//===========================get Hours From date ===================================
  getHour(date):number{
  return Number(date.toString().substring(11, 13))
  }
  //===========================get Minutes From date ===================================
  getMinute(date): number{
   return Number(date.toString().substring(14, 16))
  }
//=================================INIT DATA==========================

initDataFirstDay(){
  this.checkPSE = false;
  this.isPseCheked  = false
  this.showTechBloc = false;
  this.removePseValidator();
  this.interventionForm.get('pseForm').get('pseckech').setValue(false);
  if(!isNullOrUndefined(this.interventionReport.pseStartTime)  && 
  !isNullOrUndefined(this.interventionReport.pseEndTime != null)){
    this.oncheckPse = false;
    this.isPseCheked  = true
    this.checkPSE = true;
    this.addPseValidator();
    this.interventionForm.get('pseForm').get('pseckech').setValue(true);
  }
  if(this.interventionReport.isHno){
    this.showTechBloc = true;
  }
  this.isHnoDisabled = false;
  if(this.interventionReport.isHno && (this.interventionReport.isPublicHoliday 
    || this.isPseCheked)){
    this.isHnoDisabled = true; 
  }
}
//=================================INIT DATA==========================

initDataSecondDay(){
  this.showTechBloc2 = false;
  if(this.interventionReport.isHno2){
    this.showTechBloc2 = true;
  }
  this.isHnoDisabled = false;
  if(this.interventionReport.isHno2 && (this.interventionReport.isPublicHoliday2  
    || this.isPseCheked)){
    this.isHnoDisabled = true;
  }
  this.interventionForm.get('interventionSecondDay').get('hno2').setValue(this.interventionReport.isHno2);
  this.interventionForm.get('interventionSecondDay').get('isOnCallDuty2').setValue(this.interventionReport.isOnCallDuty2 ? 'astreinte2':'Autre2');
  this.interventionForm.get('interventionSecondDay').get('publicHoliday2Control').setValue(this.interventionReport.isPublicHoliday2);
}
//=================================Change Date début==================================
  /**
   * onChangeTimeStart
   * changement des heures/minutes des dates
   * arrivé chez le client
   * Départ de chez le client
   * Fin d'intervention
   * Si les dates (YYMMDD) sont identiques
   */
  onChangeTimeStart(time: any): void { 
    if(this.initDone){
      this.hourStartDate = Number(time.substring(0, 2));
      this.minuteStartDate = Number(time.substring(4, 7));
      this.manageHnoInSelectDateOrTime();
      this.compareStartAndCame(time);
      this.compareStartAndLeave(time);
        if(!isNullOrUndefined(this.pseStart) && !isNullOrUndefined(this.getDateStart())){
          const psStart = this.pseStart;
          const datePseStart =  new Date(psStart.setHours(this.hourPseStart,this.minutePseStart,this.currentSecond))
          if(isAfter(this.getDateStart() , datePseStart )){
            this.hourPseStart = this.hourStartDate
            this.minutePseStart= this.minuteStartDate
            this.comparePseStartAndPseEnd();
          }
      }
      this.bindDates();
    }
  }

  //===================================================================================
  /***
   * Si la date début intervention égal à la date d'arrivé 
   * chez le client ==> l'heure de la Date d'arr chez le client doit 
   * être suppérieur ou égale à la date de début d'intervention
   */
  compareStartAndCame(time){
    const datestart =  this.getDateStart();
    const dateAtCustStart = this.getAtCustomerStartDate();
    if(!isNullOrUndefined(datestart) &&  !isNullOrUndefined(dateAtCustStart) 
    && isAfter(datestart , dateAtCustStart)){
      this.hourAtCustomerStartDate = this.hourStartDate;
      this.minuteAtCustomerStartDate = this.minuteStartDate;
    }
  }

//=========================================================================
  getAtCustomerStartDate():Date{
  let dateAtCustStart = null;
  if(!isNullOrUndefined(this.atCustomerStartTime)){
    dateAtCustStart =  new Date(this.atCustomerStartTime.setHours(this.hourAtCustomerStartDate,
      this.minuteAtCustomerStartDate,this.currentSecond));
  }
  return dateAtCustStart;
 }
 //======================================================================
  getAtCustomerEndDate():Date{
  let dateAtCustEnd = null;

  if(!isNullOrUndefined(this.atCustomerEndTime)){
    dateAtCustEnd =  new Date(this.atCustomerEndTime.setHours(this.hourAtCustomerEndDate,
      this.minuteAtCustomerEndDate,this.currentSecond));
  }
  return dateAtCustEnd;
 }
//=====================================================================================
  /***
   * Si la date début intervention égal à la date de départ de 
   * chez le client ==> l'heure de la Date de départchez le client doit 
   * être suppérieur ou égale à la date de début d'intervention
   */
  compareStartAndLeave(time){
    const datestart =  this.getDateStart();
    const dateAtCustEnd = this.getAtCustomerEndDate();   
    if(!isNullOrUndefined(datestart) &&  !isNullOrUndefined(dateAtCustEnd) 
    && isAfter(datestart , dateAtCustEnd)){
     this.onChangeTimeAtCustomerEnd(time);
    }
    
  }
//===================================================================================
   /***
   * Si la date début intervention égal à la date du Fin d'intervention
   * ==> l'heure de la Date du fin d'intervention  doit 
   * être suppérieur ou égale à la date de début d'intervention
   */
  
  compareStartAndEnd(time){
    const datestart =  this.getDateStart();
    const dateEnd = this.getDateEnd();

    if(!isNullOrUndefined(datestart) &&  !isNullOrUndefined(dateEnd) 
    && isAfter(datestart , dateEnd)){
      this.onChangeTimeEnd(time);
    }
    
  }
  //===================================================================================
  getPseStart():Date{
    let pseStart =  null
    if(!isNullOrUndefined(this.pseStart)){
      pseStart = new Date(this.pseStart.setHours(this.hourPseStart,
        this.minutePseStart,this.currentSecond));
    }
    return pseStart;
  }

//===================================================================================
  getDateStart():Date{
    let datestart =  null
    if(!isNullOrUndefined(this.startTime)){
      datestart = new Date(this.startTime.setHours(this.hourStartDate,
        this.minuteStartDate,this.currentSecond));
    }
    return datestart;
  }  
//===================================================================================
  getDateEnd():Date{
    let dateEnd = null;

    if(!isNullOrUndefined(this.endTime)){
      dateEnd =  new Date(this.endTime.setHours(this.hourEndDate,
        this.minuteEndDate,this.currentSecond));
    }
    return dateEnd;
  }
  
//====================================================================================
  // compare date d'arrivé chez le client et date de départ de chez le client
  compareCameAndLeave(time){
    const atCustStart =  this.getAtCustomerStartDate();
    const atCustEnd = this.getAtCustomerEndDate();

    if(!isNullOrUndefined(atCustStart) &&  !isNullOrUndefined(atCustEnd) 
    && isAfter(atCustStart , atCustEnd)){
     this.hourAtCustomerEndDate = this.hourAtCustomerStartDate;
     this.minuteAtCustomerEndDate = this.minuteAtCustomerStartDate
   
    }

  }
//==============================================================================
// compare date d'arrivé chez le client et date de départ de chez le client
compareCameLeaveAndLeaveStartInLeave(time){
  const atCustStart =  this.getAtCustomerStartDate();
  const atCustEnd = this.getAtCustomerEndDate();
   const start = this.getDateStart();
  if(!isNullOrUndefined(atCustStart) &&  !isNullOrUndefined(atCustEnd) 
  && isAfter(atCustStart , atCustEnd)){
    this.hourAtCustomerStartDate = Number(time.substring(0, 2));
    this.minuteAtCustomerStartDate = Number(time.substring(4, 7));
   //puisque on a changé l'arrivé chez le client
   // on doit la comparer avec le début d'intervention
   if(!isNullOrUndefined(start) &&  !isNullOrUndefined(atCustStart) 
   && isAfter(start , atCustStart)){
    this.hourStartDate = Number(time.substring(0, 2));
    this.minuteStartDate = Number(time.substring(4, 7));
   }
   
  }
  else{
    if(!isNullOrUndefined(start) &&  !isNullOrUndefined(atCustEnd) 
    && isAfter(start , atCustEnd)){
      this.hourStartDate = Number(time.substring(0, 2));
      this.minuteStartDate = Number(time.substring(4, 7));
    }
  }
}
//====================================================================================
  //compare date de départ de chez le client et date du fin d'intervention
  compareLeaveAndEnd(time){
    const atCustEnd =  this.getAtCustomerEndDate();
    const dateEnd =  this.getDateEnd();

    if(!isNullOrUndefined(atCustEnd) &&  !isNullOrUndefined(dateEnd) 
    && isAfter(atCustEnd , dateEnd)){
    this.onChangeTimeEnd(time);
    }
    
  }
//====================================================================================
//compare date d'arrivé chez le client et date du fin d'intervention
  compareCameAndEnd(time){
    const atCustStart =  this.getAtCustomerStartDate();
    const endTime = this.getDateEnd();

    if(!isNullOrUndefined(atCustStart) &&  !isNullOrUndefined(endTime) 
    && isAfter(atCustStart , endTime)){
     this.onChangeTimeAtCustomerEnd(time);
    }
     
  }

//==========================================================================
/**
 * onChangeTimeAtCustomerStart
 */
  onChangeTimeAtCustomerStart(time: any): void {
    
    this.hourAtCustomerStartDate = Number(time.substring(0, 2));
    this.minuteAtCustomerStartDate = Number(time.substring(4, 7));
    if((this.hourAtCustomerStartDate === 0 &&  this.minuteAtCustomerStartDate === 0 && !this.isFirstChange)
     || (this.hourAtCustomerStartDate !== 0 ||  this.minuteAtCustomerStartDate !== 0)){
    this.compareCameAndLeave(time)
    this.compareCameAndEnd(time);
    const atCustStart =  this.getAtCustomerStartDate();
    const start = this.getDateStart();
    if(!isNullOrUndefined(atCustStart) &&  !isNullOrUndefined(start) 
    && isAfter(start , atCustStart)){
      this.hourStartDate= Number(time.substring(0, 2));
      this.minuteStartDate = Number(time.substring(4, 7));
    }
    this.manageHnoInSelectDateOrTime();
    this.bindDates();
  }
   }

//=============================================================================
   /**
    * onChangeTimeAtCustomerEnd
    */
  onChangeTimeAtCustomerEnd(time: any): void {
   this.hourAtCustomerEndDate = Number(time.substring(0, 2));
    this.minuteAtCustomerEndDate = Number(time.substring(4, 7));
    if(this.hourAtCustomerEndDate === 0 &&  this.minuteAtCustomerEndDate === 0){
    if(!this.isFirstChange){
     this.compareCameLeaveAndLeaveStartInLeave(time);
      this.manageHnoInSelectDateOrTime();
      this.bindDates();
    }
    this.isFirstChange = false;
  }
  else{
    this.compareLeaveAndEnd(time);
   this.compareCameLeaveAndLeaveStartInLeave(time);
    this.manageHnoInSelectDateOrTime();
    this.bindDates();
  }
   
   }

//=======================================================================
  onChangeTimeEnd(time: any): void {
    if(!this.isOnInit){
      this.hourEndDate = Number(time.substring(0, 2));
      this.minuteEndDate = Number(time.substring(4, 7));
      this.compareEndAndOtherDates(time);
      this.manageHnoInSelectDateOrTime();
      this.bindDates(); 
      
    }
    this.isOnInit = false; 
   }
//================================================================
   compareEndAndOtherDates(time){
    const atCustStart =  this.getAtCustomerStartDate();
    const atCustEnd = this.getAtCustomerEndDate();
    const start = this.getDateStart();
    const end = this.getDateEnd();
    if(!isNullOrUndefined(atCustEnd) &&  !isNullOrUndefined(end) 
    && isAfter(atCustEnd , end)){
      this.hourAtCustomerEndDate = Number(time.substring(0, 2));
      this.minuteAtCustomerEndDate = Number(time.substring(4, 7));
     //puisque on a changé le départ de  chez le client
     // on doit la comparer avec l'arrivé chez le client
     if(!isNullOrUndefined(atCustStart) &&  !isNullOrUndefined(atCustEnd) 
     && isAfter(atCustStart , atCustEnd)){
      this.hourAtCustomerStartDate = Number(time.substring(0, 2));
      this.minuteAtCustomerStartDate= Number(time.substring(4, 7));
       //puisque on a changé l'arrivé chez le client
   // on doit la comparer avec le début d'intervention
       if(!isNullOrUndefined(start) &&  !isNullOrUndefined(atCustStart) 
   && isAfter(start , atCustStart)){
    this.hourStartDate = Number(time.substring(0, 2));
    this.minuteStartDate = Number(time.substring(4, 7));
     }
    }

    }
    else{
      if(!isNullOrUndefined(atCustStart) &&  !isNullOrUndefined(end) && isAfter(atCustStart , end)){
        this.hourAtCustomerStartDate = Number(time.substring(0, 2));
        this.minuteAtCustomerStartDate = Number(time.substring(4, 7));
         //puisque on a changé l'arrivé chez le client
   // on doit la comparer avec le début d'intervention
       if(!isNullOrUndefined(start) &&  !isNullOrUndefined(atCustStart)  && isAfter(start , atCustStart)){
        this.hourStartDate = Number(time.substring(0, 2));
        this.minuteStartDate = Number(time.substring(4, 7));
         }
      }
      else{
        if(!isNullOrUndefined(start) &&  !isNullOrUndefined(end) && isAfter(start , end)){
          this.hourStartDate = Number(time.substring(0, 2));
          this.minuteStartDate = Number(time.substring(4, 7));
      }
      }
    }
   }

//=========================================================================
  updateRangeAtCustEndInStartDateChange(dateStart,dateAtCustStart,dateAtCustEnd){
  // si D arrivé  et D départ non null le min du D départ = D arrivé
  if(!isNullOrUndefined(dateAtCustStart)){
    this.rangeMinOfAtCustomerEndDate = dateAtCustStart;
  }
   // si D arrivé null  et D départ non null le min du D départ = D start
  else if(isNullOrUndefined(dateAtCustStart)){
    this.rangeMinOfAtCustomerEndDate = dateStart;
  }
}
//=========================================================================
  updateRangeEndInStartDateChange(dateStart,dateAtCustStart,dateAtCustEnd,dateEnd){
  if(!isNullOrUndefined(dateAtCustEnd)){
    this.rangeMinOfEndDate= dateAtCustEnd;
  }
  else if(isNullOrUndefined(dateAtCustEnd) && !isNullOrUndefined(dateAtCustStart)){
    this.rangeMinOfEndDate= dateAtCustStart;
  }
  else if(isNullOrUndefined(dateAtCustEnd) && isNullOrUndefined(dateAtCustStart)
  && !isNullOrUndefined(dateStart)){
    this.rangeMinOfEndDate= dateStart;
  }
}
//=========================================================================
 updateRangeStartInAtCustStartChange(dateAtCustStart){
  //  Ddébut ne peut pas être supérieur à Darrivé
    this.rangeMaxStartDate= dateAtCustStart;
 }
//=========================================================================
  updateRangeAtCustomerEndInAtCustStartChange(dateAtCustStart){
  //  Ddépart ne peut pas être inférieur à Darrivé
    this.rangeMinOfAtCustomerEndDate= dateAtCustStart;
  }
//=========================================================================
  updateRangeEndInAtCustStartChange(dateAtCustStart,dateAtCustEnd){
  this.rangeMinOfEndDate = dateAtCustStart;
  if(!isNullOrUndefined(dateAtCustEnd)){
    this.rangeMinOfEndDate = dateAtCustEnd;
  }
  }
//=========================================================================
/**
 * updateAtCusStartInAtCustEnd
 * Si on change la date de départ
 * Si Darrivé non null
 * ==> D arrivé < = D départ
 *  et D début <= D arrivé
 * Si non
 * D Début < = D départ
 */
 updateRangeAtCusStartInAtCustEnd(dateAtCustStart,dateAtCustEnd){
if(!isNullOrUndefined(dateAtCustStart)){
  this.rangeMaxOfAtCustomerStartDate = dateAtCustEnd;
  this.rangeMaxStartDate = dateAtCustStart;
}
else{
  this.rangeMaxStartDate = dateAtCustEnd;
}
}
//=========================================================================
/**
 * updateEndInAtCustEnd
 * D Depart < = D fin
 */
 updateRangeEndInAtCustEnd(dateAtCustEnd){
  this.rangeMinOfEndDate = dateAtCustEnd
}

//===========================Date début d'intervention Select===========================
  onSelectStartDate(event: any): void{
  this.manageHnoInSelectDateOrTime();
  const startDate = this.getDateStart();
  const dateAtCustStart = this.getAtCustomerStartDate();
  const dateAtCustomerEnd = this.getAtCustomerEndDate();
  const endDate = this.getDateEnd();
  this.rangeMinOfAtCustomerStartDate = this.startTime;
  this.updateRangeAtCustEndInStartDateChange(startDate,dateAtCustStart,dateAtCustomerEnd)
  this.updateRangeEndInStartDateChange(startDate,dateAtCustStart,dateAtCustomerEnd,endDate);
    if(!isNullOrUndefined(dateAtCustStart) && isAfter(startDate, dateAtCustStart) ){
     this.hourAtCustomerStartDate = this.hourStartDate;
     this.minuteAtCustomerStartDate  = this.minuteStartDate;
    }
    if(!isNullOrUndefined(dateAtCustomerEnd) && isAfter(startDate, dateAtCustomerEnd ) ){

      this.hourAtCustomerEndDate = this.hourStartDate;
     this.minuteAtCustomerEndDate = this.minuteStartDate;
      this.rangeMaxOfAtCustomerStartDate = new Date(startDate);
    }
    if(!isNullOrUndefined(this.endTime) && isAfter(startDate ,endDate)){
      this.hourEndDate= this.hourStartDate;
      this.minuteEndDate = this.minuteStartDate;
      this.rangeMaxOfAtCustomerEndDate = new Date(startDate);
    } 
    if(this.isFirstDayInput &&  this.oncheckPse){
    this.selectDatePseStart(startDate);
    }
  
    if(!isNullOrUndefined(startDate) && this.getPublicHolidayDay(startDate)){
      this.setHnoTrue();
      this.isHnoDisabled = true;
      if(this.isFirstDay){
        this.showTechBloc = true;
      }
     else{
      this.showTechBloc2 = true;
     }
      this.checkAstreint(true);
   }
   this.bindDates();
  }
//===============================Bind Dates =========================================
bindDates(){
  if(this.isFirstDayInput){
    this.bindDataFirstDayToSave()
  }
  else{
    this.bindDataSecondDayToSave();
  }
}
//===========================Date arrivé chez le client Select============================
  onSelectAtCustomerStartDate(event: any): void {
  this.manageHnoInSelectDateOrTime();
  const dateAtCustStart = this.getAtCustomerStartDate();
  const dateAtCustomerEnd = this.getAtCustomerEndDate();
  const endDate = this.getDateEnd();
  const startDate = this.getDateStart();
  this.updateRangeStartInAtCustStartChange(dateAtCustStart);
  this.updateRangeAtCustomerEndInAtCustStartChange(dateAtCustStart);
  this.updateRangeEndInAtCustStartChange(dateAtCustStart,dateAtCustomerEnd);

    if(!isNullOrUndefined(dateAtCustomerEnd) && isAfter(dateAtCustStart, dateAtCustomerEnd ) ){
       this.hourAtCustomerEndDate = this.hourAtCustomerStartDate;
       this.minuteAtCustomerEndDate = this.minuteAtCustomerStartDate;
    }
    if(!isNullOrUndefined(this.endTime) && isAfter(dateAtCustStart  ,endDate)){
      this.hourEndDate = this.hourAtCustomerStartDate;
       this.minuteEndDate = this.minuteAtCustomerStartDate;
    } 

    if(!isNullOrUndefined(startDate) && isAfter(startDate , dateAtCustStart ) ){
      this.hourAtCustomerStartDate = this.hourStartDate;
      this.minuteAtCustomerStartDate = this.minuteStartDate;
   }
    if(!isNullOrUndefined(dateAtCustStart) && this.getPublicHolidayDay(dateAtCustStart)){
      this.setHnoTrue();
      this.isHnoDisabled = true;
      if(this.isFirstDay){
        this.showTechBloc = true;
      }
     else{
      this.showTechBloc2 = true;
     }
      this.checkAstreint(true);
   }
   this.bindDates();
  }

//===========================Date de départ de chez le client Select=====================
  onSelectAtCustomerEndDate(event: any): void {
    this.manageHnoInSelectDateOrTime();
    const dateAtCustomerEnd = this.getAtCustomerEndDate();
    const endDate = this.getDateEnd();
    const startDate = this.getDateStart();
    const dateAtCustStart = this.getAtCustomerStartDate();
    this.updateRangeEndInAtCustEnd(dateAtCustomerEnd);
    this.updateRangeAtCusStartInAtCustEnd(this.atCustomerStartTime,dateAtCustomerEnd);
    this.rangeMaxOfAtCustomerStartDate = this.atCustomerEndTime;
    this.rangeMaxStartDate = this.rangeMaxOfAtCustomerStartDate;
    if(!isNullOrUndefined(endDate) && isAfter(dateAtCustomerEnd  ,endDate)){
      this.hourEndDate = this.hourAtCustomerEndDate;
      this.minuteEndDate = this.minuteAtCustomerEndDate;
    } 
    if(!isNullOrUndefined(dateAtCustStart) && isAfter( dateAtCustStart ,dateAtCustomerEnd)){
      this.hourAtCustomerEndDate = this.hourAtCustomerStartDate;
      this.minuteAtCustomerEndDate = this.minuteAtCustomerStartDate;
    }
    else if(!isNullOrUndefined(startDate) && isAfter( startDate ,dateAtCustomerEnd)){
      this.hourAtCustomerEndDate = this.hourStartDate;
      this.minuteAtCustomerEndDate = this.minuteStartDate;
      this.rangeMaxStartDate = this.atCustomerEndTime;
    }
    if(!isNullOrUndefined(dateAtCustomerEnd) &&
    this.getPublicHolidayDay(dateAtCustomerEnd)){
      this.setHnoTrue();
      this.isHnoDisabled = true;
      if(this.isFirstDay){
        this.showTechBloc = true;
      }
     else{
      this.showTechBloc2 = true;
     }
      this.checkAstreint(true);
   }
   this.bindDates();
  }

  //===========================Date Fin d'intervention Select===========================
  onSelectEndDate(event: any): void {
    this.manageHnoInSelectDateOrTime();
    const dateAtCustomerEnd = this.getAtCustomerEndDate();
    const endDate = this.getDateEnd();
    const startDate = this.getDateStart();
    const dateAtCustStart = this.getAtCustomerStartDate();
    this.updateRangesInEndChangeDate(endDate);
    if(!isNullOrUndefined(dateAtCustomerEnd) && isAfter(dateAtCustomerEnd  ,endDate)){
      this.hourEndDate = this.hourAtCustomerEndDate;
      this.minuteEndDate = this.minuteAtCustomerEndDate;
      
    } 
    if(!isNullOrUndefined(startDate) && isAfter(startDate  ,endDate)){
      this.hourEndDate = this.hourStartDate;
      this.minuteEndDate = this.minuteStartDate;
    }
    if(!isNullOrUndefined(dateAtCustStart) && isAfter(dateAtCustStart  ,endDate)){

      this.hourEndDate = this.hourAtCustomerStartDate;
      this.minuteEndDate = this.minuteAtCustomerStartDate;
    }
    if(this.isFirstDay){
      this.selectDatePseEnd(endDate);
    }
   

    if(!isNullOrUndefined(endDate) && this.getPublicHolidayDay(endDate)){
      this.setHnoTrue();
      this.isHnoDisabled = true;
      if(this.isFirstDay){
        this.showTechBloc = true;
      }
     else{
      this.showTechBloc2 = true;
     }
      this.checkAstreint(true);
   }
   this.bindDates();
  }
//========================================================================
  /**
   * updateRangesInEndChangeDate
   * Ddépart < = D fin intervention
   * Si Ddépart non null 
   * Darri <= D départ
   * Si non Darri< = D fin intervention
   * Si Darri non null
   * D début <= D arri
   * Si non 
   * Ddébut < = D fin intervention
   */
  updateRangesInEndChangeDate(dateEnd){
    this.rangeMaxOfAtCustomerEndDate = dateEnd;
    this.rangeMaxStartDate =  dateEnd;
    this.rangeMaxOfAtCustomerStartDate = dateEnd;
    if(!isNullOrUndefined(this.atCustomerEndTime)){
      this.rangeMaxOfAtCustomerStartDate = this.atCustomerEndTime;
      this.rangeMaxStartDate = this.atCustomerEndTime;
    }
    if(!isNullOrUndefined(this.atCustomerStartTime)){
      this.rangeMaxStartDate = this.atCustomerStartTime;
    }
  }
//==============================HNO manage==================================
  onCheckHNO(event:any){
    if(event.checked){
      this.checkAstreint(true);
      if(this.isFirstDayInput){
        this.interventionReport.isHno = true;
      }
     else{
      this.interventionReport.isHno2 = true;
     }
    }
    else{
      this.checkAstreint(false);
      if(this.isFirstDayInput){
        this.interventionReport.isHno = false;
      }
     else{
      this.interventionReport.isHno2 = false;
     }
    }
    
  }

//======================================================================
//Si Hno check ==> Astreint check et enable
checkAstreint(checkValue){
 this.manageEnableAstreint(checkValue);
 if(this.isFirstDayInput && this.interventionForm.get('interventionFirstDay').dirty){
  this.interventionForm.get('interventionFirstDay').get('isOnCallDuty').setValue(checkValue ? 'astreinte' : 'Autre');
  this.interventionReport.isOnCallDuty = false;
  if(checkValue){
      this.interventionReport.isOnCallDuty = true;
  } 
}
 if(!this.isFirstDayInput && this.interventionForm.get('interventionSecondDay').dirty){
  this.interventionForm.get('interventionSecondDay').get('isOnCallDuty2').setValue(checkValue ? 'astreinte2' : 'Autre2');
  this.interventionReport.isOnCallDuty2 = false;
  if(checkValue){
      this.interventionReport.isOnCallDuty2 = true;
  } 
}
}
//========================================================================
oncheckAstreint(){
  this.interventionForm.get('interventionFirstDay')
  .get('isOnCallDuty')
  .valueChanges.subscribe(
 (data) => {
  this.interventionReport.isOnCallDuty = false;
   if(data === 'astreinte'){
     this.interventionReport.isOnCallDuty = true;
   }
 });
 if(this.interventionForm.get('interventionSecondDay')){
  this.interventionForm.get('interventionSecondDay')
  .get('isOnCallDuty2')
  .valueChanges.subscribe(
 (data) => {
  this.interventionReport.isOnCallDuty2 = false;
   if(data === 'astreinte2'){
     this.interventionReport.isOnCallDuty2 = true;
   }
 });
 }
}
//================================Manage enable Astreint ==================
manageEnableAstreint(checkValue){
  if(this.isFirstDayInput){
    this.showTechBloc = false;
    if(checkValue){
      this.showTechBloc = true;
    }
  }
  else{
   this.showTechBloc2 = false;
    if(checkValue){
      this.showTechBloc2 = true;
    }
  }
 
}
//================================Manage Ferie chekcbox ==================
  onClickPublicHoliday(event:any){
    this.isHnoDisabled = false;
    if(this.isFirstDayInput){
    this.interventionReport.isPublicHoliday = false;
    }
    else{
      this.interventionReport.isPublicHoliday2 = false;
    }
    this.setHnoFalse();
    if(event.checked){
      this.isHnoDisabled = true
      this.setHnoTrue();
      if(this.isFirstDayInput){
        this.interventionReport.isPublicHoliday = true;
      }
      else{
        this.interventionReport.isPublicHoliday2 = true;
      }
    }
      this.onCheckHNO(event);
  }

//==============================================================================
  setHnoTrue(){
    if(this.isFirstDayInput){
      this.interventionForm.get('interventionFirstDay').get('hno').setValue(true);
      this.interventionReport.isHno = true;
    }
    else{
      this.interventionForm.get('interventionSecondDay').get('hno2').setValue(true);
      this.interventionReport.isHno2 = true;
    }   
   
  }
//=================================================================================
  setHnoFalse(){
    if(this.isFirstDayInput){
      this.interventionForm.get('interventionFirstDay').get('hno').setValue(false);
      this.interventionReport.isHno = false;
    }
    else{
      this.interventionForm.get('interventionSecondDay').get('hno2').setValue(false);
      this.interventionReport.isHno2 = false;
    }   
   
  }
//==============================================================================
manageHnoInSelectDateOrTime():void{
  if(this.interventionForm.dirty){
    if((this.hourStartDate <= 7 && this.minuteStartDate <= 59 || this.hourStartDate>=20)
    ||  ((this.hourEndDate<=7 && this.minuteEndDate<=59) || this.hourEndDate>=20)
  ){
   this.setHnoTrue();
   this.checkAstreint(true);
   this.isHnoDisabled = true;
  }
  else{
   this.setHnoFalse();
   this.checkAstreint(false);
   this.isHnoDisabled = false;
  }
  }
     

  }
//==============================================================================
  selectDatePseStart(startDate){
    this.rangeMinOfpseStart = startDate;
    this.rangeMinOfpseEnd = this.pseStart ? this.pseStart : this.startTime;
    this.rangeMaxOfpseStart = this.pseEnd 
    
      let pseStart = null;
      if(!isNullOrUndefined(this.pseStart)){
        pseStart =  new Date(this.pseStart.setHours(this.hourPseStart,
          this.minutePseStart,this.currentSecond));
      }
      if(!isNullOrUndefined(this.pseStart) && isAfter(this.getDateStart() ,pseStart)){
        this.pseStart = this.startTime;
        this.rangeMinOfpseEnd = this.pseStart ? this.pseStart : this.startTime;
        this.rangeMaxOfpseStart = this.pseEnd
        this.hourPseStart = this.hourStartDate;
        this.minutePseStart = this.minuteStartDate;
        this.comparePseStartAndPseEnd();
      }
    this.bindDates();
  }
  //==============================================================================
  selectDatePseEnd(endDate){
    this.bindDates();
  }
  //==============================================================================
  onClickPse(event):void{
    if(event.checked){
      this.isPseCheked = true;
      this.oncheckPse = false;
      this.isHnoDisabled = true
      this.setHnoTrue(); 
      this.addPseValidator();
        }
    else{
      this.oncheckPse = false;
      this.isPseCheked = false;
      this.isHnoDisabled = false;
      this.setHnoFalse();
      this.removePseValidator();
    }
    this.onCheckHNO(event);
 }
//====================================================================
 onSelectPseStartDate(event){
   if(this.oncheckPse){
    this.rangeMinOfpseEnd = this.pseStart;
    if(!isNullOrUndefined(this.startTime) && isAfter(this.getDateStart(), this.getPseStart())){
   this.pseStart = this.startTime;
   this.rangeMinOfpseEnd = this.pseStart ? this.pseStart : this.startTime;
   this.hourPseStart = this.hourStartDate;
   this.minutePseStart = this.minuteStartDate}
   this.comparePseStartAndPseEnd();
   }
   this.oncheckPse = true;
  this.bindDates();
 }
 //======================================================================================
 comparePseStartAndPseEnd(){
  const psStart = this.pseStart;
  const pseEnd = this.pseEnd;
  if(!isNullOrUndefined(pseEnd) && !isNullOrUndefined(psStart) ){
    const datePseStart =  new Date(psStart.setHours(this.hourPseStart,this.minutePseStart,this.currentSecond))
    const datePseEnd =  new Date(pseEnd.setHours(this.hourPseEnd,this.minutePseEnd,this.currentSecond))
      if(isAfter(datePseStart, datePseEnd)){
        this.pseEnd = this.pseStart;
        this.rangeMaxOfpseStart = this.pseEnd
        this.hourPseEnd = this.hourPseStart;
        this.minutePseEnd = this.minutePseStart;}
  }
 }
//==============================================================================
 onChangeTimepseStart(time){
   if(this.initDone){
    this.hourPseStart = Number(time.substring(0, 2));
    this.minutePseStart= Number(time.substring(4, 7));
     if(!isNullOrUndefined(this.startTime) && isAfter(this.getDateStart(), this.getPseStart())){
       if(!(this.hourPseStart === 0 && this.minutePseStart === 0)){
        this.hourStartDate = this.hourPseStart
        this.minuteStartDate =this.minutePseStart;
       }
   
     }
     this.comparePseStartAndPseEnd();
      this.bindDates();
   } 
 }

//===================================================================================
 onSelectPseEndDate(event){
  if(this.oncheckPse){
  this.selectDatePseEnd(this.endTime);
  this.rangeMaxOfpseStart= this.pseEnd;
  this.bindDates();
  this.comparePseStartAndPseEnd();
  }
  this.oncheckPse = true;
 }
//====================================================================================
 onChangeTimepseEnd(time){
  if(this.oncheckPse){
   this.hourPseEnd = Number(time.substring(0, 2));
   this.minutePseEnd= Number(time.substring(4, 7));
  this.selectDatePseEnd(this.endTime);
  if(!isNullOrUndefined(this.pseStart) && !isNullOrUndefined(this.pseEnd)){
    const datePseStart =  new Date(this.pseStart.setHours(this.hourPseStart,this.minutePseStart,this.currentSecond))
    const datePseEnd =  new Date(this.pseEnd.setHours(this.hourPseEnd,this.minutePseEnd,this.currentSecond))
    if(isAfter(datePseStart,datePseEnd )){
      this.onChangeTimepseStart(time);
    }
  }  
  }

  this.bindDates();
 }
//====================================================================================
 listJouFerie(day){
  const listJouFerie = new Array();
  const year = day.getFullYear();
  const feteDuTravail = `${JOUR_FERIE.FETE_TRAVAIL}-${year}`;
  const victoire1945 = `${JOUR_FERIE.VICTOIRE_1945}-${year}`;
  const feteNationale = `${JOUR_FERIE.FETE_Nationale}-${year}`;
  const assomption = `${JOUR_FERIE.ASSOMPTION}-${year}`;
  const toussaint = `${JOUR_FERIE.TOUSSAINT}-${year}`;
  const armistice = `${JOUR_FERIE.ARMISTICE}-${year}`;
  const noel = `${JOUR_FERIE.NOEL}-${year}`;
  const jourAn = `${JOUR_FERIE.JOUR_AN}-${year}`;
  listJouFerie.push(feteDuTravail, victoire1945, feteNationale, assomption, 
   toussaint, armistice, noel, jourAn);
 
 return listJouFerie.concat(this.getJoursPaques(year));
   }
//==============================================================================
   getJoursPaques(year){
    const listJousPaques = new Array();
    const G = year%19;
    const C = Math.floor(year/100);
    const H = (C - Math.floor(C/4) - Math.floor((8*C+13)/25) + 19*G +15)%30;
    const I = H - Math.floor(H/28)*(1 - Math.floor(H/28)*Math.floor(29/(H+1))*Math.floor((21 - G)/11));
    const J = (year*1 + Math.floor(year/4) + I + 2 - C + Math.floor(C/4))%7 ;
    const L = I - J ;
    const moisPaques = 3 + Math.floor((L + 40)/44);
    const jourPaques = L + 28 - 31*Math.floor(moisPaques/4);
    const paques = new Date(year, moisPaques-1, jourPaques);
    const lundiPaques = new Date(year, moisPaques-1, jourPaques+1);
    const ascension = new Date(year, moisPaques-1,jourPaques+39);
    const pentecote = new Date(year, moisPaques-1, jourPaques+49);
    const lundiPentecote = new Date(year, moisPaques-1, jourPaques+50);
    listJousPaques.push(this.getDateDayForCalendar(paques), 
    this.getDateDayForCalendar(lundiPaques), this.getDateDayForCalendar(ascension),
     this.getDateDayForCalendar(pentecote), this.getDateDayForCalendar(lundiPentecote) )
    return listJousPaques ;
     }
//==============================================================================
  getDateDayForCalendar(day){
    let  months = (day.getMonth()).toString();
    let days = day.getDate().toString();
    const year = day.getFullYear().toString();
    if(days.toString().length<2){
    days = `0${days}` ; 
    } 
    if(months.toString().length<2){
      months = `0${months}` ; 
      }  
    return `${days}-${months}-${year}` ;
  }

  getPublicHolidayDay(dateIn):boolean{
    const listJourFerie = this.listJouFerie(dateIn);
    const day = dateIn.getDay();
    const dateDay = this.getDateDayForCalendar(dateIn);
    if(listJourFerie.indexOf(dateDay)>=0){
      return day === JOUR_FERIE.JOUR_DIMANCHE || day === JOUR_FERIE.JOUR_SAMEDI || dateDay===listJourFerie[listJourFerie.indexOf(dateDay)]  ;
    }
    else {
    return day === JOUR_FERIE.JOUR_DIMANCHE || day === JOUR_FERIE.JOUR_SAMEDI  ; 
         }
  }
//=================================Add Validators PSE==============================
 addPseValidator(){
  this.interventionForm.get('pseForm').get('pseStartControl').setValidators(Validators.required);
  this.interventionForm.get('pseForm').get('pseStartControl').updateValueAndValidity();
  this.interventionForm.get('pseForm').get('pseEndControl').setValidators(Validators.required);
  this.interventionForm.get('pseForm').get('pseEndControl').updateValueAndValidity();
 }
//=================================Remove validators PSE==============================

removePseValidator(){
  this.interventionForm.get('pseForm').get('pseStartControl').setValidators(null);
  this.interventionForm.get('pseForm').get('pseStartControl').updateValueAndValidity();
  this.interventionForm.get('pseForm').get('pseEndControl').setValidators(null);
  this.interventionForm.get('pseForm').get('pseEndControl').updateValueAndValidity();
 }
//==============================validation ======================================
validateFirstDayDates(form){ 
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'startTimeControl':
            this.dateDebutInterInvalid = true;
          break;
          case 'endTimeControl':
            this.dateFinIntervInvalid = true;
          break;
          default:
          console.log('valide Dates');
           break;}}
      }  
}
//==============================validation ======================================
validateSecondDayDates(form){ 
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'startTimeDay2Control':
            this.dateDebut2InterInvalid = true;
          break;
          case 'endTimeDay2Control':
            this.dateFin2IntervInvalid = true;
          break;
          default:
          console.log('valide Dates');
           break;}}
      }  
}
//==============================validation ======================================
validatePse(form){ 
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'pseStartControl':
            this.dateDebutPseInvalid = true;
          break;
          case 'pseEndControl':
            this.dateFinPseInvalid = true;
          break;
          default:
          console.log('valide pse dates');
           break;}}
      }  
}
 initValidators(){
  this.dateDebutInterInvalid = false;
  this.dateFinIntervInvalid = false;
  this.dateDebut2InterInvalid = false;
  this.dateFin2IntervInvalid = false;
  this.dateDebutPseInvalid = false;
  this.dateFinPseInvalid = false;
 }


}
