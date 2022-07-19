import { generateRandomString } from './../../../../../_core/utils/string-utils';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InterventionComptesUsersNas } from './../../../../../_core/models/cri/intervention-comptes-users-nas';
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormsService } from '../forms.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit , OnChanges {
  @Input() index: number
  @Input() interventionComptesUsersNas: InterventionComptesUsersNas;
  @Input() interventionComptesUsersNasListLength: number;
  @Input() allowedToModifyTechnicalInformationTab;
  @Output() onRemoveUser = new EventEmitter<number>();
  @Input() tabchangedOrSave;
  @Input() isVisibleNASBlock;
  @Input() isManadatoryFields: boolean;
  form: FormGroup;
  isAdminRandomName: string;
  isUserRandomName: string;
  //VALIDATION FIELD
  nomInvalid = false;
  loginInvalid = false;
  passwordInvalid = false;
  emailInvalid = false;
  typeUserInvalid = false;
  isRequired = false;
  constructor(private readonly formBuilder: FormBuilder,
              private readonly formsService: FormsService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['interventionComptesUsersNas'] && this.interventionComptesUsersNas){
      this.form = this.buildForm();
      this.formsService.usersNas.push(this.form);
    }

    if(changes['isManadatoryFields'] && this.isManadatoryFields){
      this.initValidators();
      this.isRequired = true;
      this.formsService.setRestrictionOnFormFields(this.form);
    }
    if(changes['isManadatoryFields'] && !this.isManadatoryFields){
      this.isRequired = false;
      this.initValidators();
      this.formsService.clearRestrictionOnFormFields(this.form);
    }
    if(changes['tabchangedOrSave']){
      console.log('isVisibleNASBlock ',this.isVisibleNASBlock)
      if(this.isVisibleNASBlock){
        this.initValidators();
        this.validateUserNas(this.form);
      } 
    }
    this.setRestrictions();
  }

  ngOnInit() {
    this.isAdminRandomName = generateRandomString(5);
    this.isUserRandomName = generateRandomString(5);
    this.observeUser();
    this.setRestrictions();
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      nom: this.formBuilder.control(this.interventionComptesUsersNas.nom),
      login: this.formBuilder.control(this.interventionComptesUsersNas.login),
      password: this.formBuilder.control(this.interventionComptesUsersNas.password),
      email: this.formBuilder.control(this.interventionComptesUsersNas.email),
      isAdmin: this.formBuilder.control(this.interventionComptesUsersNas.isAdmin),
      isUser: this.formBuilder.control(this.interventionComptesUsersNas.isUser)
    });
  }

  setRestrictions(){
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.form.disable();
    }else{
      this.form.enable();
    }
  }

  removeUser(){
    this.onRemoveUser.emit(this.index-1);
  }

  observeUser() {
    this.form.get('isAdmin').valueChanges.subscribe(
      (isAdmin)=> {
        this.interventionComptesUsersNas.isAdmin = isAdmin;
        this.interventionComptesUsersNas.isUser = !isAdmin;
      }
    );
  }

//==============================validation ======================================
validateUserNas(form){ 
  const controls = form.controls;
  let isUser = false;
  let isAdmin = false;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
              case 'nom':
                this.nomInvalid = true;
              break;
              case 'login':
              this.loginInvalid = true;
              break;
              case 'password':
              this.passwordInvalid = true;
              break;
              case 'email':
              this.emailInvalid = true;
              break;
              case 'isUser':
                isUser = true;
              break;
              case 'isAdmin':
                isAdmin = true;
              default:
              console.log('valide user nas');
               break;}}
          }  

      if(isUser && isAdmin){
        this.typeUserInvalid = true
      }
    }
    
initValidators(){
  this.nomInvalid = false;
  this.loginInvalid = false;
  this.passwordInvalid = false;
  this.emailInvalid = false;
  this.typeUserInvalid = false;}

}
