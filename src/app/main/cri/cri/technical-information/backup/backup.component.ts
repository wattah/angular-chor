import { generateRandomString } from './../../../../../_core/utils/string-utils';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InterventionBackupNas } from './../../../../../_core/models/cri/intervention-bckup-nas';
import { Component, OnInit, Output, OnChanges, SimpleChanges, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss']
})
export class BackupComponent implements OnInit , OnChanges {
  @Input() index: number;
  @Input() interventionBackupNas: InterventionBackupNas;
  @Input() interventionBackupNasListLength: number;
  @Input() allowedToModifyTechnicalInformationTab;
  @Output() onRemoveBackup = new EventEmitter<number>();
  form: FormGroup;
  isAppelRandomName: string;
  isWindowsRandomName: string;
  isDsmRandomName: string;
  constructor(private readonly formBuilder: FormBuilder) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['interventionBackupNas'] && this.interventionBackupNas){
      this.form = this.buildForm();
    }
    if(this.form){
      this.setRestrictions();
    }
  }

  ngOnInit() {
    this.isAppelRandomName = generateRandomString(5);
    this.isWindowsRandomName = generateRandomString(5);
    this.isDsmRandomName = generateRandomString(5);
    this.setType();
    this.observeType();
    this.setRestrictions();
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      isApple: this.formBuilder.control(this.interventionBackupNas.isApple),
      isWindows: this.formBuilder.control(this.interventionBackupNas.isWindows),
      isDsm: this.formBuilder.control(this.interventionBackupNas.isDsm),
      description: this.formBuilder.control(this.interventionBackupNas.description),
      compteUserUtilise: this.formBuilder.control(this.interventionBackupNas.compteUserUtilise),
      motDePasse: this.formBuilder.control(this.interventionBackupNas.motDePasse),
      utilitaireUtilise: this.formBuilder.control(this.interventionBackupNas.utilitaireUtilise),
      dossierPartage: this.formBuilder.control(this.interventionBackupNas.dossierPartage),
    });
  }

  setRestrictions(){
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.form.disable();
    }else{
      this.form.enable();
    }
  }

  setType() {
    if(this.interventionBackupNas.isApple){
      this.form.get('isApple').setValue('isApple');
    }
    if(this.interventionBackupNas.isWindows){
      this.form.get('isApple').setValue('isWindows');
    }
    if(this.interventionBackupNas.isDsm){
      this.form.get('isApple').setValue('isDsm');
    }
  }

  observeType() {
    this.form.get('isApple').valueChanges.subscribe(
      (data)=>{
        switch(data){
          case 'isApple':
            this.interventionBackupNas.isApple = true;
            this.interventionBackupNas.isWindows = false;
            this.interventionBackupNas.isDsm = false;
          break;
          case 'isWindows':
            this.interventionBackupNas.isApple = false;
            this.interventionBackupNas.isWindows = true;
            this.interventionBackupNas.isDsm = false;
          break;
          case 'isDsm':
            this.interventionBackupNas.isApple = false;
            this.interventionBackupNas.isWindows = false;
            this.interventionBackupNas.isDsm = true;
          break;
        }
      }
    );
  }

  removeBackup(){
    this.onRemoveBackup.emit(this.index-1);
  }

}
