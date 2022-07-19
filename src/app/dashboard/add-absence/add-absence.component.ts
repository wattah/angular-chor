import { fullNameFormatter } from './../../_core/utils/formatter-utils';
import { Component, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { TitleServices } from './../../_core/services/title-services.service';
import { AddAbsenceCancelPopUpComponent } from '../add-absence-cancel-pop-up/add-absence-cancel-pop-up.component';
import { ApplicationUserVO } from '../../_core/models/application-user';
import { AuthTokenService } from '../../_core/services/auth_token';
import { UserVo } from '../../_core/models';
import { AbsenceService } from '../../_core/services/absence.service';
import { AbsenceVO } from '../../_core/models/AbsenceVO';
import { isNullOrUndefined } from '../../_core/utils/string-utils';
import { ConfirmationDialogService } from '../../_shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-add-absence',
  templateUrl: './add-absence.component.html',
  styleUrls: ['./add-absence.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddAbsenceComponent implements OnInit {

  /*-------- Auto-completion lists------*/
  interimList = [];
  personList;

  /*-------- Auto-completion filters------*/
  filteredInterim: Observable<UserVo[]>;
  filteredPerson: Observable<UserVo[]>;

  /*-------- Auto-completion lists controls------*/
  interimControl = new FormControl();
  personControl = new FormControl();

  @Output() onFormGroupChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() onSubmittedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCanceledChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  isValid = false;
  addAbsenceForm: FormGroup;

  users;
  title: any;
  connectedUser: ApplicationUserVO = {} as ApplicationUserVO;
  defaultUser: UserVo = {} as UserVo;
  userSelected: UserVo = {} as UserVo;
  isBackup = false;
  hasRight = false;
  newAbsence = {} as AbsenceVO;
  editAbsence: AbsenceVO = {} as AbsenceVO;

  hourStartDate = 0;
  minuteStartDate = 0; 
  hourEndDate = 0;
  MinuteEndDate = 0;
  startHour = 0;
  startMinute = 0;
  hour: number;
  minute: number;
  dateDebut: Date;
  dateFin: Date;
  minDate: Date;
  person: any;
  interim: any;
  isMyAbsenceChecked = true;

  constructor(private readonly fb: FormBuilder, private readonly absenceService: AbsenceService,
    private readonly route: ActivatedRoute, readonly modalService: NgbModal,
    private readonly _snackBar: MatSnackBar, private readonly authTokenService: AuthTokenService, readonly router: Router,
    readonly datePipe: DatePipe, readonly confirmationDialogService: ConfirmationDialogService,
    private readonly titleServices: TitleServices) {
    this.constructTitlePage();
    this.addAbsenceForm = this.createFormGroup();

    if ( this.title === 'Modification d\'une absence' ) {
      this.editAbsence = this.absenceService.getAbsenceToEdit();
    }
  }

  radioIsBackupChangeHandler(event: any): void {
    if (event.target.value === 'else') {
      this.isBackup = true;
      this.personControl.setValue('');
    } else {
      this.isBackup = false;
      this.personControl.setValue(this.userSelected);
    }
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      isBackup: this.fb.control(null),
      startDate: this.fb.control(new Date(), [Validators.required]),
      endDate: this.fb.control(new Date(), [Validators.required]),
      interimControl: this.fb.control(null),
      personControl: this.fb.control([Validators.required])
    });
  }

  prepareObjectForSave(): void {
    const datePattern = 'dd/MM/yyyy HH:mm';
    if ( this.route.snapshot.queryParams['name'] === 'edit' && !isNullOrUndefined(this.editAbsence.id)) {
      this.newAbsence.id = this.editAbsence.id;
    }
    this.newAbsence.beginDate = new Date(this.addAbsenceForm.get('startDate').value); 
    this.newAbsence.beginDate.setHours(this.startHour);
    this.newAbsence.beginDate.setMinutes(this.startMinute);
    this.newAbsence.beginDateStr = this.datePipe.transform(this.newAbsence.beginDate, datePattern);
    this.newAbsence.endDate = new Date(this.addAbsenceForm.get('endDate').value);
    this.newAbsence.endDate.setHours(this.hourStartDate);
    this.newAbsence.endDate.setMinutes(this.MinuteEndDate); 
    this.newAbsence.endDateStr = this.datePipe.transform(this.newAbsence.endDate, datePattern);
    this.newAbsence.userId = this.getUserById(this.personControl.value.id);
    this.newAbsence.userName = this.personControl.value.lastName;
    this.newAbsence.backupId = this.getBackUpById(this.interimControl.value.id);
    this.newAbsence.backupName = this.interimControl.value.lastName;
  }

  cancel(): void {
    this.modalService.open(AddAbsenceCancelPopUpComponent, { centered: true });
  }

  save(): void {
    this.prepareObjectForSave();
    this.absenceService.saveAbsence(this.connectedUser.coachId, this.newAbsence).subscribe(data => { 
      if ( !isNullOrUndefined(data)) {
        this.openSnackBar('Votre absence a bien été enregistrée.', undefined); 
      }
    },
    (error) => {
      console.error('Error: RequestMonitoring: ', error);
      this.openConfirmationDialog();
      return of(null);
    }); 
    this.router.navigateByUrl('/absence-monitoring');
  }

  openConfirmationDialog(): any {
    const title = 'Erreur!';
    const comment = 'Erreur Serveur : Il existe déjà une absence déclarée sur la période indiquée';
    const btnOkText = 'OK';
    this.confirmationDialogService.confirm(title, comment, btnOkText, null, 'lg', false)
    .then((confirmed) => console.log('User confirmed:', confirmed))
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  saveAndNew(): void {
    this.prepareObjectForSave();
    this.absenceService.saveAbsence(this.connectedUser.coachId, this.newAbsence).subscribe(response => {
      if ( !isNullOrUndefined(response)) {
        this.openSnackBar('Votre absence a bien été enregistrée.', undefined); 
      }
    },
    (err) => {
      console.error('Error! ', err);
      this.openConfirmationDialog();
      return of(null);
    },
    () => {
      this.initDefaultValues();
      if (!this.isBackup) {
        this.personControl.setValue(this.userSelected);
      } else {
        this.personControl.setValue('');
      }
    });
  }

  getUserById(id: number): number {
    if ( this.checkUserConnectedAndBackup(id)) {
      return id;
    }
    return this.connectedUser.coachId;
  }

  getBackUpById(id: number): number {
    if (id !== this.defaultUser.id) {
      return id;
    }
      return this.defaultUser.id;
  }

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['center-snackbar', 'snack-bar-container']
    });
  }

  onChangeTimeStart(time: any): void {
    this.startHour = Number(time.substring(0, 2));
    this.startMinute = Number(time.substring(4, 7));
    this.hourEndDate = this.hourStartDate;
    this.MinuteEndDate = this.minuteStartDate;
  }

  onChangeTimeEnd(time: any): void {
    this.hourStartDate = Number(time.substring(0, 2));
    this.minuteStartDate = Number(time.substring(4, 7));
    this.hourEndDate = Number(time.substring(0, 2));
    this.MinuteEndDate = Number(time.substring(4, 7));
  }

  sortUser(userA: ApplicationUserVO, userB: ApplicationUserVO): number {
    const userNameA = fullNameFormatter(null , userA.firstName , userA.lastName);
    const userNameB = fullNameFormatter(null , userB.firstName , userB.lastName);
    if (userNameA > userNameB) {
      return 1;
    }
    if (userNameA < userNameB) {
      return -1;
    }
    return 0;
  }

  initDefaultValues(): void {

    this.defaultUser.name = 'Tous';
    this.defaultUser.id = 0;
    this.defaultUser.firstName = 'Tous';
    this.defaultUser.lastName = '';

    this.connectedUser = this.authTokenService.applicationUser;
    this.userSelected.name = this.connectedUser.lastName.concat(' ') + this.connectedUser.firstName;
    this.userSelected.id = this.connectedUser.coachId;

    this.addAbsenceForm.get('startDate').valueChanges
    .subscribe( data => {
      if ( data ) {
        this.minDate = data;
        this.addAbsenceForm.get('endDate').setValue(data);
      }
    });

    if ( this.connectedUser.activeRole.roleName === 'MANAGER' || this.connectedUser.activeRole.roleName === 'ADMINISTRATEUR') {
      this.hasRight = true;
    }

    if ( this.editAbsence && !isNullOrUndefined(this.editAbsence.userName) ) {
      this.isBackup = this.checkUserConnectedAndBackup(this.editAbsence.userId);
      this.isMyAbsenceChecked = !this.isBackup;
      this.startHour = Number(this.editAbsence.beginDateFormatted.substring(11, 13));
      this.startMinute = Number(this.editAbsence.beginDateFormatted.substring(14, 16));
      this.hourStartDate = Number(this.editAbsence.endDateFormatted.substring(11, 13));
      this.minuteStartDate = Number(this.editAbsence.endDateFormatted.substring(14, 16));
      this.addAbsenceForm.get('startDate').setValue(new Date(this.editAbsence.beginDate));
      this.addAbsenceForm.get('endDate').setValue(new Date(this.editAbsence.endDate));
      this.minDate = new Date(this.editAbsence.beginDate);
    
      this.getDefaultAbsentPerson(this.editAbsence.userId);
      if ( this.route.snapshot.queryParams['name'] === 'edit' && isNullOrUndefined(this.editAbsence.backupName)) {
        this.getUserInterimByUserId(this.editAbsence.userId);
      } else {
        this.getUserInterimByUserId(this.editAbsence.backupId); 
      }
    } else {
      this.addAbsenceForm.get('startDate').setValue(new Date());
      this.interimControl.setValue(this.defaultUser);
      this.isMyAbsenceChecked = true;
    }
  }

  onSelectStartDate(event: void): void {
    if (this.dateFin < this.addAbsenceForm.get('startDate').value) {
      this.addAbsenceForm.get('endDate').setValue(new Date(new Date(this.addAbsenceForm.get('startDate').value)
      .setDate(this.addAbsenceForm.get('startDate').value.getDate())));
      this.minDate = new Date(this.addAbsenceForm.get('startDate').value);
    }
  }

  constructTitlePage(): void {
    if (this.route.snapshot.queryParams['name'] === 'add') {
      this.title = 'Déclarer une absence';
    } else if (this.route.snapshot.queryParams['name'] === 'edit') {
      this.title = 'Modification d\'une absence';
    }
  }

  ngOnInit(): void {

    this.personControl.setValue(this.userSelected);
    this.interimList = this.interimList.concat(this.defaultUser);
    this.onFormGroupChange.emit(this.addAbsenceForm);
    this.onSubmittedChange.emit(false);
    this.onCanceledChange.emit(false);
    
    this.route.data.subscribe((resolvedData) => {
      this.users = resolvedData['users'];
      this.users.sort((userA, userB) => this.sortUser(userA, userB));
      this.interimList = this.interimList.concat(this.users);
      this.personList = this.users;
    });

    for (let i = 0; i < this.interimList.length; i++) { 
      if ( this.interimList[i].id === this.userSelected.id) {
        this.interimList.splice(i, 1);
      }
    }

    for (let i = 0; i < this.personList.length; i++) { 
      if ( this.personList[i].id === this.userSelected.id) {
        this.personList.splice(i, 1);
      }
    }

    /*------------------Filtre sur liste des intérims ---------------------------*/
    this.filteredInterim = this.interimControl.valueChanges
      .pipe(
        startWith(''),
        map(option => option ? this._filterInterim(option) : this.interimList.slice())
      );

      /*------------------Filtre sur liste des personnes ---------------------------*/
    this.filteredPerson = this.personControl.valueChanges
    .pipe(
      startWith(''),
      map(option => option ? this._filterPerson(option) : this.personList.slice())
    );

    this.initDefaultValues();
    this.titleServices.setTitle('Athena');
  }

  private _filterInterim(value: string): string[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    if (this.interimList !== null) {
      this.interimList = this.interimList.filter(el => {
        return el.lastName !== null;
      });
    }
    return this.interimList.filter(option => option.lastName !== undefined)
    .filter(option => option.lastName.toLowerCase().indexOf(filterValue) === 0 && option.lastName !== 'Tous');
  }

  private _filterPerson(value: string): string[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    if (this.personList !== null) {
      this.personList = this.personList.filter(el => {
        return el.lastName !== null;
      });
    }
    return this.personList.filter(option => option.lastName !== undefined)
    .filter(option => option.lastName.toLowerCase().indexOf(filterValue) === 0);
  }

  displayUser(user: UserVo): string {
    return user ? fullNameFormatter(null , user.firstName , user.lastName , ' ').trim() : '';
  }

  getUserInterimByUserId(userId: number): boolean {
    for(const data of this.interimList) {
      if(!isNullOrUndefined(data) && data.id === userId) {
        this.interimControl.setValue(data); 
        return true;
      }
    }
    this.interimControl.setValue(this.defaultUser);
    return false;
  }

  getDefaultAbsentPerson(id: number): boolean {
    for(const data of this.personList) {
      if(!isNullOrUndefined(data) && data.id === id) {
        this.personControl.setValue(data);
        return true;
      }
    }
    return false;
  }

  checkUserConnectedAndBackup(userId: number): boolean {
    return !isNullOrUndefined(this.connectedUser) && this.connectedUser.coachId !== userId;
  }
}
