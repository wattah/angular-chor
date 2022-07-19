import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CustomerProfileVO } from '../../../../_core/models/customer-profile-vo';

import { PersonVO } from '../../../../_core/models/person-vo';
import { CustomerService, GassiMockLoginService } from '../../../../_core/services';
import { ProfilContractService } from '../profil-contract.service';
import { PenicheCustomerResponseVO, PenicheTypeEnvoiLivrable } from '../../../../_core/models/peniche-customer-response-vo';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { BillingService } from '../../../../_core/services/billing.service';
import { DocumentService } from '../../../../_core/services/documents-service';
import { DocumentVO } from '../../../../_core/models/documentVO';
import { DatePipe } from '@angular/common';
import { CONSTANTS, PERMISSION_CLIENT_PENICHE, STATUS_CUSTOMER } from '../../../../_core/constants/constants';
import { ComponentCanDeactivate } from '../../../../_core/guards/component-can-deactivate';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationDialogService } from '../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerVO } from '../../../../_core/models/customer-vo';
import { AcquisitionCanalLight } from '../../../../_core/models/acquisition-canal-light';
import { InteractionService } from '../../interaction.service';


@Component({
  selector: 'app-profile-contract-creation',
  templateUrl: './profile-contract-creation.component.html',
  styleUrls: ['./profile-contract-creation.component.scss']
})
export class ProfileContractCreationComponent extends ComponentCanDeactivate implements OnInit, OnDestroy {

  customerId: string;
  submitted;
  form: FormGroup;

  customerProfile: CustomerProfileVO;

  customerProfileToUpdate: CustomerProfileVO;

  penicheCustomerResponseVO: PenicheCustomerResponseVO;
  penicheCustomerResponseVOToUpdate: PenicheCustomerResponseVO;

  nicheIdentifier: string;
  typeCustomer: string;
  photo: string;
  currentUserCUID: string;
  document: DocumentVO;
  isPenicheUp: boolean;
  isClientExist = true;
  clientPenicheExistError = false;

  consultationModePage$: BehaviorSubject<boolean>;
  indexTab = 0;
  loading = false;
  ischange = false;

  /** 
   * pour valider formulaire 
  */

  isSelected = false;
  nomProfile = false;
  nomInterne = false;
  language = false;
  companyName = false;
  crmName = false;
  siren = false;
  dateEntreeStatut = false;
  dateSigneStatut = false;
  dateHomologueStatut = false;
  raisonSocialPenich = false;
  cancellationDateStatut = false;
  cancellationMotifStatut = false;
  nomPeniche = false;
  prenomPeniche = false;
  adressFrancaisPeniche = false;
  villeOrCodePostalPeniche = false
  paysPeniche = false;
  adressePeniche = false;
  codePostalPeniche = false;
  villePeniche = false;
  formatAdresseFrancais = false;
  checkIsAddressFrench = true;
  checkFormatAddress = false;
  isEntreprise = false;
  isEmailExist = false;
  notValidForm = false;
  badgeProfileError = false;
  badgeRelationnelError = false;
  badgeStatutError = false;
  badgePenicheError = false;
  badgeVenteHomologationError = false;
  badgeDonneeParnasse = false;
  isVendeurHomologation = false;
  msgPenicheKO = false;
  


  /**
   * FORM DATA PARNASSE
   * **/

  inValidFormDataParnasse = false;
  errorsFormDataParnasse = [];
  errorsFormDataParnasseAsSelected = [];
  isTerminated = false;
  isAccessToClientPeniche = false;
  isProspectOrContact = false;


  messageError = "Erreur Serveur : Une erreur technique inattendue est surevenue.";

  constructor(private readonly profilContractService: ProfilContractService,
    private readonly route: ActivatedRoute,
    private readonly customerService: CustomerService,
    private readonly bill: BillingService,
    private readonly documentService: DocumentService,
    private readonly datePipe: DatePipe,
    readonly mockLoginService: GassiMockLoginService,
    readonly fb: FormBuilder,
    readonly confirmationDialogService: ConfirmationDialogService,
    readonly _snackBar: MatSnackBar,
    readonly activeModal: NgbActiveModal,
    readonly billingService: BillingService,
    readonly service: InteractionService) {
    super();
  }


  ngOnInit(): void {
    this.canceled = false;
    this.form = this.createFormGroup();
    this.consultationModePage$ = this.profilContractService.getConsultationModePage();
    this.getCustomerId();
    this.getTypeCustomer();
    this.getCustomerProfile();
    this.getIndexTab();
    this.document = this.customerProfile.person.photo;
    this.customerProfileToUpdate = { ...this.customerProfile };
    if(!isNullOrUndefined(this.customerProfile)) {
     
       this.nicheIdentifier = this.customerProfile.customer.nicheIdentifier;
       this.initPenicheVO(this.nicheIdentifier);
       this.profilContractService.setIsProspectOrContact(!isNullOrUndefined(this.customerProfile.customer) &&
       this.checkIsProspectOrContact(this.customerProfile.customer));
    }
    this.photo = this.loadImage();
    this.mockLoginService.getCurrentConnectedUser().subscribe((user) => {
      if(!isNullOrUndefined(user)) {
        this.currentUserCUID = user.identifiantFT;
        if(!isNullOrUndefined(user.activeRole) && !isNullOrUndefined(user.activeRole.permissions)) {
          this.isAccessToClientPeniche = user.activeRole.permissions.includes(PERMISSION_CLIENT_PENICHE);
        }
      }
    });
    this.profilContractService.getIsProspectOrContact().subscribe(value => {
      this.isProspectOrContact = value;
     })
  }

  createFormGroup(): FormGroup {
    return this.fb.group({});
  }


  getTypeCustomer(): void {
    this.route.queryParamMap.subscribe(params => {
      this.typeCustomer = params.get('typeCustomer');
    });
  }

  getCustomerId(): void {
    this.route.parent.parent.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
    });
  }
  getIndexTab(): void {
    this.route.paramMap.subscribe(params => {
      this.indexTab = Number(params.get('index'))
    });
  }

  initPenicheVO(nich: string): void {
    this.billingService.getBillCRDetailsByPeniche('PAR', nich).subscribe(data => {
      this.penicheCustomerResponseVO = data;
      if (isNullOrUndefined(this.penicheCustomerResponseVO)) {
        this.isClientExist = false;
      }
      this.isPenicheUp = true;
      this.penicheCustomerResponseVOToUpdate = { ...this.penicheCustomerResponseVO };
    },
      (error) => {
        this.isPenicheUp = false;
      });
  }

  getCustomerProfile(): void {
    this.route.data.subscribe(resolve => this.customerProfile = resolve['customerProfile']);
    if (isNullOrUndefined(this.customerProfile.person.photo)) {
      this.customerProfile.person.photo = {} as DocumentVO;
    }
  }

  // permet de recevoir les nouvelles données modifier de l'onglet relationnel
  onChangeRelationalForm(person: PersonVO): void {
    const newPersonRela = { ...this.customerProfileToUpdate.person, ...person };
    this.customerProfileToUpdate = {
      ...this.customerProfileToUpdate,
      person: newPersonRela
    };
  }

  onChangeDirtyRelationalForm(val: boolean): void {
    this.canceled = val;
  }

  onChangePenicheForm(peniche: PenicheCustomerResponseVO): void {
  const vo = { ...this.penicheCustomerResponseVOToUpdate, ...peniche};
  if(isNullOrUndefined(vo.streetNumber)) {
    vo.streetNumber = 0;
  }
  this.penicheCustomerResponseVOToUpdate = vo;
  }
  onChangeDirtyPenicheForm(val: boolean): void {
    this.isClientExist = true;
    this.canceled = val;
  }

  onchangePenicheCustomerVo(pen: PenicheCustomerResponseVO): void {
    if (isNullOrUndefined(pen)) {
      this.penicheCustomerResponseVO = pen;
    }
  }

  onChangeIsFrench(val: boolean): void {
    this.checkIsAddressFrench = val;
  }

  onChangeFormatValid(val: boolean): void {
    this.checkFormatAddress = val;
  }

  onChangIsEntreprise(val: boolean): void {
    this.isEntreprise = val;
  }


  onChangePersonStatutForm(person: PersonVO): void {
    const newPersonStatus = { ...this.customerProfileToUpdate.person, ...person };
    this.customerProfileToUpdate = {
      ...this.customerProfileToUpdate,
      person: newPersonStatus
    };
  }

  onChangeCustomerStatutForm(customer: CustomerVO): void {
    const newCustomerStatus = { ...this.customerProfileToUpdate.customer, ...customer };
    this.customerProfileToUpdate = {
      ...this.customerProfileToUpdate,
      customer: newCustomerStatus
    };
    this.profilContractService.setIsProspectOrContact(!isNullOrUndefined(this.customerProfileToUpdate.customer) &&
    this.checkIsProspectOrContact(this.customerProfileToUpdate.customer));
  }

  onChangeDirtyStatusContractualForm(val: boolean): void {
    this.canceled = val;
  }

  onChangeDirtySaleApprovalForm(val: boolean): void {
    this.canceled = val;
  }

  changeDataParnasseForm(formDataInfo: any): void {
    const { value , invalid , dirty, errors } = formDataInfo;
    this.canceled = dirty;
    this.inValidFormDataParnasse = invalid;
    this.errorsFormDataParnasse = errors;
    this.customerProfileToUpdate = {
      ...this.customerProfileToUpdate,
      customer: {
        ...this.customerProfileToUpdate.customer,
        ...value.customer
      }
    };
  }

  onChangeSaleApprovalForm(formSaleApproval: any): void {
    const newCustomer = { ...this.customerProfileToUpdate.customer, ...formSaleApproval };
    this.customerProfileToUpdate = {
      ...this.customerProfileToUpdate,
      customer: newCustomer
    };
  }

  onChangeAcquistionCanal(acqui: AcquisitionCanalLight[]): void {
    this.customerProfileToUpdate.customer.acquisitionCanals = acqui;
  }

  setCustomerProfileForStatusContra(customerProfile: any): void {
    this.customerProfileToUpdate.customer.status = customerProfile.status;
     this.customerProfileToUpdate.customer.acceptanceDate = customerProfile.acceptanceDate;
     this.customerProfileToUpdate.person.additionalInformations = customerProfile.additionalInformations;
     this.customerProfileToUpdate.customer.contractCessionDate = customerProfile.contractCessionDate;
     this.customerProfileToUpdate.customer.dateHomologation = customerProfile.dateHomologation;
     this.customerProfileToUpdate.customer.dateOfTechnicalStudy = customerProfile.dateOfTechnicalStudy;
     this.customerProfileToUpdate.customer.installationDate = customerProfile.installationDate;
     this.customerProfileToUpdate.person.isFounderMembership = customerProfile.isFounderMembership;
     this.customerProfileToUpdate.person.isHonoraryMember = customerProfile.isHonoraryMember;
     this.customerProfileToUpdate.customer.isMemberValidated = customerProfile.isMemberValidated;
     this.customerProfileToUpdate.customer.nicheAdmissionDate = customerProfile.nicheAdmissionDate;
     this.customerProfileToUpdate.customer.paymentDate = customerProfile.paymentDate;
     this.customerProfileToUpdate.customer.prospectingAdmissionDate = customerProfile.prospectingAdmissionDate;
     this.customerProfileToUpdate.customer.realisationStatus = customerProfile.realisationStatus;
     this.customerProfileToUpdate.customer.refMembershipReason = customerProfile.refMembershipReason;
     this.customerProfileToUpdate.person.refMembershipReason2 = customerProfile.refMembershipReason2;
     this.customerProfileToUpdate.person.refTestAccount = customerProfile.refTestAccount;
     this.customerProfileToUpdate.person.refParnasseKnowledge = customerProfile.refParnasseKnowledge;
  }
 
  
  onCancel(): void {
    if(this.canceled) {
      this.popGeneriqueCanceled();
    } else {
        this.initForm();
        this.canceled = false;
        this.isSelected = false;
        this.initPenicheVO(this.customerProfile.customer.nicheIdentifier);
      this.profilContractService.updateConsultationModePage(true);
    }
  }

  onUpdate(): void {
    this.isSelected = true;
    this.profilContractService.setIsProspectOrContact(!isNullOrUndefined(this.customerProfileToUpdate) &&
    !isNullOrUndefined(this.customerProfileToUpdate.customer) &&
    this.checkIsProspectOrContact(this.customerProfileToUpdate.customer));
    this.isTerminated = !isNullOrUndefined(this.customerProfileToUpdate) &&
    !isNullOrUndefined(this.customerProfileToUpdate.customer) &&
    this.checkIsTerminated(this.customerProfileToUpdate.customer);
   if(!this.checkNotValidForm(this.isProspectOrContact, this.isTerminated)){
    this.isSelected = false;
    this.submitted = true
    this.canceled = false;
    this.loading = true;
    // save clients peniche 
    if(this.isAccessToClientPeniche) {
         this.savePeniche();
    }

      const documentTosave = this.customerProfileToUpdate.person.photo;
      const dateCreation = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
      if (!isNullOrUndefined(documentTosave) && !isNullOrUndefined(documentTosave.id)
        && documentTosave.id === 0 && documentTosave.isRemove === false) {
        this.saveCustomerWithDocument(documentTosave, dateCreation);
      } else {
        this.saveCustomerNotDocument();
      }
   }
  }

  checkIsProspectOrContact(customer): boolean {
    return (!isNullOrUndefined(customer) &&
    (customer.status === STATUS_CUSTOMER.STATUS_PROSPECT_ID.id ||
     customer.status === STATUS_CUSTOMER.STATUS_CONTACT_ID.id));
  }

  checkIsTerminated(customer): boolean {
    return (!isNullOrUndefined(customer) && customer.status === STATUS_CUSTOMER.STATUS_CLIENT_INACTIF_ID.id);
  }

  savePeniche(): void {
        if(!isNullOrUndefined(this.penicheCustomerResponseVOToUpdate)) {
          this.bill.saveBillCustomer(this.currentUserCUID, this.penicheCustomerResponseVOToUpdate).subscribe (data => {
            if(isNullOrUndefined(data.streetNumber)) {
              data.streetNumber = 0;
            }
            this.penicheCustomerResponseVO = data;
            this.penicheCustomerResponseVOToUpdate = data;
            this.isClientExist = true;
            this.isPenicheUp = true;
          },
          error => {
            this.initPenicheVO(this.nicheIdentifier);
            this.loading = false;
            this.openSnackBar("les données client Péniche n'ont pas été enregistrées");
          },
          () => {
            console.log('complete')
          });
        }
  }

  saveCustomerWithDocument(documentTosave, dateCreation): void {
          this.documentService.saveDocument('57','','','12',documentTosave.file, this.customerId, dateCreation).subscribe(data => {
            this.customerProfileToUpdate.person.photo = data;
            this.document = this.customerProfileToUpdate.person.photo;
            this.customerProfile.person.photo = this.customerProfileToUpdate.person.photo;
            this.customerService.saveCustomerProfile(this.customerProfileToUpdate).subscribe(customerAfterSave => {
                this.customerService.getCustomerProfile(this.customerId).subscribe (customerProfile => {
                this.customerProfile = customerProfile;
                this.customerProfileToUpdate = this.customerProfile;
                this.photo = this.loadImage();
                this.profilContractService.updateConsultationModePage(true);
                this.loading = false;
                this.service.changeRefresh(true);
                this.openSnackBar('vos données ont bien été enregistrées.');
              });
            },
            error => {
              this.loading = false;
              this.openConfirmationDialoglg(this.messageError)
              this.service.changeRefresh(false);
            },
            () => {
              console.log('complete')
              this.service.changeRefresh(false);
            });
          })
  }

  saveCustomerNotDocument(): void {
            if(!isNullOrUndefined(this.document.id)) {
              this.customerProfileToUpdate.person.photo = this.document;
            } else {
              this.customerProfileToUpdate.person.photo = null;
            }
            this.customerService.saveCustomerProfile(this.customerProfileToUpdate).subscribe(customerAfterSave => {
              this.customerService.getCustomerProfile(this.customerId).subscribe (data => {
                this.customerProfile = data;
                if(isNullOrUndefined(this.customerProfile.person.photo)) {
                  this.customerProfile.person.photo = {} as DocumentVO;
                }
                this.customerProfileToUpdate = this.customerProfile;
                this.photo = this.loadImage();
                this.profilContractService.updateConsultationModePage(true);
                this.loading = false;
                this.openSnackBar('vos données ont bien été enregistrées.');
                this.service.changeRefresh(true);
                
              });
           },
          error => {
            this.loading = false;
            this.openConfirmationDialoglg(this.messageError);
            this.service.changeRefresh(false);
          },
          () => {
            console.log('complete')
            this.service.changeRefresh(false);
          }
          );
        }

  onChangeProfilForm(person: PersonVO): void {
    const newPersonProfil = { ...this.customerProfileToUpdate.person, ...person };
    this.customerProfileToUpdate = { 
      ...this.customerProfileToUpdate,
      person: newPersonProfil
    };
  }
  onChangeDirtyProfilForm(val: boolean): void {
    this.canceled = val;
  }

  onChangeProfilEntrepriseForm(person: PersonVO): void {
    const newPersonProfilEntr = { ...this.customerProfileToUpdate.person, ...person };
    this.customerProfileToUpdate = { 
      ...this.customerProfileToUpdate,
      person: newPersonProfilEntr
    };
  }

  onChangeDirtyProfilEntrepriseForm(val: boolean): void {
    this.canceled = val;
  }

  ngOnDestroy(): void {
    this.profilContractService.updateConsultationModePage(true);
  }


  loadImage(): string {
    let resultat = '';
    if (!isNullOrUndefined(this.customerProfile.person.photo) && 
    !isNullOrUndefined(this.customerProfile.person.photo.id) && !isNullOrUndefined(this.customerProfile.person.photo.file)) {
      resultat = 'data:image/jpg;base64,'
      resultat += this.customerProfile.person.photo.file;
    } else if (this.typeCustomer === 'company') {
      resultat = CONSTANTS.AVATAR_ENTREPRISE;
    } else {
      if (!isNullOrUndefined(this.customerProfile.person.title) && this.customerProfile.person.title === 'MME' ) {
        resultat = CONSTANTS.AVATAR_MME;
      } else if (!isNullOrUndefined(this.customerProfile.person.title) && this.customerProfile.person.title === 'M' ) {
        resultat = CONSTANTS.AVATAR_M;
      } else if (!isNullOrUndefined(this.customerProfile.person.title) && this.customerProfile.person.title === 'UNKNOWN') {
        resultat = CONSTANTS.AVATAR_UNKNOWN;
      }
    }
    return resultat; 
  }

  popGeneriqueCanceled(): void {
    const title = 'Erreur!';
    const comment = 'Êtes-vous sûr de vouloir annuler votre modification ?';
    const btnOkText = 'Oui, j\'annule ma modification';
    const btnCancelText = 'Non je reviens à ma modification';
    this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText, 'lg', true)
      .then((confirmed) => {
        if (confirmed) {
          this.initForm();
          this.canceled = false;
          this.isSelected = false;
          this.initPenicheVO(this.customerProfile.customer.nicheIdentifier);
          this.profilContractService.updateConsultationModePage(true);
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  /** SNACK BAR */
  openSnackBar(text: string): void {
    this._snackBar.open(
      text, undefined, 
      { duration: 3000, panelClass: ['center-snackbar', 'snack-bar-container'] });
  }

  openConfirmationDialoglg(message: string): any {
    const title = 'Erreur';
    const btnOkText = 'OK';
    this.confirmationDialogService.confirm(title, message, btnOkText,null,'lg', false)
    .then((confirmed) => {
      this.activeModal.close(true)
    })
    .catch(() => console.log('User dismissed )'));
  }


  checkNotValidForm(isProspectOrContact, isTerminated): boolean {
    this.initForm();
    this.profilContractService.setIsProspectOrContact(isProspectOrContact);
    if(this.typeCustomer === 'company') {
      this.validformProfileEntre();
    } else {
      this.validformProfilePart();
    }
    if(!isProspectOrContact) {
       this.validFormStatut();
     }
     
     if(this.isAccessToClientPeniche && !isTerminated && !isProspectOrContact) {
        if (this.isPenicheUp) {
          if (this.isClientExist) {
            this.validFormPeniche();
          } else  {
            this.badgePenicheError = true;
            this.adressFrancaisPeniche = false;
            this.villeOrCodePostalPeniche = false;
            this.clientPenicheExistError = false;
          }
        } else {
            this.adressFrancaisPeniche = false;
            this.msgPenicheKO  = true;
            this.clientPenicheExistError = false;
        }
     } else {
      this.msgPenicheKO  = false;
     }

    if(!isProspectOrContact) {
       this.validFormVenteHomologation();
       this.validFormDataParnasse();
     }

    this.notValidForm = this.checkParamForm(isTerminated);
    return this.notValidForm ;
  }

  checkParamForm(isTerminated: boolean): boolean {
    return this.nomProfile || this.language || 
    this.nomInterne || this.companyName || this.crmName || this.siren ||
    this.dateEntreeStatut || 
    this.dateSigneStatut || 
    this.dateHomologueStatut ||
    this.cancellationDateStatut||
    this.cancellationMotifStatut ||
    this.raisonSocialPenich ||
    this.nomPeniche || 
    this.prenomPeniche ||
    this.adressFrancaisPeniche ||
    this.paysPeniche ||
    this.adressePeniche ||
    this.villePeniche ||
    this.codePostalPeniche ||
    this.formatAdresseFrancais || this.isEmailExist || (!this.isClientExist && !this.isProspectOrContact && !isTerminated) || 
    (this.inValidFormDataParnasse && !this.isProspectOrContact) || this.isVendeurHomologation;
  }

  validformProfilePart(): void {
    if(isNullOrUndefined(this.customerProfileToUpdate.person.lastName) || this.customerProfileToUpdate.person.lastName === '') {
      this.nomProfile = true;
    }
    if(isNullOrUndefined(this.customerProfileToUpdate.person.crmName) || this.customerProfileToUpdate.person.crmName === '') {
     this.nomInterne = true;
    } 

    if(isNullOrUndefined(this.customerProfileToUpdate.person.refFavoriteLanguage)) {
      this.language = true;
     } 

    this.badgeProfileError = this.nomProfile || this.nomInterne || this.language;
  }

  validformProfileEntre(): void {
    if(isNullOrUndefined(this.customerProfileToUpdate.person.companyName) || this.customerProfileToUpdate.person.companyName === '') {
      this.companyName = true;
     }
     if(isNullOrUndefined(this.customerProfileToUpdate.person.crmName) || this.customerProfileToUpdate.person.crmName === '') {
      this.crmName = true;
     }
     if(!isNullOrUndefined(this.customerProfileToUpdate.person.siret) &&
        this.customerProfileToUpdate.person.siret.length > 0 && this.customerProfileToUpdate.person.siret.length < 9) {
        this.siren = true;
     }
     this.badgeProfileError = this.companyName || this.crmName || this.siren;
  }

  validFormStatut(): void {
    if(isNullOrUndefined(this.customerProfileToUpdate.customer.prospectingAdmissionDate)) {
      this.dateEntreeStatut = true;
     }
     if(isNullOrUndefined(this.customerProfileToUpdate.customer.nicheAdmissionDate)) {
      this.dateSigneStatut = true;
     }
     if(isNullOrUndefined(this.customerProfileToUpdate.customer.dateHomologation)) {
      this.dateHomologueStatut = true;
     }
     if(this.customerProfileToUpdate.customer.status === 2 &&
      (isNullOrUndefined(this.customerProfileToUpdate.customer.cancellationDate))){
        this.cancellationDateStatut = true;
     }
     if(this.customerProfileToUpdate.customer.status === 2 &&
      (isNullOrUndefined(this.customerProfileToUpdate.customer.refCancellationReason))){
        this.cancellationMotifStatut = true;
     }
     
     this.badgeStatutError = this.dateEntreeStatut || this.dateSigneStatut || this.dateHomologueStatut
                              ||  this.cancellationDateStatut || this.cancellationMotifStatut;
  }

  validFormPeniche(): void {
     if(this.isEntreprise && 
      (isNullOrUndefined(this.penicheCustomerResponseVOToUpdate) ||  this.penicheCustomerResponseVOToUpdate.society === '')) {
        this.raisonSocialPenich = true;
       }

     if(isNullOrUndefined(this.penicheCustomerResponseVOToUpdate) ||
        (this.penicheCustomerResponseVOToUpdate.title !== 'PM' && 
          this.penicheCustomerResponseVOToUpdate.lastName === '')) {
          this.nomPeniche = true;
        }
     if(isNullOrUndefined(this.penicheCustomerResponseVOToUpdate) || 
        (this.penicheCustomerResponseVOToUpdate.title !== 'PM'  &&
          this.penicheCustomerResponseVOToUpdate.firstName === '')) {
          this.prenomPeniche = true;
        }

     if(isNullOrUndefined(this.penicheCustomerResponseVOToUpdate) || 
          (this.penicheCustomerResponseVOToUpdate.typeEnvoi === PenicheTypeEnvoiLivrable.MAIL 
          && (this.penicheCustomerResponseVOToUpdate.mailNotification === '' || isNullOrUndefined(this.penicheCustomerResponseVOToUpdate.mailNotification)))) {
            this.isEmailExist = true;

          }
        this.gestionErrorAddresseClientPeniche();
    }

  gestionErrorAddresseClientPeniche(): void {
    if(this.checkIsAddressFrench) {
      this.verifAddressFrench();
    } else {
      this.verifAddressHorsFrench();
    }

    this.badgePenicheError = this.raisonSocialPenich ||
      this.nomPeniche ||
      this.prenomPeniche ||
      this.formatAdresseFrancais ||
      this.paysPeniche ||
      this.adressePeniche ||
      this.adressFrancaisPeniche ||
      this.villePeniche ||
      this.codePostalPeniche;
  }

  verifAddressFrench(): void {
       if (isNullOrUndefined(this.penicheCustomerResponseVOToUpdate) || !this.checkFormatAddress) {
          if (isNullOrUndefined(this.penicheCustomerResponseVOToUpdate.address4) || this.penicheCustomerResponseVOToUpdate.address4 === '') {
            this.paysPeniche = false;
            this.adressePeniche = false;
            this.codePostalPeniche = false;
            this.villePeniche = false;
            this.adressFrancaisPeniche = true;
          }
          if(this.penicheCustomerResponseVOToUpdate.billReport && 
            (this.penicheCustomerResponseVOToUpdate.zipCode === '' || 
            this.penicheCustomerResponseVOToUpdate.city === '' )) {
              this.paysPeniche = false;
              this.adressePeniche = false;
              this.codePostalPeniche = false;
              this.villePeniche = false;
              this.villeOrCodePostalPeniche = true;
              this.adressFrancaisPeniche = true;
          }
       }else if (this.checkFormatAddress){
          this.formatAdresseFrancais = true;
          this.paysPeniche = false;
          this.adressePeniche = false;
          this.codePostalPeniche = false;
          this.villePeniche = false;
      }
  }

  verifAddressHorsFrench(): void {
        if(isNullOrUndefined(this.penicheCustomerResponseVOToUpdate) ||  this.penicheCustomerResponseVOToUpdate.country === '') {
          this.paysPeniche = true;
        } 

        if(isNullOrUndefined(this.penicheCustomerResponseVOToUpdate) || this.penicheCustomerResponseVOToUpdate.address4 === '') {
          this.adressePeniche = true;
        }

        if(isNullOrUndefined(this.penicheCustomerResponseVOToUpdate) || 
             (this.penicheCustomerResponseVOToUpdate.billReport === true && this.penicheCustomerResponseVOToUpdate.city === '')) {
               this.villePeniche = true;
             }

             if(isNullOrUndefined(this.penicheCustomerResponseVOToUpdate) || 
             (this.penicheCustomerResponseVOToUpdate.country === 'FRANCE' &&
               this.penicheCustomerResponseVOToUpdate.billReport === true &&
               this.penicheCustomerResponseVOToUpdate.zipCode === '')) {
               this.codePostalPeniche = true;
             }     
    }

  validFormVenteHomologation(): void {
    if(!isNullOrUndefined(this.customerProfileToUpdate.customer.referents)) {
      this.isVendeurHomologation = true;
      for (const ref of this.customerProfileToUpdate.customer.referents) {
         if(ref.roleId === CONSTANTS.ROLE_VENTE && ref.userId !== 0) {
           this.isVendeurHomologation = false;
         }
      }
    }

    

    this.badgeVenteHomologationError = this.isVendeurHomologation;
  }

  validFormDataParnasse(): void {
    this.errorsFormDataParnasseAsSelected = [];
    for (const error of this.errorsFormDataParnasse) {
      this.errorsFormDataParnasseAsSelected.push(error);
    }
    this.badgeDonneeParnasse = this.inValidFormDataParnasse;
    
  }

  initForm(): void {
    this.nomProfile = false; 
    this.nomInterne = false; 
    this.language = false;
    this.crmName = false;
    this.companyName = false; 
    this.siren = false;
    this.dateEntreeStatut = false;  
    this.dateSigneStatut = false; 
    this.dateHomologueStatut = false; 
    this.cancellationDateStatut = false;
    this.cancellationMotifStatut = false;
    this.raisonSocialPenich = false; 
    this.nomPeniche = false; 
    this.prenomPeniche = false; 
    this.adressFrancaisPeniche = false;
    this.villeOrCodePostalPeniche = false;
    this.paysPeniche = false; 
    this.adressePeniche = false; 
    this.villePeniche  = false;
    this.codePostalPeniche = false;
    this.formatAdresseFrancais = false;
    this.isEmailExist = false;
    this.badgeProfileError = false;
    this.badgeRelationnelError = false;
    this.badgeDonneeParnasse = false;
    this.badgeStatutError = false;
    this.badgePenicheError = false;
    this.notValidForm = false;
    this.msgPenicheKO = false;
    this.badgeVenteHomologationError = false;
    this.isVendeurHomologation = false;

  }


}
