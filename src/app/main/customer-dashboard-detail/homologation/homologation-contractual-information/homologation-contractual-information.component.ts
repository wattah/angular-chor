import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { HomologationVO } from '../../../../_core/models';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { DatePipe } from '@angular/common';
import { CustomerService } from '../../../../_core/services';
import { getCustomerIdFromURL } from '../../../../main/customer-dashboard/customer-dashboard-utils';
import { ActivatedRoute } from '@angular/router';
import { AcquisitionCanalVO } from '../../../../_core/models/acquisition-canal-vo';
import { getDecryptedValue } from '../../../../_core/utils/functions-utils';
import { ReferenceDataVO } from '../../../../_core/models/reference-data-vo';
import { FormControl } from '@angular/forms';
import { InfoCustomerHomologation } from '../../../../_core/models/info-customer-homologation-vo';
import { CanalMotifHomologation } from '../../../../_core/models/Canal-Motif-homologation-vo';
import { CanalAcquisitionComponent } from './canal-acquisition/canal-acquisition.component';

@Component({
  selector: 'app-homologation-contractual-information',
  templateUrl: './homologation-contractual-information.component.html',
  styleUrls: ['./homologation-contractual-information.component.scss']
})
export class HomologationContractualInformationComponent implements OnInit {

  @Input() homologation: HomologationVO;
  @Input() canalMotifHomologation: CanalMotifHomologation;
  @Input() infoCustomerHomologation: InfoCustomerHomologation;
  @Input() isAmendment: boolean;

  customerId: string;
  @ViewChildren(CanalAcquisitionComponent) canalsViews: QueryList<CanalAcquisitionComponent>;

  membershipReasons: ReferenceDataVO[] = [];
  knowledgeParnasse: ReferenceDataVO[] = [];
  defaultReferenceValue = {} as ReferenceDataVO;

  showMotif = false;
  isMotifValid = true;
  motifAdhesion1Control = new FormControl();
  motifAdhesion2Control = new FormControl();

  firstCanalChanged:boolean;
  amendmentCanal: string;

  constructor(private readonly datePipe: DatePipe,
    private readonly customerService: CustomerService,
    private readonly route: ActivatedRoute) { }

  ngOnInit() {
    if (this.isAmendment) {
      this.amendmentCanal = 'Accroissement de portefeuille';
    } else {
      this.initDefaultValues();
      this.customerId = getCustomerIdFromURL(this.route);

      /*------------------get resolvers ---------------------------*/
      this.route.data.subscribe(resolversData => {
        /*------------------get list sponsorCanal---------------------------*/
        this.membershipReasons = this.membershipReasons.concat(this.defaultReferenceValue).concat(resolversData['membershipReasons']);
        /*------------------get list sponsorCanal---------------------------*/
        this.knowledgeParnasse = this.knowledgeParnasse.concat(this.defaultReferenceValue).concat(resolversData['knowledgeParnasse']);
        //positionner les valeurs de knowledgeParnasse
        if(isNullOrUndefined(this.canalMotifHomologation.refParnasseKnowledgeId)){
          if(!isNullOrUndefined(this.infoCustomerHomologation.idRefParnasseKnowledge)){
            this.canalMotifHomologation.refParnasseKnowledgeId = this.infoCustomerHomologation.idRefParnasseKnowledge;
          } else {
            this.canalMotifHomologation.refParnasseKnowledgeId = this.defaultReferenceValue.id;
          }
        }

        //positionner les valeurs de membership1 sur les combobox
        if(!isNullOrUndefined(this.canalMotifHomologation.membershipReasonId)){
          this.motifAdhesion1Control.setValue(this.membershipReasons.find((x) => x.id === this.canalMotifHomologation.membershipReasonId));
        } else if(!isNullOrUndefined(this.infoCustomerHomologation.idRefMembershipReason)){
          this.motifAdhesion1Control.setValue(this.membershipReasons.find((x) => x.id === this.infoCustomerHomologation.idRefMembershipReason));
        } else{
          this.motifAdhesion1Control.setValue(this.defaultReferenceValue);
        }
        this.canalMotifHomologation.membershipReasonId = this.motifAdhesion1Control.value.id;

        //positionner les valeurs de membership2 sur les combobox
        if(!isNullOrUndefined(this.canalMotifHomologation.membershipReason2Id)){
          this.motifAdhesion2Control.setValue(this.membershipReasons.find((x) => x.id === this.canalMotifHomologation.membershipReason2Id));
        } else if(!isNullOrUndefined(this.infoCustomerHomologation.idRefMembershipReason2)){
          this.motifAdhesion2Control.setValue(this.membershipReasons.find((x) => x.id === this.infoCustomerHomologation.idRefMembershipReason2));
        }else{
          this.motifAdhesion2Control.setValue(this.defaultReferenceValue); 
        }
        this.canalMotifHomologation.membershipReason2Id = this.motifAdhesion2Control.value.id;

        //positionner les valeurs de membershipcomment pour autre
        if(this.motifAdhesion1Control.value.label === 'Autre'
              || this.motifAdhesion2Control.value.label === 'Autre'){
          this.showMotif =true;
          if(isNullOrUndefined(this.canalMotifHomologation.membershipReasonComment)){
            if(!isNullOrUndefined(this.infoCustomerHomologation.membershipReasonComment)){
              this.canalMotifHomologation.membershipReasonComment = this.infoCustomerHomologation.membershipReasonComment;
            }else{
              this.canalMotifHomologation.membershipReasonComment = "";
            }
          }
        }else{
          this.canalMotifHomologation.membershipReasonComment = "";
        }

        //positionner les valeurs des canaux si on ne viens pas de retour upload docs
        if(isNullOrUndefined(this.canalMotifHomologation) || isNullOrUndefined(this.canalMotifHomologation.acquisitionsCanaux) ){
          this.getCanalDataForCurrentContract();
        } 
      });
    }
  } 
  
  //Positionner la valeur Tous sur les combos par defaut
  initDefaultValues(){
    this.defaultReferenceValue.label ='--';
    this.defaultReferenceValue.id =0;
  }

  getCanalDataForCurrentContract(){
    this.customerService.getAcquisitionsCanalsByCustomerId(this.customerId).subscribe(
      data => {
        if(data  != null && data.length>0){
          this.canalMotifHomologation.acquisitionsCanaux = data;
        } else if (this.homologation.refAcquisitionChannel != null && this.homologation.refAcquisitionChannel != ""){
          const acquisitionCanal = {} as AcquisitionCanalVO;
          acquisitionCanal.canalKey = "ref_contact_canal_10";
          acquisitionCanal.typeKey = this.homologation.refAcquisitionChannel;
          acquisitionCanal.numberCanal = 0;
          acquisitionCanal.customerId = getDecryptedValue(this.customerId);
          if (this.homologation.seller != null || this.homologation.seller !== ""){
            acquisitionCanal.userId = this.homologation.sellerId;
          } else {
            if (this.homologation.sellerCuid != null || this.homologation.sellerCuid !== ""){
              acquisitionCanal.details1 = this.homologation.sellerCuid;	
            }
          }
          if (this.homologation.storeManager != null || this.homologation.storeManager !== ""){
            acquisitionCanal.otherUserId = this.homologation.storeManagerId;
          }
          const listCanal:AcquisitionCanalVO[] = new Array(acquisitionCanal);	
          this.canalMotifHomologation.acquisitionsCanaux = listCanal;
        }
      }
    );
  }

  getDate(dateTime: Date){
    return !isNullOrUndefined(dateTime) ? this.datePipe.transform(dateTime, 'dd MMM yyyy') : "-" ;
  }

  onSelectKnowledge(event) {
    this.canalMotifHomologation.refParnasseKnowledgeId = event.id; 
  }

  onKnowledgeSelected(){
    if(!isNullOrUndefined(this.canalMotifHomologation.refParnasseKnowledgeId) && this.canalMotifHomologation.refParnasseKnowledgeId !== 0 ){
      for(const knowledge of this.knowledgeParnasse){
        if(knowledge.id === this.canalMotifHomologation.refParnasseKnowledgeId){
          return knowledge.label;
        } else {
          if(!isNullOrUndefined(knowledge.children) && knowledge.children.length>0){
            for(const child of knowledge.children){
              if(child.id === this.canalMotifHomologation.refParnasseKnowledgeId){
                return child.label;
              }
            }
          }
        }
      }
    } 
    return "--";
  }

  changeMemberShipReason():void{
    this.canalMotifHomologation.membershipReasonId = this.motifAdhesion1Control.value.id;
    this.setMotifInput();
  }

  changeMemberShipReason2():void{
    this.canalMotifHomologation.membershipReason2Id = this.motifAdhesion2Control.value.id;
    this.setMotifInput();
  }

  setMotifInput(){
    if(this.motifAdhesion1Control.value.label !== 'Autre'
      && this.motifAdhesion2Control.value.label !== 'Autre') {
        this.showMotif = false;
        this.canalMotifHomologation.membershipReasonComment = "";
    } else{
      if(isNullOrUndefined(this.canalMotifHomologation.membershipReasonComment) || this.canalMotifHomologation.membershipReasonComment === ""){
        this.showMotif = true;
        this.isMotifValid = false;
      } else {
        this.showMotif = true;
        this.isMotifValid = true;
      }
      
    }
  }

  onChangeFirstCanal( event: boolean): void {
    this.firstCanalChanged = event;
    if(!event){
      this.canalMotifHomologation.acquisitionsCanaux = [];
      const canalComponentArray = this.canalsViews.toArray();
      if (canalComponentArray && canalComponentArray.length > 0) {
        console.log("taskComponentArray",canalComponentArray);
        canalComponentArray.forEach(canalComponent => {
          if(canalComponent.numberCanal === 1){
            canalComponent.acquisitionCanal = null;
            canalComponent.firstCanalControl.setValue(this.defaultReferenceValue);
            canalComponent.updateCanalForm(true, false);
          }
        });
      }
    }
  }

  onUpdateAcquistionCanal(currentResultCanal: AcquisitionCanalVO): void {
    let isNew = true;
    if(!isNullOrUndefined(this.canalMotifHomologation.acquisitionsCanaux) && 
      this.canalMotifHomologation.acquisitionsCanaux.length >0){
        for(const acquisitionCanal of this.canalMotifHomologation.acquisitionsCanaux){
          if(acquisitionCanal.numberCanal === currentResultCanal.numberCanal ){
            isNew = false;
            if(!isNullOrUndefined(currentResultCanal.canalKey)){
              this.canalMotifHomologation.acquisitionsCanaux[acquisitionCanal.numberCanal] = currentResultCanal;
            } else {
              this.canalMotifHomologation.acquisitionsCanaux.splice(acquisitionCanal.numberCanal, 1);
            }
          }
        }
        if(isNew){
          this.canalMotifHomologation.acquisitionsCanaux.push(currentResultCanal);
        }
      } else if(!isNullOrUndefined(currentResultCanal.canalKey)){
        this.canalMotifHomologation.acquisitionsCanaux = [];
        this.canalMotifHomologation.acquisitionsCanaux.push(currentResultCanal)
      }
  }

  changeMotif(){
    this.isMotifValid = false;
    if(!isNullOrUndefined(this.canalMotifHomologation.membershipReasonComment) && this.canalMotifHomologation.membershipReasonComment !== ""){
      this.isMotifValid = true;
    }
  }

}