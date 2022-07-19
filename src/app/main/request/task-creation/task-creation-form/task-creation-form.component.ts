import { getDecryptedValue } from 'src/app/_core/utils/functions-utils';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Moment from 'moment-business-days';
import { ReferenceData } from 'src/app/_core/models/reference-data';
import { GassiMockLoginService } from 'src/app/_core/services';
import { TaskVo, UserVo } from '../../../../_core/models';
import { CustomerInteractionVO } from '../../../../_core/models/request/crud/customer-interaction';
import { RequestVO } from '../../../../_core/models/request/crud/request';
import { RequestService } from '../../../../_core/services/request.service';
import { TaskService } from '../../../../_core/services/task-service';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { JOUR_FERIE } from '../../../../_core/constants/constants';


@Component({
  selector: 'app-task-creation-form',
  templateUrl: './task-creation-form.component.html',
  styleUrls: ['./task-creation-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCreationFormComponent implements OnInit {

  @Input() customerId: string;
  @Input() idRequest: number;
  @Input() users: UserVo[];
  @Input() wfRequest: RequestVO;
  @Input() wfCustomerInteraction: CustomerInteractionVO;
  @Input() referenceDataList: ReferenceData[];
  @Input()
  hasNotInteraction = false;
  @Output() onFormGroupChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() onSubmittedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCanceledChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() attachedUserId: number;
  @Input() precision : boolean;
  @Input() isCreationRequest = false;
  attachedCurrentUserId: number;

  currentUserId: number;
  newTask: TaskVo;
  taskForm: FormGroup;
  rangeOfEndDate: Date;
  typeCustomer: string;
  minute: number;
  hour: number;
  defaulStarttHours: number;
  defaulEndtHours: number;
  defaultStartMinute: number;
  defaultEndMinute: number;
  endHour: number;
  endMinute: number;
  localTime;
  filterDateBusiness: any;
  datePattern = 'dd/MM/yyyy HH:mm'
  constructor(private eRef: ElementRef, private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    private modalService: NgbModal, private taskService: TaskService, private mockLoginService: GassiMockLoginService,
    private readonly requestService: RequestService,
    private readonly datePipe: DatePipe) {
    this.taskForm = this.createFormGroup();
  }

  ngOnInit(): void {
    this.initHourParams();
    this.initMinuteParams();
    // init current user
    this.mockLoginService.getCurrentUserId().subscribe(userId => {
      if (userId) {
        this.currentUserId = userId;
      }
    });
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.onFormGroupChange.emit(this.taskForm);
    this.onSubmittedChange.emit(false);
    this.onCanceledChange.emit(false);
    this.referenceDataList = this.getReferenceDataList();
    this.initAttachedTo();
  /**
   * cette fonction permet de griser les jours weekend et feries
   * @author Faityahia
   */ 
  this.filterDateBusiness = (d: Date): boolean => {
      const listJourFerie = this.listJouFerie(d);
      const day = d.getDay();
      const dateDay = this.getDateDayForCalendar(d);
      if(listJourFerie.indexOf(dateDay)>=0){
        return day !== JOUR_FERIE.JOUR_DIMANCHE && day !== JOUR_FERIE.JOUR_SAMEDI && dateDay!==listJourFerie[listJourFerie.indexOf(dateDay)]  ;
      } else {
      return day !== JOUR_FERIE.JOUR_DIMANCHE && day !== JOUR_FERIE.JOUR_SAMEDI  ; 
           }
      }      
  }
   /**
   * cette fonction permet de formater la date pour formaliser le traitement 
   * de date afin de  griser les jours weekend et feries
   * @author Faityahia
   */
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
  /**
   * cette fonction permet de generer la liste des jours ferie paris
   * @author Faityahia
   */ 
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

    /**
   * cette fonction permet de generer la liste des jours paques, pentecote et ascension
   * ces jours ont un calcul special car ils dependent de l'accomplissent de la lune
   * @author Faityahia
   */ 
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

  initAttachedTo(): void {
    if (!isNullOrUndefined(this.wfRequest)) {
      this.attachedCurrentUserId = this.wfRequest.attachedUserId;
    } else {
      this.attachedCurrentUserId = this.attachedUserId;
    }
    if (this.users) {
      const userConnected = this.users.find(user => user.id === this.attachedCurrentUserId);
      this.taskForm.get('inChargeOf').setValue(userConnected);
    }
  }
  
   /**
   * THE ROLE OF THIS FUNCTION IS MINUTE INITIALIZATION
   * @author YOUNESS FATHI
   */
  public initMinuteParams() {
    console.log('minute utc = ' , new Date().getUTCMinutes());
    this.minute = new Date().getMinutes();
    this.defaultStartMinute = this.minute;
    this.defaultEndMinute = this.minute;
  }
  /**
   * THE ROLE OF THIS FUNCTION IS HOUR INITIALIZATION
   * @author YOUNESS FATHI
   */
  public initHourParams() {
    console.log('hour utc = ' , new Date().getUTCHours());
    this.hour = new Date().getHours();
    this.defaulStarttHours = this.hour;
    this.defaulEndtHours = this.hour;
  }

  public onChangeTimeDD(time: string): void {
    this.hour = Number(time.substring(0, 2));
    this.minute = Number(time.substring(4, 7));
  }

  onChangeEndTime(time: string): void {
    this.endHour = Number(time.substring(0, 2));
    this.endMinute = Number(time.substring(4, 7));
  }


  createFormGroup(): FormGroup {
    const startDate = new Date();
    // startDate.setDate(startDate.getDate()+1) => return number
    // new Date(startDate.setDate(startDate.getDate()+1)) => to convert returned number to Date
    const endDat = this.getDefaultEndDate(startDate);
    return this.fb.group({
      currentTask: this.fb.control(null, [Validators.required]),
      startDate: this.fb.control({value: new Date(), disabled: true}),
      endDate: this.fb.control({value: new Date(endDat), disabled: true}),
      isPriority: this.fb.control(false),
      inChargeOf: this.fb.control(null, [Validators.required]),
      assignedTo: this.fb.control(null, [Validators.required]),
      userToNotify: this.fb.control(null),
      description: this.fb.control('', [Validators.maxLength(4000)])
    });
  }
  /**
   * cette fonction permet de generer la valeur par defaut de la date d echeance
   * de sorte qu elle ne coincide pas avec un weekend ou férié de l annee en cour et la prochaine annee
   * @author Faityahia
   */ 
  getDefaultEndDate(startDate:Date){
    const listJourFerie = this.listJouFerie(startDate);
    const dateEcheance = new Date();
    const dateTransitionNouvelAn = new Date();
    dateEcheance.setDate(startDate.getDate()+1);
    dateTransitionNouvelAn.setFullYear(startDate.getFullYear()+1);
    const listJourFerieNouvelAn = this.listJouFerie(dateTransitionNouvelAn);
    let dateDay = this.getDateDayForCalendar(dateEcheance);
    let dateDayNouvelAn = this.getDateDayForCalendar(dateTransitionNouvelAn);
    let flag = 0 ;
  do{
   if(dateEcheance.getDay() === JOUR_FERIE.JOUR_DIMANCHE|| dateEcheance.getDay() === JOUR_FERIE.JOUR_SAMEDI 
   || listJourFerie.indexOf(dateDay)>=0 || listJourFerieNouvelAn.indexOf(dateDayNouvelAn)>=0 ){
     flag = 1
    dateEcheance.setDate(dateEcheance.getDate()+1);
    dateDay = this.getDateDayForCalendar(dateEcheance);
    dateDayNouvelAn = this.getDateDayForCalendar(dateEcheance);
   } else {
     flag = 0 ;
   }
  }while(flag !== 0)
  return dateEcheance.setDate(dateEcheance.getDate()) ;
}



  onSelectStartDate(event: any): void {
    this.taskForm.get('endDate').setValue(Moment(this.getDefaultEndDate(this.taskForm.value.startDate)));
    this.rangeOfEndDate = new Date(this.taskForm.get('startDate').value);
  }

  onSelectEndDate(event: any): void {
    this.taskForm.get('startDate').setValue(this.taskForm.value.endDate);
  }


  cancelCreation(): void {
    this.onCanceledChange.emit(true);
    this.goToTaskList(this.idRequest);
  }

  createTask(): void {
    if (this.taskForm.valid) {
      const dateCreation = new Date();
      const startDateToSend: Date = this.getDate(this.taskForm.get('startDate').value , this.hour , this.minute );
      const endDateToSend: Date = this.getDate(this.taskForm.get('endDate').value , this.endHour , this.endMinute);
      const creationDate = new Date(
      dateCreation.getFullYear(), dateCreation.getMonth(),
      dateCreation.getDate(), dateCreation.getHours(), dateCreation.getMinutes(), dateCreation.getSeconds());
      this.newTask = {
        id: null,
        startDate: startDateToSend,
        startDateAsString: this.datePipe.transform(startDateToSend, this.datePattern),
        endDate: endDateToSend,
        endDateAsString:this.datePipe.transform(endDateToSend, this.datePattern),
        isPriority: this.taskForm.value.isPriority,
        inChargeOfId: this.taskForm.value.inChargeOf.id,
        assignedToId: this.taskForm.value.assignedTo.id,
        userIdToNotify: this.taskForm.value.userToNotify
          ? this.taskForm.value.userToNotify.id
          : 0,
        description: this.taskForm.value.description,
        requestId: this.idRequest,
        customerId: getDecryptedValue(this.customerId),
        createdById: this.currentUserId,
        resolutionDuration: 0,
        thetisTaskId: null,
        statut: null,
        resolutionComment: null,
        closedById: null,
        label: this.taskForm.value.currentTask.label,
        name: null,
        createDate: creationDate,
        resolutionStatus: null,
        initialisationProcedures:null,
        traitementProcedures:null,
        createDateAsString: this.datePipe.transform(creationDate, this.datePattern),
        dispalyEndDate: null
        
      };
      console.log(' task in creation form ' , this.newTask);
      this.onSubmittedChange.emit(true); 
      if(this.idRequest){
        this.newTask.requestId = this.idRequest;
          this.taskService.addTask(this.newTask).subscribe(newTask => {
            this.goToTaskList(this.idRequest);
          });
      } else {
        this.setCreationDate();
        this.requestService.saveRequest(this.wfRequest).subscribe(requestResult => {
          this.wfCustomerInteraction.requestId = requestResult.id;
          this.newTask.requestId = requestResult.id;
          if(this.hasNotInteraction) {
            this.taskService.addTask(this.newTask).subscribe(newTask => {
            this.goToTaskList(requestResult.id);
            });
          } else {
          this.wfCustomerInteraction.description = requestResult.description;
          this.wfCustomerInteraction.creationDate = requestResult.createdAt;
          this.wfCustomerInteraction.creatorId = requestResult.createdById;
          this.wfCustomerInteraction.interlocuteurId = requestResult.interlocuteurId;
          this.wfCustomerInteraction.creationDateStr = this.datePipe.transform(this.wfCustomerInteraction.creationDate, this.datePattern);
          this.requestService.saveCustomerInteraction(this.wfCustomerInteraction).subscribe(customerInterResult => {
            this.taskService.addTask(this.newTask).subscribe(newTask => {
            this.goToTaskList(requestResult.id);
            });
          });
        }
        });
      }
    }
  }
  setCreationDate() {
    this.wfRequest.creationDateAsString = this.datePipe.transform(new Date(), this.datePattern)
    this.wfRequest.modifiedAtAsString = this.wfRequest.creationDateAsString;
  }

  goToTaskList(idRequest : number): void {
    this.router.navigate(
      ['/customer-dashboard', this.customerId, 'detail', 'request', idRequest],
      { queryParamsHandling: 'merge' }
    );
  }

  onSelectReferenceData(child: any): void {
    this.taskForm.controls.currentTask.setValue(child);
  }

  getReferenceDataList(): ReferenceData[] {
    this.referenceDataList.forEach((referenceData) => {
      
      if (!referenceData.parentId) {
        referenceData.children = this.referenceDataList.filter(refData => refData.parentId === referenceData.id);
      }
    });
    return this.referenceDataList.filter(referenceData => !referenceData.parentId);
  }

  public getDate(date: Date, hour: number, min: number): Date {
    return new Date(
      date.getFullYear(), date.getMonth(), date.getDate(), hour, min
    );
  }
}
