import { Component, ViewChildren, QueryList, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { getCustomerIdFromURL } from '../../customer-dashboard/customer-dashboard-utils';
import { HomologationService } from '../../../_core/services/homologation.service';
import { InteractionService } from '../interaction.service';
import { InfoCustomerHomologation } from '../../../_core/models/info-customer-homologation-vo';
import { CONTRAT_STATUTS, REF_HOMOLOGATION_STATUT } from '../../../_core/constants/constants';
import { CustomerService } from '../../../_core/services';
import { AcquisitionCanalVO } from '../../../_core/models/acquisition-canal-vo';
import { ReferenceDataVO } from '../../../_core/models/reference-data-vo';
import { CanalMotifHomologation } from '../../../_core/models/Canal-Motif-homologation-vo';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HomologationVO, HomologationParticipantVO } from '../../../_core/models';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { NotificationService } from '../../../_core/services/notification.service';
import { PreHomologationHolderBusinessControlComponent } from './pre-homologation-holder-business-control/pre-homologation-holder-business-control.component';
import { HomologationHolderBusinessControlComponent } from './homologation-holder-business-control/homologation-holder-business-control.component';
import { HomologationBeneficiariesBusinessControlComponent } from './homologation-beneficiaries-business-control/homologation-beneficiaries-business-control.component';
import { HomologationCommiteeSelectionComponent } from './homologation-commitee-selection/homologation-commitee-selection.component';
import { HomologationApprovalDocumentsComponent } from './homologation-approval-documents/homologation-approval-documents.component';
import { ApplicationUserVO } from '../../../_core/models/application-user';
import { AuthTokenService } from '../../../_core/services/auth_token';


@Component({
  selector: 'app-homologation',
  templateUrl: './homologation.component.html',
  styleUrls: ['./homologation.component.scss']
})
export class HomologationComponent {

  typeCustomer:string
  showBenifice:boolean
  customerId: string;
  homologation: HomologationVO;
  holderHomologation: HomologationVO;
  infoCustomerHomologation: InfoCustomerHomologation;
  canalMotifHomologation = {} as  CanalMotifHomologation;
  isHomologated: boolean;
  isAmendment: boolean;
  holderHomologationId: number;
  acquisitionCanaux: AcquisitionCanalVO;
  membershipReason: ReferenceDataVO;
  membershipReason2: ReferenceDataVO;
  membershipReasonComment: string;
  refParnasseKnowledge: ReferenceDataVO;
  user : ApplicationUserVO;
  loading = false;

  @ViewChild(PreHomologationHolderBusinessControlComponent, { read: PreHomologationHolderBusinessControlComponent, static: false }) 
    preHomolog: PreHomologationHolderBusinessControlComponent;

  @ViewChild(HomologationHolderBusinessControlComponent, { read: HomologationHolderBusinessControlComponent, static: false }) 
   homolog: HomologationHolderBusinessControlComponent;

  @ViewChild(HomologationBeneficiariesBusinessControlComponent, { read: HomologationBeneficiariesBusinessControlComponent, static: false }) 
   homologBeneficiaires: HomologationBeneficiariesBusinessControlComponent;

  @ViewChild(HomologationCommiteeSelectionComponent, { read: HomologationCommiteeSelectionComponent, static: false }) 
   comiteSelection: HomologationCommiteeSelectionComponent;

  @ViewChild(HomologationApprovalDocumentsComponent, { read: HomologationApprovalDocumentsComponent, static: false }) 
   approvalDocs: HomologationApprovalDocumentsComponent;
  
  constructor(private readonly router: Router,
    readonly homologationService: HomologationService, 
    readonly route: ActivatedRoute, 
    readonly service: InteractionService,
    private readonly customerService: CustomerService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly _snackBar: MatSnackBar,
     private readonly notificationService: NotificationService
     ,private readonly authTokenService: AuthTokenService) { }

   ngOnInit(): void {
    
    this.customerId = getCustomerIdFromURL(this.route);
    this.canalMotifHomologation.customerId = this.customerId;
    this.service.changeValueShowLink360(false); 
    this.route.data.subscribe(resolversData => {
      this.homologation = resolversData['homologation'];
      console.log("this.homologation", this.homologation);
      this.infoCustomerHomologation = resolversData['infoCustomerHomologationResolver'];
      this.isHomologated = this.homologation.refMembershipStatus === REF_HOMOLOGATION_STATUT.HOMOLOGUE.label;
    });

    if (!isNullOrUndefined(this.notificationService.getHomologation())) {
      this.homologation = this.notificationService.getHomologation();
      this.canalMotifHomologation = this.notificationService.getcanalMotifHomologation();
    }
    
    this.route.queryParamMap.subscribe( params => {
      this.typeCustomer = params.get('typeCustomer');
      this.isAmendment = params.get('isAmendment') === 'true';
      if (this.isAmendment) {
        this.holderHomologationId = Number(params.get('holderHomoId'));
      }
    });
    if (this.typeCustomer === 'company' ) {
      this.showBenifice = true;
    } else {
      this.showBenifice = false;
    }
    if (this.isAmendment) {
      this.homologationService.getHomologationById(this.holderHomologationId).subscribe(
      res => {
        this.holderHomologation = res;
      },
      error => console.error('Error in WS getHomologationById: ', error)  
      );
    }
    
  } 

  onChangebeneficiaries(beneficiaires: Partial<HomologationParticipantVO>[]): void {
    // reading list after changes made in ag grid tables
    console.log("************************", beneficiaires);
  }
  save(){
    console.log(this.homologation);
    let comment: string
    if (this.homologation.homologationDecision){
      if(!this.allDocumentsProcessed()){
        comment = 'Veuillez indiquer la validité de tout les documents avant de valider l`homologation';
        this.openConfirmationDialog(comment, null);	
      }else{
        comment = 'Vous êtes sur le point d`accorder l`homologation du dossier. Le statut prospect passera à Membre. Voulez-vous continuer ?';
        this.openConfirmationDialog(comment, 'Non');	
      }
    } else if (this.homologation.prehomologationDecision && !this.homologation.isCustomerSaved){
      comment = 'Vous êtes sur le point de transmettre le dossier à l`homologation. Voulez-vous continuer ?';
      this.openConfirmationDialog(comment, 'Non');
    } else {
      this.saveHomologation();
    }
  }

  allDocumentsProcessed():boolean{
    if(!isNullOrUndefined(this.homologation.approvalDocuments) && this.homologation.approvalDocuments.length >0){
      for(const appDoc of this.homologation.approvalDocuments){
        if(appDoc.isValidatedHomologation == null){
          return false;
        }
      }
    }
    return true; 
  }

  openConfirmationDialog(comment: string, btnCancelText: string): any {
    const title = 'Attention';
    let btnOkText;
    if(btnCancelText){
      btnOkText = 'Oui';
    } else {
      btnOkText = 'OK';
    }
    this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText)
    .then((confirmed) => { if(confirmed && btnCancelText!== null){
      this.saveHomologation();
    }})
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  saveHomologation(){
    // Mise à jour statut homologation
    if (this.homologation.homologationDecision){
      this.homologation.refMembershipStatus = REF_HOMOLOGATION_STATUT.HOMOLOGUE.key; 				
     }else if (this.homologation.prehomologationDecision){
      this.homologation.refMembershipStatus = REF_HOMOLOGATION_STATUT.PREHOMOLOGUE.key;	
    }
    this.user = this.authTokenService.applicationUser;
    this.loading = true;
    this.homologationService.saveHomologation(this.homologation, this.user.activeRole.roleName, this.isAmendment).subscribe( 
      data => {
        if(data){
          console.log('homologation saved ',data);
          this.homologation = data;
          this.isHomologated = this.homologation.refMembershipStatus === REF_HOMOLOGATION_STATUT.HOMOLOGUE.label;
          if (!this.isAmendment) {
            this.saveAcquisitionsCanaux();
          }
          this.loading = false;
          //affichage de snackbar denregistrement
          this._snackBar.open('Les informations ont bien été enregistrées.', undefined, {
            duration: 3000,
            panelClass: ['center-snackbar', 'snack-bar-container']
          });
          //mise a jours de cotrole metier titulaire prehomologation
          this.preHomolog.homologation = this.homologation;
          this.preHomolog.isHomologated = this.isHomologated;
          this.preHomolog.ngOnInit();
          //mise a jours de controle metier titulaire homologation
          this.homolog.homologation = this.homologation;
          this.homolog.isHomologated = this.isHomologated;
          this.homolog.ngOnInit();
          //mise a jours de controle metier beneficiaires
          this.homologBeneficiaires.homologation = this.homologation;
          this.homologBeneficiaires.ngOnInit();
          //mise a jours de comite de selection
          this.comiteSelection.homologation = this.homologation;
          this.comiteSelection.ngOnInit();
          //mise a jours des documents 
          this.approvalDocs.homologation = this.homologation;
          this.approvalDocs.canalMotifHomologation = this.canalMotifHomologation;
          this.approvalDocs.ngOnInit();
        }
      },
      (error) => {
        console.error('saveHomologation failed: ', error);
        this.loading = false;
        },
      ()=>{
        console.log('onComplete');
        this.loading = false;
      }
    );
  }

  saveAcquisitionsCanaux(){
    this.customerService.saveAcquisitionCanalAndMembershipReason(this.canalMotifHomologation).subscribe(
      data => {
        if(data){
        console.log('canal saved ',data);
        }
      },
    );
  }
  cancel(){
    if(this.isHomologated){
      return false;
    }
    const customerDashbord ='/customer-dashboard';
      this.router.navigate([customerDashbord,
        this.typeCustomer === 'company' ? 'entreprise' : 'particular', this.customerId],
      { queryParams: { typeCustomer: this.typeCustomer}
     });
     return true;
  }


}
