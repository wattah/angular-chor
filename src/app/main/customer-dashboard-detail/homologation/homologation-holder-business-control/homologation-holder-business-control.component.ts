import { GassiMockLoginService } from '../../../../_core/services';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { getCustomerIdFromURL } from '../../../customer-dashboard/customer-dashboard-utils';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../../_core/services/user-service';
import { InfoCustomerHomologation } from '../../../../_core/models/info-customer-homologation-vo';
import { HomologationVO } from '../../../../_core/models';


@Component({
  selector: 'app-homologation-holder-business-control',
  templateUrl: './homologation-holder-business-control.component.html',
  styleUrls: ['./homologation-holder-business-control.component.scss']
})
export class HomologationHolderBusinessControlComponent implements OnInit {
  
  @Input() homologation: HomologationVO;
  @Input() isHomologated: boolean;
  form: FormGroup;
  customerId: string;
  declarationPreventionHomo = null ;
  solvabilityHomo = null ;
  decisionHomo = null;
  selectedDeskId = null;
  commentHomo: string ;
  deskList: any[] = [];
  decisionDateHomo = null ;
  listOkKO: any ;
  listDecision: any ;
  submitted: boolean ;
  infoCustomerHomologation: InfoCustomerHomologation;


  constructor(readonly route: ActivatedRoute, readonly fb: FormBuilder,
     private readonly datePipe: DatePipe, readonly userService: UserService,
     private readonly gassiMockLoginService: GassiMockLoginService) { 
    this.form = this.createFormGroup();
  }

  ngOnInit() {
    
    this.customerId = getCustomerIdFromURL(this.route);
    this.initListOkKo() ;
    this.initListDecision() ;
    this.initDeskList() ;
    this.setRestrictionOnFormByPermissions();
    if(this.isHomologated){
      this.form.get('declarationPreventionHomologation').disable(); 
      this.form.get('solvabilityHomologation').disable(); 
      this.form.get('commentHomologation').disable(); 
      this.form.get('decisionHomologation').disable(); 
      this.form.get('dateHomologation').disable(); 
      this.form.get('listDeskHomologation').disable(); 
    }

      if(this.homologation){
      this.declarationPreventionHomo = this.homologation.homologationDeclarisPreventel;
      this.solvabilityHomo = this.homologation.homologationSolvencyControls ;
      this.decisionHomo = this.homologation.homologationDecision;
      this.commentHomo = this.homologation.homologationComment ;
      this.selectedDeskId = this.homologation.idDesk ;
      if(this.homologation.homologationDecisionDate !== null){
      this.decisionDateHomo = new Date(this.datePipe.transform(this.homologation.homologationDecisionDate, 'yyyy-MM-dd')); 
      }   
      }
    
    this.onFormGroupChange(this.form);
  }
  createFormGroup(): FormGroup {
    return this.fb.group({
      declarationPreventionHomologation: this.fb.control(''),
      solvabilityHomologation: this.fb.control(''),
      commentHomologation: this.fb.control(''),
      decisionHomologation: this.fb.control(''),
      dateHomologation: this.fb.control(''),
      listDeskHomologation: this.fb.control('')

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
    {label : "Valider l'homologation" , ref : true},
    {label : "Refuser l'homologation" , ref : false}
    ] ;
  }

  initDeskList(): void {
    this.userService.usersByRole('DESK', 1).subscribe((data) => {
      this.deskList = data;
      if (this.deskList) {
        this.deskList.sort((a, b) => a.lastName.localeCompare(b.lastName) ) ;
      }      
    });
  }

  initDateDecision(): void {
    if(this.isNotTrueOrFalse(this.decisionHomo)){
      this.decisionHomo = null ;
      this.decisionDateHomo = null;
      this.homologation.homologationDecisionDate = this.decisionDateHomo ;
    } else {
      this.decisionDateHomo = new Date();
    }
  }

  isNotTrueOrFalse(value):boolean{
    if(value!== true && value!== false) {
      return true ;
    } else {
      return false ;
    }
  }
  
  updateHomologation(): void{
    if(this.isNotTrueOrFalse(this.declarationPreventionHomo)){
      this.declarationPreventionHomo = null;
    }
    if(this.isNotTrueOrFalse(this.solvabilityHomo)){
      this.solvabilityHomo = null ;
    }
    if(this.selectedDeskId === "null"){
      this.selectedDeskId = null ;
    }
    this.homologation.homologationDeclarisPreventel = this.declarationPreventionHomo ;
     this.homologation.homologationSolvencyControls = this.solvabilityHomo ;
     this.homologation.homologationComment = this.commentHomo ;
     this.homologation.idDesk = this.selectedDeskId ;
     this.homologation.homologationDecision = this.decisionHomo ;
     if(this.decisionDateHomo){
     this.homologation.homologationDecisionDate = new Date(this.decisionDateHomo);
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
        if(!user.activeRole.permissions.includes('modification_homologation')){
          this.form.disable();
        }else{
          if(!this.isHomologated){
            this.form.enable();
          }
        }
      });
  }
}
