import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { CONSTANTS, CM_USAGE, CM_MEDIA_REF, ROLE_INTERLOCUTOR, PERSON_CATEGORY } from '../../../_core/constants/constants';
import { InterlocutorVO } from '../../../_core/models/interlocutor-vo';
import { ContactMethodService } from '../../../_core/services';
import { CmInterlocutorVO } from '../../../_core/models/cm-Interlocutor-vo';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { CmUsageVO } from '../../../_core/models/cm-usage-vo';
import { ReferenceDataVO } from '../../../_core/models/reference-data-vo';
import { firstNameFormatter, fullNameFormatter} from '../../../_core/utils/formatter-utils';




@Component({
  selector: 'app-usage-form',
  templateUrl: './usage-form.component.html',
  styleUrls: ['./usage-form.component.scss']
})
export class UsageFormComponent implements OnInit {

  categoryCustomer: string;
  typeCustomer: string;
  usageRefKey: string;
  @Input() creationMode = true;
  @Input() customerId;
  CM_MEDIA_REF = CM_MEDIA_REF;
  listUsagesCreated: string[];
  listUsagesNotCreated: any[] = [];
  interlocutors:InterlocutorVO[];
  adresses: CmInterlocutorVO[];
  fixes: CmInterlocutorVO[];
  mobiles: CmInterlocutorVO[];
  mails: CmInterlocutorVO[];
  usages: CmUsageVO[];
  usageFixe = {} as CmUsageVO;
  usageMobile = {} as CmUsageVO;
  usageMail = {} as CmUsageVO;
  usageAdresse = {} as CmUsageVO;
  isValidUsage = true;
  isValidMobileNum = true;
  isValidNums = true;
  isValidMail = true;
  isValidAdresse = true;
  isValidForm = true;
  result = false;
  isValidMobileInterloc = true;
  isValidMailInterloc = true;
  isValidAdrInterloc = true;
  showAsterix =  '';

  USAGE_REF_LIST = [
    { key: CM_USAGE.EVENT.key, label: CM_USAGE.EVENT.label},
    { key: CM_USAGE.BILLING.key, label: CM_USAGE.BILLING.label},
    { key: CM_USAGE.CONTRACTUAL_INFO.key, label: CM_USAGE.CONTRACTUAL_INFO.label},
    { key: CM_USAGE.DIRECT_MARKETING.key, label: CM_USAGE.DIRECT_MARKETING.label},
    { key: CM_USAGE.DEFAULT.key, label: CM_USAGE.DEFAULT.label}
  ];

  @Output() onFormGroupChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() onSubmittedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCanceledChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  form: FormGroup;
  separator = '\n';

  constructor( private readonly fb: FormBuilder, private readonly _snackBar: MatSnackBar,
    private readonly route: ActivatedRoute, private readonly router: Router,
    private readonly contactMethodService: ContactMethodService) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.usageRefKey = params.get('usageRefKey');
    });
    this.route.queryParamMap.subscribe( params => {
      this.categoryCustomer = params.get('typeCustomer');
      this.typeCustomer = ( params.get('typeCustomer') === CONSTANTS.TYPE_COMPANY) ? 'entreprise' : 'particular';
      
    });

    this.form = this.fb.group({
      usage: this.fb.control(null),
      fixeInterloc: this.fb.control(null),
      fixeNum: this.fb.control(null),
      mobileInterloc: this.fb.control(null),
      mobileNum: this.fb.control(null),
      mailInterloc: this.fb.control(null),
      mail: this.fb.control(null),
      adrInterloc: this.fb.control(null),
      address: this.fb.control(null)
    });
    this.onFormGroupChange.emit(this.form);
    
    this.route.data.subscribe(resolversData => {
      this.interlocutors = resolversData['interlocutors'];
      if(!isNullOrUndefined(this.interlocutors) &&  this.interlocutors.length>0){
        this.sortWithOrder(this.interlocutors);
      }
      if(this.creationMode){
        this.listUsagesCreated = resolversData['listUsages'];
        this.constructListUsagesNotCreated();
      } else {
        this.usages = resolversData['usages'];

        this.usageFixe = this.getUsageByCmMedia(this.usages, CM_MEDIA_REF.TEL_FIXE);
        this.putUsageFixe();
        
        this.usageMobile = this.getUsageByCmMedia(this.usages, CM_MEDIA_REF.TEL_MOBILE);
        this.putUsageMobile();
        
        this.usageMail = this.getUsageByCmMedia(this.usages, CM_MEDIA_REF.EMAIL);
        this.putUsageMail();

        this.usageAdresse = this.getUsageByCmMedia(this.usages, CM_MEDIA_REF.POSTAL_ADDRESS);
        this.putUsageAdresse();
      }
    });

    if (this.usageRefKey === CM_USAGE.DEFAULT.key) {
      this.showAsterix =  '*';
    }
  }

  sortWithOrder(data) {
    return data.sort(function (a, b) {
      if(!a.firstName && !b.firstName){
        return 0;
      } else if(!b.firstName && a.firstName){
        return 1;
      } else if(!a.firstName && b.firstName){
        return -1;
      } else{
        return  a.firstName.localeCompare(b.firstName);
      }
  });

    
  }

  fullNameFormatter(firstName: string, lastName: string): string {
    const separator = ' ';
    return (
      `${isNullOrUndefined(firstName) ? '-' : firstNameFormatter(firstName)}\
      ${separator}\
      ${isNullOrUndefined(lastName) ? '-' : lastName.toUpperCase()}`
    );
  }

  putUsageFixe(){
    if(!isNullOrUndefined(this.usageFixe) && !isNullOrUndefined(this.usageFixe.interlocutor.personId)){
      this.form.get('fixeInterloc').setValue(this.interlocutors.find((x) => x.personId === this.usageFixe.interlocutor.personId));
    }
    if(!isNullOrUndefined(this.form.get('fixeInterloc').value) && !isNullOrUndefined(this.form.get('fixeInterloc').value.personId)) {
      this.contactMethodService.getContactMethodsByRefMedia(this.form.get('fixeInterloc').value.personId, CM_MEDIA_REF.TEL_FIXE).subscribe(
        data => {
          this.fixes = data;
          this.form.get('fixeNum').setValue(this.fixes.find((x) => x.id === this.usageFixe.cmInterlocuteur.id));
        }
      );
    } else {
      this.usageFixe = {} as CmUsageVO;
    }
  }

  putUsageMobile(){
    if(!isNullOrUndefined(this.usageMobile)){
      this.form.get('mobileInterloc').setValue(this.interlocutors.find((x) => x.personId === this.usageMobile.interlocutor.personId));
      this.contactMethodService.getContactMethodsByRefMedia(this.form.get('mobileInterloc').value.personId, CM_MEDIA_REF.TEL_MOBILE).subscribe(
        data => {
          this.mobiles = data;
          this.form.get('mobileNum').setValue(this.mobiles.find((x) => x.id === this.usageMobile.cmInterlocuteur.id));
        }
      );
    }  else {
      this.usageMobile = {} as CmUsageVO;
    }
  }

  putUsageMail(){
    if(!isNullOrUndefined(this.usageMail)){
      this.form.get('mailInterloc').setValue(this.interlocutors.find((x) => x.personId === this.usageMail.interlocutor.personId));
      this.contactMethodService.getContactMethodsByRefMedia(this.form.get('mailInterloc').value.personId, CM_MEDIA_REF.EMAIL).subscribe(
        data => {
          this.mails = data;
          this.form.get('mail').setValue(this.mails.find((x) => x.id === this.usageMail.cmInterlocuteur.id));
        }
      );
    } else {
      this.usageMail = {} as CmUsageVO;
    }
  }

  putUsageAdresse(){
    if(!isNullOrUndefined(this.usageAdresse)){
      this.form.get('adrInterloc').setValue(this.interlocutors.find((x) => x.personId === this.usageAdresse.interlocutor.personId));
      this.contactMethodService.getContactMethodsByRefMedia(this.form.get('adrInterloc').value.personId, CM_MEDIA_REF.POSTAL_ADDRESS).subscribe(
        data => {
          this.adresses = data; 
          this.form.get('address').setValue(this.adresses.find((x) => x.id === this.usageAdresse.cmInterlocuteur.id));
        }
      );
    } else {
      this.usageAdresse = {} as CmUsageVO;
    }
  }

  isFixeNumChanged(){
    if(isNullOrUndefined(this.form.get('fixeNum').value) && !isNullOrUndefined(this.usageFixe) && !isNullOrUndefined(this.usageFixe.cmInterlocuteur) 
    || !isNullOrUndefined(this.form.get('fixeNum').value) && !isNullOrUndefined(this.usageFixe) && isNullOrUndefined(this.usageFixe.cmInterlocuteur)
    || !isNullOrUndefined(this.form.get('fixeNum').value) && isNullOrUndefined(this.usageFixe) && isNullOrUndefined(this.usageFixe.cmInterlocuteur)
    || !isNullOrUndefined(this.form.get('fixeNum').value) && !isNullOrUndefined(this.usageFixe.cmInterlocuteur) 
      && this.form.get('fixeNum').value.id !== this.usageFixe.cmInterlocuteur.id
     ){
      return true;
    } else {
      return false;
    }
  }

  isFixeInterlocChanged(){
    if(isNullOrUndefined(this.form.get('fixeInterloc').value) && !isNullOrUndefined(this.usageFixe) && !isNullOrUndefined(this.usageFixe.interlocutor) 
    || !isNullOrUndefined(this.form.get('fixeInterloc').value) && !isNullOrUndefined(this.usageFixe) && isNullOrUndefined(this.usageFixe.interlocutor)
    || !isNullOrUndefined(this.form.get('fixeInterloc').value) && isNullOrUndefined(this.usageFixe) && isNullOrUndefined(this.usageFixe.interlocutor)
    || !isNullOrUndefined(this.form.get('fixeInterloc').value) && !isNullOrUndefined(this.usageFixe.interlocutor) 
      && this.form.get('fixeInterloc').value.personId !== this.usageFixe.interlocutor.personId
     ){
      return true;
    } else {
      return false;
    }
  }

  isMobileNumChanged(){
    if(isNullOrUndefined(this.form.get('mobileNum').value) && !isNullOrUndefined(this.usageMobile) && !isNullOrUndefined(this.usageMobile.cmInterlocuteur) 
    || !isNullOrUndefined(this.form.get('mobileNum').value) && !isNullOrUndefined(this.usageMobile) && isNullOrUndefined(this.usageMobile.cmInterlocuteur)
    || !isNullOrUndefined(this.form.get('mobileNum').value) && isNullOrUndefined(this.usageMobile) && isNullOrUndefined(this.usageMobile.cmInterlocuteur)
    || !isNullOrUndefined(this.form.get('mobileNum').value) && !isNullOrUndefined(this.usageMobile.cmInterlocuteur) 
      && this.form.get('mobileNum').value.id !== this.usageMobile.cmInterlocuteur.id
     ){
      return true;
    } else {
      return false;
    }
  }

  isMobileInterlocChanged(){
    if(isNullOrUndefined(this.form.get('mobileInterloc').value) && !isNullOrUndefined(this.usageMobile) && !isNullOrUndefined(this.usageMobile.interlocutor) 
    || !isNullOrUndefined(this.form.get('mobileInterloc').value) && !isNullOrUndefined(this.usageMobile) && isNullOrUndefined(this.usageMobile.interlocutor)
    || !isNullOrUndefined(this.form.get('mobileInterloc').value) && isNullOrUndefined(this.usageMobile) && isNullOrUndefined(this.usageMobile.interlocutor)
    || !isNullOrUndefined(this.form.get('mobileInterloc').value) && !isNullOrUndefined(this.usageMobile.interlocutor) 
      && this.form.get('mobileInterloc').value.personId !== this.usageMobile.interlocutor.personId
     ){
      return true;
    } else {
      return false;
    }
  }

  isMailChanged(){
    if(isNullOrUndefined(this.form.get('mail').value) && !isNullOrUndefined(this.usageMail) && !isNullOrUndefined(this.usageMail.cmInterlocuteur) 
    || !isNullOrUndefined(this.form.get('mail').value) && !isNullOrUndefined(this.usageMail) && isNullOrUndefined(this.usageMail.cmInterlocuteur)
    || !isNullOrUndefined(this.form.get('mail').value) && isNullOrUndefined(this.usageMail) && isNullOrUndefined(this.usageMail.cmInterlocuteur)
    || !isNullOrUndefined(this.form.get('mail').value) && !isNullOrUndefined(this.usageMail.cmInterlocuteur) 
      && this.form.get('mail').value.id !== this.usageMail.cmInterlocuteur.id
     ){
      return true;
    } else {
      return false;
    }
  }

  isMailInterlocChanged(){
    if(isNullOrUndefined(this.form.get('mailInterloc').value) && !isNullOrUndefined(this.usageMail) && !isNullOrUndefined(this.usageMail.interlocutor) 
    || !isNullOrUndefined(this.form.get('mailInterloc').value) && !isNullOrUndefined(this.usageMail) && isNullOrUndefined(this.usageMail.interlocutor)
    || !isNullOrUndefined(this.form.get('mailInterloc').value) && isNullOrUndefined(this.usageMail) && isNullOrUndefined(this.usageMail.interlocutor)
    || !isNullOrUndefined(this.form.get('mailInterloc').value) && !isNullOrUndefined(this.usageMail.interlocutor) 
      && this.form.get('mailInterloc').value.personId !== this.usageMail.interlocutor.personId
     ){
      return true;
    } else {
      return false;
    }
  }

  isAdresseChanged(){
    if(isNullOrUndefined(this.form.get('address').value) && !isNullOrUndefined(this.usageAdresse) && !isNullOrUndefined(this.usageAdresse.cmInterlocuteur) 
    || !isNullOrUndefined(this.form.get('address').value) && !isNullOrUndefined(this.usageAdresse) && isNullOrUndefined(this.usageAdresse.cmInterlocuteur)
    || !isNullOrUndefined(this.form.get('address').value) && isNullOrUndefined(this.usageAdresse) && isNullOrUndefined(this.usageAdresse.cmInterlocuteur)
    || !isNullOrUndefined(this.form.get('address').value) && !isNullOrUndefined(this.usageAdresse.cmInterlocuteur) 
      && this.form.get('address').value.id !== this.usageAdresse.cmInterlocuteur.id
     ){
      return true;
    } else {
      return false;
    }
  }

  isAdresseInterlocChanged(){
    if(isNullOrUndefined(this.form.get('adrInterloc').value) && !isNullOrUndefined(this.usageAdresse) && !isNullOrUndefined(this.usageAdresse.interlocutor) 
    || !isNullOrUndefined(this.form.get('adrInterloc').value) && !isNullOrUndefined(this.usageAdresse) && isNullOrUndefined(this.usageAdresse.interlocutor)
    || !isNullOrUndefined(this.form.get('adrInterloc').value) && isNullOrUndefined(this.usageAdresse) && isNullOrUndefined(this.usageAdresse.interlocutor)
    || !isNullOrUndefined(this.form.get('adrInterloc').value) && !isNullOrUndefined(this.usageAdresse.interlocutor) 
      && this.form.get('adrInterloc').value.personId !== this.usageAdresse.interlocutor.personId
     ){
      return true;
    } else {
      return false;
    }
  }

  annuler(): void {
    //Cas de creation : si changement d'un interlocuteur automatiquement changement de contact
    //dou on ne fait le test que sur les interlocs
    if(this.creationMode){
      if(isNullOrUndefined(this.form.get('usage').value) 
      && isNullOrUndefined(this.form.get('fixeInterloc').value) 
      && isNullOrUndefined(this.form.get('mobileInterloc').value)
      && isNullOrUndefined(this.form.get('mailInterloc').value)
      && isNullOrUndefined(this.form.get('adrInterloc').value)){
        this.onCanceledChange.emit(false);
        this.onSubmittedChange.emit(true);
      } else {
        this.onCanceledChange.emit(true);
        this.onSubmittedChange.emit(false);

      }
    //Cas demofification, on a fait le test que sur les contacts car on peut toujours changer contact
    //sans changer d'interloc, dou la priorite est donne a contact pour faire simple
    } else {
      if(this.isFixeNumChanged() || this.isFixeInterlocChanged() || this.isMobileNumChanged() || this.isMobileInterlocChanged() 
      || this.isMailChanged() || this.isMailInterlocChanged() || this.isAdresseChanged() || this.isAdresseInterlocChanged()){
        this.onCanceledChange.emit(true);
        this.onSubmittedChange.emit(false);
      } else {
        this.onCanceledChange.emit(false);
        this.onSubmittedChange.emit(true);
      }
    }
  }

  constructListUsagesNotCreated(){
    for(const usageRef of this.USAGE_REF_LIST){
      let isNotExist = false;
      for(const usageRefCreated of this.listUsagesCreated){
        if(usageRefCreated === usageRef.key){
          isNotExist = true;
          break;
        }
      }
      if(!isNotExist){
        this.listUsagesNotCreated.push(usageRef);
      }
    }
    this.listUsagesNotCreated.sort((a, b) => a.label.localeCompare(b.label)); 
  }

  formatterRole(values: ReferenceDataVO[]): string {
    let result = '';
    if(!isNullOrUndefined(values)) {
      for(const role of values) {
        result += role.label;
        if(values.indexOf(role) < values.length - 1 ) {
          result += ', ';
        }
      }
    }
    if(this.categoryCustomer === 'particular') {
        return result.replace(ROLE_INTERLOCUTOR.ROLE_BENEFICIARE.value, 'Particulier');  
    }
    return result;
  }

  onSelectInterlocFixe(){
    const fixeInterloc = this.form.get('fixeInterloc').value;
    if(!isNullOrUndefined(fixeInterloc) && !isNullOrUndefined(fixeInterloc.personId) && !isNaN(fixeInterloc.personId)){
      this.contactMethodService.getContactMethodsByRefMedia(fixeInterloc.personId, CM_MEDIA_REF.TEL_FIXE).subscribe(
        data => {
          this.fixes = data;
          this.form.get('fixeNum').setValue(null);
        });
    } else {
      this.form.get('fixeNum').setValue(null); 
      this.fixes = null;
    }
  }

  onSelectInterlocMobile(){
    const mobileInterloc = this.form.get('mobileInterloc').value;
    if(!isNullOrUndefined(mobileInterloc) && !isNullOrUndefined(mobileInterloc.personId) && !isNaN(mobileInterloc.personId)){
      this.contactMethodService.getContactMethodsByRefMedia(mobileInterloc.personId, CM_MEDIA_REF.TEL_MOBILE).subscribe(
        data => {
          this.mobiles = data;
          this.form.get('mobileNum').setValue(null);
        });
    } else {
      this.form.get('mobileNum').setValue(null); 
      this.mobiles = null;
    }
  }

  onSelectInterlocMail(){
    const mailInterloc = this.form.get('mailInterloc').value;
    if(!isNullOrUndefined(mailInterloc) && !isNullOrUndefined(mailInterloc.personId) && !isNaN(mailInterloc.personId)){
      this.contactMethodService.getContactMethodsByRefMedia(mailInterloc.personId, CM_MEDIA_REF.EMAIL).subscribe(
        data => {
          this.mails = data;
          this.form.get('mail').setValue(null);
        });
    } else {
      this.form.get('mail').setValue(null); 
      this.mails = null;
    }
  }

  onSelectInterlocAdresse(){
    const adrInterloc = this.form.get('adrInterloc').value;
    if(!isNullOrUndefined(adrInterloc) && !isNullOrUndefined(adrInterloc.personId) && !isNaN(adrInterloc.personId)){
      this.contactMethodService.getContactMethodsByRefMedia(adrInterloc.personId, CM_MEDIA_REF.POSTAL_ADDRESS).subscribe(
        data => {
          this.adresses = data;
          this.form.get('address').setValue(null); 
        });
    } else {
      this.form.get('address').setValue(null); 
      this.adresses = null;
    }
  }

  getUsageByCmMedia(usages: CmUsageVO[], mediaRefKey: string): CmUsageVO {
    return usages.find(
      usage => (!isNullOrUndefined(usage.cmInterlocuteur) && usage.cmInterlocuteur.mediaRefKey === mediaRefKey)
    );
  }

  redirectToDashboard(): void {
    this.onSubmittedChange.emit(true);
    this.router.navigate(['/customer-dashboard', this.typeCustomer, this.customerId], { queryParamsHandling: 'merge'})
    .then(state => this.openSnackBar(state));
  }

  openSnackBar(state: boolean): boolean {
    if(this.result){
      this._snackBar.open('Vos données ont bien été enregistrées.', undefined, {
        duration: 3000,
        panelClass: ['center-snackbar', 'snack-bar-container']
      });
    }
    return this.result; 
  }

  enableValidation(){
    if(!this.isValidForm){
      this.validateForm();
    }
  }

 

  validateForm(){
    if(this.creationMode){
      this.isValidUsage = !isNullOrUndefined(this.form.get('usage').value);
    } else {
      if(this.usageRefKey === CM_USAGE.DEFAULT.key && this.typeCustomer === 'particular'){
        this.isValidMobileNum = !isNullOrUndefined(this.form.get('mobileNum').value);
        this.isValidMail = !isNullOrUndefined(this.form.get('mail').value);
        this.isValidAdresse = !isNullOrUndefined(this.form.get('address').value);
        this.isValidMobileInterloc = !isNullOrUndefined(this.form.get('mobileInterloc').value);
        this.isValidMailInterloc = !isNullOrUndefined(this.form.get('mailInterloc').value);
        this.isValidAdrInterloc = !isNullOrUndefined(this.form.get('adrInterloc').value);
      } else if(this.usageRefKey === CM_USAGE.DEFAULT.key && this.typeCustomer === 'entreprise'){
        this.isValidNums = !isNullOrUndefined(this.form.get('fixeNum').value) || !isNullOrUndefined(this.form.get('mobileNum').value);
        this.isValidMail = !isNullOrUndefined(this.form.get('mail').value);
        this.isValidAdresse = !isNullOrUndefined(this.form.get('address').value);
        this.isValidMobileInterloc = !isNullOrUndefined(this.form.get('mobileInterloc').value);
        this.isValidMailInterloc = !isNullOrUndefined(this.form.get('mailInterloc').value);
        this.isValidAdrInterloc = !isNullOrUndefined(this.form.get('adrInterloc').value);
      }
    }
    this.isValidForm = this.isValidUsage && this.isValidMobileNum && this.isValidMail &&
            this.isValidAdresse && this.isValidNums;

    return this.isValidForm;
  }

  save(){
    if(!this.validateForm()){
      console.log(this.isValidUsage);
    } else {
      const editUsages  = [];
      //Construction usage fixe
      const editUsageFixe = this.usageFixe;
      editUsageFixe.interlocutor = this.form.get('fixeInterloc').value;
      editUsageFixe.cmInterlocuteur = this.form.get('fixeNum').value;
      if(this.form.get('usage').value != null){
        editUsageFixe.usageRef = this.form.get('usage').value 
      }
      editUsages.push(editUsageFixe);
  
      //Construction usage mobile
      const editUsageMobile = this.usageMobile
      editUsageMobile.interlocutor = this.form.get('mobileInterloc').value;
      editUsageMobile.cmInterlocuteur = this.form.get('mobileNum').value;
      if(this.form.get('usage').value != null){
        editUsageMobile.usageRef = this.form.get('usage').value 
      }
      editUsages.push(editUsageMobile);
  
      //Construction usage mail
      const editUsageMail = this.usageMail;
      editUsageMail.interlocutor = this.form.get('mailInterloc').value;
      editUsageMail.cmInterlocuteur = this.form.get('mail').value;
      if(this.form.get('usage').value != null){
        editUsageMail.usageRef = this.form.get('usage').value 
      }
      editUsages.push(editUsageMail);
  
      //Construction usage mobile
      const editUsageAdresse = this.usageAdresse;
      editUsageAdresse.interlocutor = this.form.get('adrInterloc').value;
      editUsageAdresse.cmInterlocuteur = this.form.get('address').value;
      if(this.form.get('usage').value != null){
        editUsageAdresse.usageRef = this.form.get('usage').value 
      }
      editUsages.push(editUsageAdresse);
  
      this.contactMethodService.saveUsages(this.customerId, this.usageRefKey, editUsages,).subscribe(data =>{
        this.result = true;
          this.redirectToDashboard();
        });
    }
    }

    getClientName(interlocutor: InterlocutorVO): string {
      if(interlocutor.categoryPersonKey === PERSON_CATEGORY.MORALE){
        if(interlocutor.crmName !== null) {
      return interlocutor.crmName ;
        } else {
      return "-" ;
        }
      } else {
      return fullNameFormatter(interlocutor.title, interlocutor.firstName, interlocutor.lastName, this.separator);
      }
    }

}
