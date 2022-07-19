import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskVo, UserVo } from 'src/app/_core/models';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';

import { TaskService } from '../../../../_core/services/task-service';
import { stringToBoolean } from '../../../../_core/utils/string-utils';
import { JOUR_FERIE } from '../../../../_core/constants/constants';

@Component({
  selector: 'app-task-update-form',
  templateUrl: './task-update-form.component.html',
  styleUrls: ['./task-update-form.component.scss'],
  providers: [DatePipe]
})
export class UpdateTaskFormComponent implements OnInit {

  @Output() onFormGroupChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() onSubmittedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCanceledChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  task: TaskVo;

  @Input()
  users: UserVo[];

  @Input()
  customerId: string;

  @Input()
  idRequest: number;

  echeanceDate: Date;
  echeanceHour: number;
  hourDD: number;
  echeanceMinute: number;
  minuteDD: number;
  assigneId: number;
  inChargeOfId: number;
  notifyId: number;
  filterDateBusiness: any;
  startDate: Date;
  minDateEcheance: Date;
  minHour = 0;
  minMinute = 0;
  startDateFull: Date;

  hours = [];
  minutes = [];

  hoursDD = [];
  minutesDD = [];

  idRequestsList: Number[];
  
  defaultHour: number;
  defaultMinute: number;
  defaultHoursDD: number;
  defaultMinuteDD: number;

  modifyTaskForm: FormGroup;

  requestLabel: string;

  isRouteDetailTask: Boolean;
  routePilotageTask: string;
  
  constructor(private route: ActivatedRoute, private datePipe: DatePipe, 
    private taskService: TaskService, private router: Router, private fb: FormBuilder ) {
    this.modifyTaskForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      startDate: this.fb.control(''),
      echeanceDate: this.fb.control(''),
      isPriority: this.fb.control(''),
      assignedTo: this.fb.control(''),
      inChargeOf: this.fb.control(''),
      userToNotify: this.fb.control(''),
      description: this.fb.control('')
    });
  }

  ngOnInit(): void {
    console.log('task = ' , this.task);
      /**
   * cette fonction permet de griser les jours weekend et feries
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
    this.isRouteDetailTask = stringToBoolean(this.route.snapshot.queryParamMap.get('isDetail'));
    this.routePilotageTask = this.route.snapshot.queryParamMap.get('name');
    if (this.task.endDate !== null) {
      this.assigneId = this.task.assignedToId;
      this.inChargeOfId = this.task.inChargeOfId;
      this.notifyId = this.task.userIdToNotify;
      if (this.task.endDate !== null) {
        const hour = this.formatDateToGetHour(this.task.endDate.toString());
        this.echeanceDate= new Date(this.task.endDate);
        this.echeanceHour = Number(hour);
        this.echeanceMinute = new Date(this.task.endDate).getMinutes() ;
        this.defaultHour = this.echeanceHour;
        this.defaultMinute = this.echeanceMinute;
      } 
      if (this.task.startDate !== null) {
        this.minHour = null;
        this.minMinute = null;
        const hour = this.formatDateToGetHour(this.task.startDate.toString());
        this.startDate=new Date(this.task.startDate);
        this.minDateEcheance = this.startDate;
        this.defaultHoursDD = Number(hour);
        this.hourDD = this.defaultHoursDD ;
        this.defaultMinuteDD = new Date(this.task.startDate).getMinutes();        
        this.minuteDD = this.defaultMinuteDD ;
        this.startDateFull = this.task.startDate;
      }
    }
    this.dateChanged();
    this.onFormGroupChange.emit(this.modifyTaskForm);
    this.onSubmittedChange.emit(false);
    this.onCanceledChange.emit(false);
  }

  formatDateToGetHour(date: string) {
    return this.datePipe.transform(date , "HH");
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
  dateDebutValueChange(): void {
    this.minDateEcheance = this.startDate;
  }


  dateChanged(): void {
    const dateEcheSelect = new Date(this.echeanceDate.getFullYear(), this.echeanceDate.getMonth(), 
                            this.echeanceDate.getDate());  
    const dateStar = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), 
    this.startDate.getDate());               
    if ( dateEcheSelect.getTime() === dateStar.getTime() ) {
      this.minHour = new Date(this.task.startDate).getHours();
      this.minMinute = new Date(this.task.startDate).getMinutes();
      this.defaultHour = this.minHour;
      this.defaultMinute = this.minMinute;
    } else {
      this.minHour = 0;
      this.minMinute = 0;
    }
  }

  onChangeTimeEcheance( time: string): void {
    this.echeanceHour = Number(time.substring(0, 2));
    this.echeanceMinute = Number(time.substring(4, 7));
  }

  onChangeTimeDD( time: string): void {
    this.hourDD = Number(time.substring(0, 2));
    this.minuteDD = Number(time.substring(4, 7));
  }

  saveTask(): void {
    const datePattern = 'dd/MM/yyyy HH:mm';
    //const dateDabut = this.getDate(this.startDate , this.hourDD , this.minuteDD );

    //const endDate = this.getDate(this.echeanceDate , this.echeanceHour , this.echeanceMinute);
    this.task.startDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), 
    this.startDate.getDate(), this.hourDD , this.minuteDD);
    this.task.startDateAsString = this.datePipe.transform(this.task.startDate , datePattern);
    this.task.endDate = new Date(this.echeanceDate.getFullYear(), this.echeanceDate.getMonth(), 
    this.echeanceDate.getDate(), this.echeanceHour , this.echeanceMinute );
    this.task.endDateAsString = this.datePipe.transform(this.task.endDate ,datePattern);
    console.log("l heur choisi",this.task);
    this.taskService.addTask(this.task).subscribe(() => {
      console.log("l heur qui sera enregistré",this.task);
      this.goToTaskListOrDetail();
    });
  }
  /**
   * @role récuperer la date  depuis ihm
   * @author
   * @param date 
   * @param hour 
   * @param minute
   * NB :  getTimezoneOffset() permet de retourner la différence en minutes entre le fuseau horaire UTC, et celui de l'heure locale 
   */
  getDate(date: Date , hour:number , minute: number) {
    return new Date(date.getFullYear(), date.getMonth(), 
    date.getDate(), hour , minute);
  }

  goToTaskListOrDetail(): void {
    this.onSubmittedChange.emit(true);
    if (this.isRouteDetailTask === true) {
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'request', this.idRequest, 'task-details', this.task.id],
        { queryParamsHandling: 'merge' }
      );
    } else if(this.routePilotageTask === "all" || this.routePilotageTask === "tasks"){
      this.router.navigate(
        ['/task-monitoring'],
        { 
          queryParams: { 
            'backAgain' : 'true'
          },
          queryParamsHandling: 'merge' 
        }
      );
    } else{
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'detail', 'request', this.idRequest],
        { queryParamsHandling: 'merge' }
      );
    }
    
  }

  cancelCreation(): void {
    this.goToTaskListOrDetail();
    this.onCanceledChange.emit(true);
  }

}
