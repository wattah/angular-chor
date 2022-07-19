import { DatePipe } from '@angular/common';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { CustomerReferentLight } from './../../../../_core/models/customer-referent-light';
import { CONSTANTS } from '../../../../_core/constants/constants';
import { catchError } from 'rxjs/operators';
import { UserService } from './../../../../_core/services/user-service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskVo } from 'src/app/_core/models/Task-vo';
import { TaskService } from 'src/app/_core/services/task-service';
import { RequestService } from 'src/app/_core/services/request.service';
import { UserVO, RequestVO } from 'src/app/_core/models/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as Moment from 'moment-business-days';
import { GassiMockLoginService, CustomerService } from 'src/app/_core/services';
import { ProcessInstanceVO } from 'src/app/_core/models/ProcessInstanceVO';
import { getCustomerIdFromURL } from 'src/app/main/customer-dashboard/customer-dashboard-utils';
import { of } from 'rxjs';
import { getCurrentUTCDate } from '../../../../../app/_core/utils/date-utils';

@Component({
  selector: 'app-task-affectation',
  templateUrl: './task-affectation.component.html',
  styleUrls: ['./task-affectation.component.scss']
})
export class TaskAffectationComponent implements OnInit {
  customerId: number;
  taskVo: TaskVo;

  @Input()
  request: RequestVO;
  @Input() 
  attachedUserId: number;

  userId: number;
  
  rangeOfEndDate: Date;
  taskForm: FormGroup;
  newTask: TaskVo;
  currentUserId: number;
  currentUserCUID: string;
  isValido = false;

  defaulStarttHours: number;
  defaulEndtHours: number;
  defaultStartMinute: number;
  defaultEndMinute: number;
  hourDD: number;
  minuteDD: number;
  echeanceMinute: number;
  echeanceHour: number;
  minHour = 0;
  minMinute = 0;
  userSelected: UserVO = null;
  @Input()
  idFormTask;
 

  @Input()
  task: ProcessInstanceVO;
  @Input()
  users: Array<UserVO>;
  usersInChargeOf: Array<UserVO>;
  usersNotified: Array<UserVO>;
  @Input()
  requestResultId: number;
  @Output() isTaskCreated = new EventEmitter<boolean>();
  @Output() formGroupChange: EventEmitter<FormGroup> = new EventEmitter<
    FormGroup
  >();
  @Output() onSubmittedChange: EventEmitter<Boolean> = new EventEmitter<
    Boolean
  >();
  @Output() cancelCreation: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() formSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() formValidation: EventEmitter<boolean> = new EventEmitter<boolean>();
  princeplCondidateGroup = ['COACH', 'DESK', 'VENTE'];
  referents: CustomerReferentLight[] = [];
  constructor(
    private readonly route: ActivatedRoute,
    private readonly taskService: TaskService,
    private readonly router: Router,
    private readonly requestService: RequestService,
    private readonly fb: FormBuilder,
    private readonly mockLoginService: GassiMockLoginService,
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
    private readonly datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    console.log('my task', this.task);
    this.usersInChargeOf = this.users.slice();
    this.usersNotified = this.users.slice();
    this.initHourParams();
    this.initMinuteParams();
    this.mockLoginService.getCurrentUserId().subscribe((userId) => {
      if (userId) {
        this.currentUserId = userId;
      }
    });
    this.mockLoginService.getCurrentCUID().subscribe((userCuid) => {
      if (userCuid) {
        this.currentUserCUID = userCuid;
      }
    });
    this.taskForm = this.createFormGroup();
    this.customerId = Number.parseInt(
      this.route.parent.snapshot.paramMap.get('customerId'),
      10
    );
    this.initUserAffectationTask();
    this.initAffectionDate();
    this.initAttachedTo();
    this.formGroupChange.emit(this.taskForm);
    this.cancelCreation.emit(false);
  }

  initAttachedTo(): void {
    if (!isNullOrUndefined(this.request)) {
      this.userId = this.request.attachedUserId;
    } else {
      this.userId = this.attachedUserId;
    }
    if (this.users) {
      const userConnected = this.usersInChargeOf.filter(user => user.id === this.userId)[0];
      this.taskForm.get('inChargeOf').setValue(userConnected);
    }
  }

  initAffectionDate() {
    if (
      !isNullOrUndefined(this.task.followUpDate) &&
      !isNullOrUndefined(this.task.dueDate)
    ) {
      const followUpDate = new Date(this.task.followUpDate);
      const dueDate = new Date(this.task.dueDate);
      this.setHourAndMin(followUpDate, dueDate);
      this.taskForm.get('startDate').setValue(followUpDate);
      this.taskForm.get('endDate').setValue(dueDate);
    }
    this.rangeOfEndDate = new Date(this.taskForm.get('startDate').value);
  }
  setHourAndMin(followUpDate: Date, dueDate: Date) {
    const startHour = followUpDate.getHours();
    const startMin = followUpDate.getMinutes();
    const endHour = dueDate.getHours();
    const endMin = dueDate.getMinutes();
    this.defaultStartMinute = startMin;
    this.defaultEndMinute = endMin;
    this.defaulStarttHours = startHour;
    this.defaulEndtHours = endHour;
    this.hourDD = startHour;
    this.minuteDD = startMin;
    this.echeanceHour = endHour;
    this.echeanceMinute = endMin;
  }
  getReferents() {
    const customerId = getCustomerIdFromURL(this.route);
    this.customerService
      .getListReferents(customerId)
      .pipe(catchError(() => of(null)))
      .subscribe(
        (referents) => {
          this.referents = referents;
        },
        (error) => console.log,
        () => {
          this.getSelectUserByCandidateGroup();
        }
      );
  }

  onSelectStartDate(event: any): void {
    this.taskForm
      .get('endDate')
      .setValue(
        Moment(this.taskForm.value.startDate).nextBusinessDay().toDate()
      );
    this.rangeOfEndDate = new Date(this.taskForm.get('startDate').value);
  }

  onSelectEndDate(event: any): void {
    this.taskForm.get('startDate').setValue(this.taskForm.value.endDate);
  }

  /**
   * THE ROLE OF THIS FUNCTION IS MINUTE INITIALIZATION
   * @author YOUNESS FATHI
   */
  initMinuteParams() {
    this.minuteDD = getCurrentUTCDate().getMinutes();
    this.defaultStartMinute = this.minuteDD;
    this.defaultEndMinute = this.minuteDD;
  }
  /**
   * THE ROLE OF THIS FUNCTION IS HOUR INITIALIZATION
   * @author YOUNESS FATHI
   */
  initHourParams() {
    this.hourDD = new Date().getHours();
    this.defaulStarttHours = this.hourDD;
    this.defaulEndtHours = this.hourDD;
  }

  initUserAffectationTask() {
    if (this.task.assignee != null && this.task.assignee.length !== 0) {
      this.getSelectedUserIfAssigneeColunmNotNull();
    } else {
      if (this.isValidateCandidateStarterUser()) {
        this.getCurrentUser();
      } else {
        if (this.isValidateCandidateGroup()) {
          this.getReferents();
        } else {
          if (!isNullOrUndefined(this.task.candidateStarterGroup[0]) && this.task.candidateStarterGroup[0].length !== 0) {
            this.getSelectUserByOtherRole();
          } else {
            this.setSelectedUser(null);
          }
        }
      }
    }
  }
  getSelectUserByCandidateGroup() {
  
    const clonedUsers = this.users.slice();
    const candidateGroupAsString = this.task.candidateStarterGroup[0];
    const referent = this.getReferentByRole(candidateGroupAsString);
    if (isNullOrUndefined(referent)) {
      const role = this.task.candidateStarterGroup[0];
      this.userService.getUserByRole(role).subscribe(
          (user) => this.getSelectedUser(user),
          (error) => console.log('error', error),
          () => {
            this.users = this.filterUsersByRole(role);
            this.formGroupChange.emit(this.taskForm);
            this.cancelCreation.emit(false);
          }
    );    
    } else {
      this.userSelected = clonedUsers.filter(
        (x) => x.ftUniversalId === referent.ftUniversalId
      )[0];
      this.setSelectedUser(this.userSelected);
      this.users = this.filterUsersByRole(candidateGroupAsString);
      this.formGroupChange.emit(this.taskForm);
      this.cancelCreation.emit(false);
    }

  }
  
  setSelectedUser(userSelected: UserVO) {
    if (!isNullOrUndefined(userSelected)) {
      this.taskForm.get('assignedTo').setValue(userSelected);
    } else {
      this.taskForm.get('assignedTo').setValue(null);
    }
  }
  filterUsersByRole(candidateGroupAsString: string): UserVO[] {
    return this.users.filter((user) =>
      user.roleNamesAsString.indexOf(candidateGroupAsString) !== -1
    );
  }
  getReferentByRole(candidateGroupAsString: string): CustomerReferentLight {
    let referent: CustomerReferentLight;
    switch (candidateGroupAsString) {
      case 'COACH':
        referent = this.referents.filter(
          (referent) => referent.roleId === CONSTANTS.ROLE_COACH
        )[0];
        console.log('COACH');
        break;
      case 'DESK':
        referent = this.referents.filter(
          (referent) => referent.roleId === CONSTANTS.ROLE_DESK
        )[0];
        console.log('DESK');
        break;
      case 'VENTE':
        referent = this.referents.filter(
          (referent) => referent.roleId === CONSTANTS.ROLE_ADHESION
        )[0];
        console.log('VENTE');
        break;
      default:
        referent = null;
    }
    return referent;
  }
  isValidateCandidateGroup() {
    return (
      this.task.candidateStarterGroup[0] === 'COACH' ||
      this.task.candidateStarterGroup[0] === 'DESK' ||
      this.task.candidateStarterGroup[0] === 'VENTE'
    );
  }
  isValidateCandidateStarterUser() {
    return (
      this.task.candidateStarterUser != null &&
      this.task.candidateStarterUser.length > 0 &&
      this.task.candidateStarterUser[0] === 'currentUser'
    );
  }
  getSelectUserByOtherRole() {
    const role = this.task.candidateStarterGroup[0];
    if (!this.princeplCondidateGroup.includes(role)) {
      if(isNullOrUndefined(this.users) || this.users.length === 0){
        this.userService.getUserByRole(role).subscribe(
          (user) => { 
            this.users = [user] ;
            this.getUserSelected(user);
          },
        (error) => console.log('error', error),
        () => {
          console.log('complete');
          this.formGroupChange.emit(this.taskForm);
          this.cancelCreation.emit(false);
        }
          );
      }else{
        this.userService.getUserByRole(role).subscribe(
          (user) => {
            this.getSelectedUser(user);
            this.users = this.filterUsersByRole(role);
            if(!this.userSelected){
              this.createAndPushUserInFormular(user);
            }else{
              if(this.userSelected.roleNamesAsString && !this.userSelected.roleNamesAsString.includes(role)){
                this.users.push(this.userSelected);
              }
            }
          },
          (error) => console.log('error', error),
          () => {
            console.log('complete');
            this.formGroupChange.emit(this.taskForm);
            this.cancelCreation.emit(false);
          }
        );  
    }
  }
}
  createAndPushUserInFormular(user: any) {
    if(user){
      this.userSelected = {} as UserVO;
      this.userSelected.ftUniversalId = user.ftUniversalId;
      this.userSelected.firstName = user.firstName;
      this.userSelected.lastName = user.lastName;
      this.userSelected.id = user.id;
      this.users.push(this.userSelected);
      this.setSelectedUser(this.userSelected);
    }
  }
  getUserSelected(user: any) {
    if (user) {
      this.setSelectedUser(user);
    }
  }
  getSelectedUser(user: any) {
    const clonedUsers = this.users.slice();
    if (user) {
      this.userSelected = clonedUsers.filter(
        (x) => x.ftUniversalId === user.ftUniversalId
      )[0];
      this.setSelectedUser(this.userSelected);
    }
  }
  getCurrentUser() {
    const clonedUsers = this.users.slice();
    this.userSelected = clonedUsers.filter(
      (x) => x.ftUniversalId === this.currentUserCUID
    )[0];
    this.setSelectedUser(this.userSelected);
  }
  getSelectedUserIfAssigneeColunmNotNull() {
    const clonedUsers = this.users.slice();
    // TODO poser la question sur la priorisation des differents cas s'il sont tous mentionnes
    this.userSelected = clonedUsers.filter(
      (x) => x.ftUniversalId === this.task.assignee
    )[0];
  
    this.setSelectedUser(this.userSelected);
  }

  createFormGroup(): FormGroup {
    const date = new Date();
    console.log(date);
    const startDate = new Date();
    const endDate = startDate.setDate(startDate.getDate() + 1);
    return this.fb.group({
      startDate: this.fb.control(new Date()),
      endDate: this.fb.control(new Date(endDate)),
      userToNotify: this.fb.control(null),
      isPriority: this.fb.control(this.priorityValue(this.task.priority)),
      inChargeOf: this.fb.control(null),
      assignedTo: this.fb.control(null, [Validators.required]),
      description: this.fb.control(this.task.description)
    });
  }

  setRequestId(requestId: number) {
    this.requestResultId = requestId;
  }

  createTask(): void {
    if (this.taskForm.valid) {
      this.formSubmitted.emit(true);
      const datePattern = 'dd/MM/yyyy HH:mm';
      const dateCreation = new Date();
      const startDateToSend: Date = this.getDate(this.taskForm.get('startDate').value, this.hourDD, this.minuteDD);
      const endDateToSend: Date = this.getDate(this.taskForm.get('endDate').value, this.echeanceHour, this.echeanceMinute);
      this.newTask = {
        id: null,
        startDate: startDateToSend,
        startDateAsString: this.datePipe.transform(startDateToSend, datePattern),
        endDate: endDateToSend,
        endDateAsString: this.datePipe.transform(endDateToSend, datePattern),
        isPriority: this.taskForm.value.isPriority,
        inChargeOfId: this.taskForm.value.inChargeOf.id,
        assignedToId: this.taskForm.value.assignedTo.id,
        userIdToNotify: this.taskForm.value.userToNotify
          ? this.taskForm.value.userToNotify.id
          : 0,
        description: this.taskForm.value.description,
        requestId: null,
        customerId: this.customerId,
        createdById: this.currentUserId,
        resolutionDuration: 0,
        thetisTaskId: this.task.id,
        statut: null,
        resolutionComment: null,
        closedById: null,
        label: this.task.name,
        name: null,
        createDate: dateCreation,
        resolutionStatus: null,
        initialisationProcedures: this.task.initialisationProcedures,
        traitementProcedures: this.task.traitementProcedures,
        createDateAsString: this.datePipe.transform(dateCreation, datePattern),
        dispalyEndDate: null
      };
      console.log('created task ' , this.newTask );
      console.log(this.requestResultId);

      this.newTask.requestId = this.requestResultId;
      this.taskService.addTask(this.newTask).subscribe((newTask) => {
        this.isTaskCreated.emit(true);
        this.onSubmittedChange.emit(true);
      });
    }
  }

  onChangeTimeDD(time: string): void {
    this.hourDD = Number(time.substring(0, 2));
    this.minuteDD = Number(time.substring(4, 7));
  }

  onChangeTimeEcheance(time: string): void {
    this.echeanceHour = Number(time.substring(0, 2));
    this.echeanceMinute = Number(time.substring(4, 7));
  }

  getDate(date: Date, hour: number, min: number): Date {
    return new Date(
      date.getFullYear(), date.getMonth(), date.getDate(), hour, min
    );
  }

  priorityValue(priority: number): boolean {
    if (priority === 1) {
      return true;
    }
    if (priority === 0) {
      return false;
    }
  }
}
