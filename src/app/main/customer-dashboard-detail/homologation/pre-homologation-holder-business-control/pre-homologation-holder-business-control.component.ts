import { GassiMockLoginService } from '../../../../_core/services';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { getCustomerIdFromURL } from '../../../customer-dashboard/customer-dashboard-utils';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { InfoCustomerHomologation } from '../../../../_core/models/info-customer-homologation-vo';
import { HomologationVO } from '../../../../_core/models';

@Component({
  selector: 'app-pre-homologation-holder-business-control',
  templateUrl: './pre-homologation-holder-business-control.component.html',
  styleUrls: ['./pre-homologation-holder-business-control.component.scss']
})
export class PreHomologationHolderBusinessControlComponent implements OnInit {

  @Input() homologation: HomologationVO;
  @Input() isHomologated: boolean;
  form: FormGroup;
  customerId: string;
  declarationPreventionPreHomo = null;
  solvabilityPreHomo = null ;
  decisionPreHomo = null ;
  commentPreHomo: string ;
  decisionDatePreHomo: any ;
  listOkKO: any ;
  listDecision: any ;
  submitted: boolean ;
  infoCustomerHomologation: InfoCustomerHomologation;

  constructor(readonly route: ActivatedRoute, readonly fb: FormBuilder, readonly datePipe: DatePipe , private readonly gassiMockLoginService: GassiMockLoginService) { 
    this.form = this.createFormGroup();
  }

  ngOnInit() {
    this.customerId = getCustomerIdFromURL(this.route);
    this.initListOkKo() ;
    this.initListDecision() ;
    this.setRestrictionOnFormByPermissions();
    if(this.isHomologated){
      this.form.get('declarationPreventionPreHomologation').disable(); 
      this.form.get('solvabilityPreHomologation').disable(); 
      this.form.get('commentPreHomologation').disable(); 
      this.form.get('decisionPreHomologation').disable(); 
      this.form.get('datePreHomologation').disable(); 
    }
      
    if(this.homologation){
      this.declarationPreventionPreHomo = this.homologation.prehomologationDeclarisPreventel;
      this.solvabilityPreHomo = this.homologation.prehomologationSolvencyControls ;
      this.decisionPreHomo = this.homologation.prehomologationDecision;
      this.commentPreHomo = this.homologation.prehomologationComment ;
      if(this.homologation.prehomologationDecisionDate !== null){
      this.decisionDatePreHomo= new Date(this.datePipe.transform(this.homologation.prehomologationDecisionDate, 'yyyy-MM-dd'));
      }

    }

      this.onFormGroupChange(this.form);
  }
  createFormGroup(): FormGroup {
    return this.fb.group({
      declarationPreventionPreHomologation: this.fb.control(''),
      solvabilityPreHomologation: this.fb.control(''),
      commentPreHomologation: this.fb.control(''),
      decisionPreHomologation: this.fb.control(''),
      datePreHomologation: this.fb.control('')

    });
  }

  initListOkKo(){
    this.listOkKO = [
    {label : "OK" , ref : true},
    {label : "KO" , ref : false}
    ] ;
  }

  initListDecision(){
    this.listDecision = [
    {label : "Valider la pré-homologation" , ref : true},
    {label : "Refuser la pré-homologation" , ref : false}
    ] ;
  }

  initDateDecision(): void {
    if(this.isNotTrueOrFalse(this.decisionPreHomo)){
      this.decisionPreHomo = null ;
      this.decisionDatePreHomo = null;
      this.homologation.prehomologationDecisionDate = this.decisionDatePreHomo ;
    } else {
      this.decisionDatePreHomo = new Date();
    }
  }


  isNotTrueOrFalse(value):boolean{
    if(value!== true && value!== false) {
      return true ;
    } else {
      return false ;
    }
  }
  
  updatePreHomologation(): void{
    if(this.isNotTrueOrFalse(this.declarationPreventionPreHomo)){
      this.declarationPreventionPreHomo = null;
    }
    if(this.isNotTrueOrFalse(this.solvabilityPreHomo)){
      this.solvabilityPreHomo = null ;
    }
    this.homologation.prehomologationDeclarisPreventel = this.declarationPreventionPreHomo ;
     this.homologation.prehomologationSolvencyControls = this.solvabilityPreHomo ;
     this.homologation.prehomologationComment = this.commentPreHomo ;
     this.homologation.prehomologationDecision = this.decisionPreHomo ;
     if(this.decisionDatePreHomo){
     this.homologation.prehomologationDecisionDate= new Date(this.decisionDatePreHomo);
     }
  }
  onFormGroupChange( form: FormGroup): void {
    this.form = form;
  }
  onSubmittedChange( submitted: boolean): void {
    this.submitted = submitted;
  }
  /**
   * @author YFA
   * to set restrictions on from if the current user not have
   * the per
   */
  setRestrictionOnFormByPermissions() {
    this.gassiMockLoginService.getCurrentConnectedUser().subscribe(
      (user)=>{
        if(!user.activeRole.permissions.includes('modification_prehomologation')){
          this.form.disable();
        }else{
          if(!this.isHomologated){
            this.form.enable();
          }
        }
      });
  }
}
