import { FormsService } from './../forms.service';
import { InterventionBackupNas } from './../../../../../_core/models/cri/intervention-bckup-nas';
import { InterventionComptesUsersNas } from './../../../../../_core/models/cri/intervention-comptes-users-nas';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InterventionNas } from './../../../../../_core/models/cri/intervention_nas';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-nas',
  templateUrl: './nas.component.html',
  styleUrls: ['./nas.component.scss']
})
export class NasComponent implements OnInit , OnChanges{  
  @Input() interventionNas: InterventionNas;
  @Input() isManadatoryFields: boolean;
  @Input() allowedToModifyTechnicalInformationTab;
  @Output() onAddAutreStation = new EventEmitter<boolean>();
  @Output() onRemoveOtherStation = new EventEmitter<number>();
  @Output() onRemoveUser = new EventEmitter<number>();
  @Output() onAddUser = new EventEmitter<boolean>();
  @Output() onRemoveBackup = new EventEmitter<number>();
  @Output() onAddBackup = new EventEmitter<boolean>();
  form: FormGroup;
  interventionComptesUsersNasList: InterventionComptesUsersNas[];
  interventionBackupNasList: InterventionBackupNas[];
  isVisibileBackupBlock = false;
  @Input() tabchangedOrSave;
  @Input() isVisibleNASBlock;
  //Validation FIELD
  modeleInvalid = false;
  ddnsInvalid = false;
  quickconnectInvalid = false;
  nbDiskInvalid = false;
  idSynoInvalid = false;
  capaciteDiskInvalid = false;
  mdpSynoInvalid = false;
  isRequired = false;
  constructor(private readonly formBuilder: FormBuilder ,
  			  private readonly formsService: FormsService,
              private readonly notificationService: NotificationService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['interventionNas'] && this.interventionNas){
      this.interventionComptesUsersNasList = this.interventionNas.interventionComptesUsersNas;
      this.interventionBackupNasList = this.interventionNas.interventionBackupNas;
      this.form = this.buildForm();
      this.isVisibileBackupBlock = this.interventionNas.isBackup;
      this.observeIsBackup();
      this.formsService.nasForms.push(this.form);
    }
    if(changes['isManadatoryFields'] && this.isManadatoryFields){
      this.initValidators();
      this.isRequired = true;
      this.formsService.setRestrictionOnFormFields(this.form);
    }
    if(changes['isManadatoryFields'] && !this.isManadatoryFields){
      this.initValidators();
      this.isRequired = false;
      this.formsService.clearRestrictionOnFormFields(this.form);
    }
    if(changes['tabchangedOrSave']){
      console.log('isVisibleNASBlock ',this.isVisibleNASBlock)
      if(this.isVisibleNASBlock){
        this.initValidators();
        this.validateNas(this.form);
      } 
    }
    this.setRestrictions();

  }

  ngOnInit() {
    this.interventionComptesUsersNasList = this.interventionNas.interventionComptesUsersNas;
    this.interventionBackupNasList = this.interventionNas.interventionBackupNas;
    this.isVisibileBackupBlock = this.interventionNas.isBackup;
    this.observeIsBackup();
    this.setRestrictions();
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      modele: this.formBuilder.control(this.interventionNas.modele),
      ddns: this.formBuilder.control(this.interventionNas.ddns),
      quickconnect: this.formBuilder.control(this.interventionNas.quickconnect),
      nbDisk: this.formBuilder.control(this.interventionNas.nbDisk),
      idSyno: this.formBuilder.control(this.interventionNas.idSyno),
      capaciteDisk: this.formBuilder.control(this.interventionNas.capaciteDisk),
      mdpSyno: this.formBuilder.control(this.interventionNas.mdpSyno),
      comment: this.formBuilder.control(this.interventionNas.comment),
      isBackup: this.formBuilder.control(this.interventionNas.isBackup)
    });
  }

  setRestrictions(){
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.form.disable();
    }else{
      this.form.enable();
    }
  }

  onAddAutreStationEvent(event){
    this.onAddAutreStation.emit(true);
  }

  onRemoveOtherStationEvent(index){
    this.onRemoveOtherStation.emit(index);
  }

  onRemoveUserEvent(index){
    this.onRemoveUser.emit(index);
    this.interventionComptesUsersNasList = this.interventionNas.interventionComptesUsersNas;
  }

  addUser(event){
    event.preventDefault();
    this.onAddUser.emit(true);
  }

  onRemoveBackupEvent(index){
    this.onRemoveBackup.emit(index);
  }
  addBackup(event){
    event.preventDefault();
    this.onAddBackup.emit(true);
    this.interventionBackupNasList = this.interventionNas.interventionBackupNas;
  }

  observeIsBackup() {
    this.form.get('isBackup').valueChanges.subscribe(
      (isBackup)=> {
        if(this.form.get('isBackup').dirty){
          this.notificationService.setIsFromCriAndCriChange(true);
        }
        this.interventionNas.isBackup = isBackup;
        this.isVisibileBackupBlock = isBackup;
      }
    );
  }
  
  observeNas(){
    this.form.valueChanges.subscribe(
      (value)=> {
        if(this.form.dirty){
          console.log('observeNas');
          this.notificationService.setIsFromCriAndCriChange(true);
        }
      }
    );
  }

//==============================validation ======================================
  validateNas(form){ 
    const controls = form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
          switch (name) {
            case 'modele':
              this.modeleInvalid = true;
            break;
            case 'ddns':
              this.ddnsInvalid = true;
            break;
            case 'quickconnect':
              this.quickconnectInvalid = true;
            break;
            case 'nbDisk':
              this.nbDiskInvalid = true;
            break; 
            case 'idSyno':
            this.idSynoInvalid = true;
            break; 
            case 'capaciteDisk':
            this.capaciteDiskInvalid = true;
            break;
            case 'mdpSyno':
            this.mdpSynoInvalid = true;
            break;
            default:
            console.log('valide Nas');
             break;}}
        }  
  }
  
  initValidators(){
    this.modeleInvalid = false;
    this.ddnsInvalid = false;
    this.quickconnectInvalid = false;
    this.nbDiskInvalid = false;
    this.idSynoInvalid = false;
    this.capaciteDiskInvalid = false;
    this.mdpSynoInvalid = false;
  }
}
