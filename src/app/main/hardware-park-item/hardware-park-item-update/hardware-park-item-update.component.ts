import { getCustomerIdFromURL } from '../../../main/customer-dashboard/customer-dashboard-utils';
import { DateFormatPipeFrench } from './../../../_shared/pipes/dateformat/date-format.pipe';
import { Location } from '@angular/common';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { AuthTokenService } from './../../../_core/services/auth_token';
import { ParcLigneService } from './../../../_core/services/parc-ligne.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerParkItemVO } from './../../../_core/models/customer-park-item-vo';
import { CustomerHardwareParkItemVO } from './../../../_core/models/models';
import { Component, OnInit, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelConfirmationPopUpComponent } from '../../../_shared/components/cancel-confirmation-pop-up/cancel-confirmation-pop-up.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANTS, SERVICE_AND_MATERIEL } from './../../../_core/constants/constants';
import { NotificationService } from './../../../_core/services/notification.service';
import { isNullOrUndefined } from './../../../_core/utils/string-utils';
import { CustomerParcServiceVO } from './../../../_core/models/customer-parc-service-vo';
import { BillCriteriaVO } from '../../../_core/models/BillCriteriaVO';
import { BillingService } from '../../../_core/services/billing.service';
import { PenicheBillAccountLightVO } from '../../../_core/models/models';
import { CustomerService } from '../../../_core/services';

@Component({
  selector: 'app-hardware-park-item-update',
  templateUrl: './hardware-park-item-update.component.html',
  styleUrls: ['./hardware-park-item-update.component.scss']
})
export class HardwareParkItemUpdateComponent extends ComponentCanDeactivate implements OnInit {
  modalService: NgbModal;
  route: ActivatedRoute;
  _formBuilder: FormBuilder;
  parcLigneService: ParcLigneService;
  authTokenService: AuthTokenService;
  franchDatePipe: DateFormatPipeFrench;
  location: Location;
  notificationService: NotificationService;
  router: Router;
  form: FormGroup;
  constructor(private readonly injector : Injector, private readonly billingService: BillingService,
    private readonly customerService: CustomerService) {
                super();
                this.injectServices();
                this.buildForm();
                this.parcServices =this.notificationService.getParcServices();
                console.log('PARC SERVICE', this.parcServices);
              }
  customerHardward: CustomerHardwareParkItemVO;
  parcServices: CustomerParcServiceVO[];
  parcStatus: CustomerParcServiceVO;
  recurrentCategory;
  category;
  isOffreAndService = false;
  isProduct = false;
  isElse = false;
  parkItems: CustomerParkItemVO[];
  status;
  showStatus = false;
  product;
  serialRequired = false;
  buyingDate;
  billAccount = null;
  previousUrl: any;
  customerId: any;
  statut = SERVICE_AND_MATERIEL.STATUS.slice();
  submitted;
  isEntreprise = false;
  billAccounts: PenicheBillAccountLightVO[];
  billAccountCustHardware: PenicheBillAccountLightVO;
  isBeneficiary: boolean;
  injectServices() {
    this.modalService = this.injector.get<NgbModal>(NgbModal);
    this.route = this.injector.get<ActivatedRoute>(ActivatedRoute);
    this._formBuilder = this.injector.get<FormBuilder>(FormBuilder);
    this.parcLigneService = this.injector.get<ParcLigneService>(ParcLigneService);
    this.authTokenService = this.injector.get<AuthTokenService>(AuthTokenService);
    this.franchDatePipe = this.injector.get<DateFormatPipeFrench>(DateFormatPipeFrench);
    this.location = this.injector.get<Location>(Location);
    this.notificationService = this.injector.get<NotificationService>(NotificationService);
    this.router = this.injector.get<Router>(Router);
  }
  buildForm(){
    this.form = this._formBuilder.group({
      realizationDate: this._formBuilder.control(''),
      associetedLine: this._formBuilder.control(null),
      installationAddress: this._formBuilder.control(null),
      comment: this._formBuilder.control(''),
      serielNumber: this._formBuilder.control(''),
      statut: this._formBuilder.control(null , [Validators.required]),
      startBilling: this._formBuilder.control(''),
      buyingDate:this._formBuilder.control('')
    });
  }
  ngOnInit() {;
    this.isBeneficiary =  this.route.snapshot.queryParamMap.get('typeCustomer') === 'beneficiary';
    this.customerId = getCustomerIdFromURL(this.route);
    this.isEntreprise = this.itIsAnEntreprise();
    this.route.data.subscribe(
      (resolver)=>{
        this.customerHardward = resolver['customerHardward'];
        this.parkItems = resolver['parkItems'];
        this.getBills();
        this.category = this.customerHardward.category;
        this.product = this.customerHardward.product;
        this.billAccount = this.customerHardward.billAccountIdentifier;
        this.showSerialNumberField();
        console.log('product ' , this.product)
      }
    );
 
    this.parcServices.forEach(
      (parc)=>{
        if(parc.id === this.customerHardward.id){
          this.parcStatus = parc;
        }
      }
    )
    this.setDateInForm();
    this.definedVisibilty();
    this.constrolRequiredStatut();
  }
  private definedVisibilty() {
    this.isOffreAndService = this.category === CONSTANTS.OFFRE_AND_SERVICE;
    this.showStatus = this.category !== CONSTANTS.OFFRE_AND_SERVICE ;   
    this.recurrentCategory = this.isOffreAndService ? 'Oui' : 'Non';
    this.isProduct = this.category === 'Produit';
    this.isElse = this.category !== 'Offre et service' && this.category !== 'Produit';
  }

  private constrolRequiredStatut() {
    const statutControl = this.form.get('statut');
    if (this.showStatus) {
      statutControl.setValidators([Validators.required]);
    } else {
      statutControl.clearValidators();
    }
      statutControl.updateValueAndValidity();
    }

  private setDateInForm() {
    this.form.get('comment').setValue(this.customerHardward.comments);
    this.form.get('serielNumber').setValue(this.customerHardward.serial ? this.customerHardward.serial : '-');
    this.form.get('associetedLine').setValue(this.getAssociatedLineById(this.customerHardward.associatedLineId));
    this.buyingDate = this.customerHardward.subscriptionDate;
    this.form.get('buyingDate').setValue(this.franchDatePipe.transform(this.buyingDate.toString()));
    this.form.get('startBilling').setValue(this.franchDatePipe.transform(this.buyingDate.toString()));   
    const status = this.statut.filter((status)=>status.key=== this.customerHardward.hardwareStatus)[0]; 
    this.form.get('statut').setValue(status);
  
        if(this.customerHardward.terminatedAt){
      this.form.get('realizationDate').setValue(new Date(this.customerHardward.terminatedAt));
    }

  }

  private showSerialNumberField() {
    if (this.product && this.product.serialRequired && this.product.serialRequired === true) {
      this.serialRequired = this.product.serialRequired;
      this.form.get('serielNumber').setValidators([Validators.required]);
      this.form.get('serielNumber').updateValueAndValidity();
    }
  }

  getAssociatedLineById(associatedLineId: number): any {
    const parkItemsClone = this.parkItems.slice();
    const associatedLine = parkItemsClone.filter((park)=>park.id === associatedLineId)[0];
    return associatedLine ? associatedLine:'--';
  }
  getStatus() {
    switch(this.category){
      case 'SAV':
        if (!isNullOrUndefined(this.parcStatus.status)) {
          if (this.parcStatus.status === 'RESILIE') {
          return this.statut.filter((status)=> status.key === this.parcStatus.status)[0].value;
          }
        }
        return '';
      case 'Offre et service':
        return 'Interventions incluses restantes ';
      default:
        return '-';
    }
  }
  cancelCreation(){
      const confirmationModal = this.modalService.open(CancelConfirmationPopUpComponent, { centered: true });
      return confirmationModal.result.then( value => {
        return value;
      }); 
  }

  onUpdateParcElement(){
    if(this.form.valid){
      this.prepareCustomerHardwardParkItemVO();
      console.log('customerHardward = ' , this.customerHardward)
      this.parcLigneService.createCustomerHardwareParkItem(this.customerHardward).subscribe(
        (data)=>{
          this.submitted = true;
          this.goBack();
        },
        console.log,
        ()=>console.log('onComplete')
      );
    }
  }
  goBack(): void {
    this.location.back();
  }
  prepareCustomerHardwardParkItemVO() {
    this.customerHardward.serial = this.form.get('serielNumber').value;
    const associetedLine = this.form.get('associetedLine').value;
    if (associetedLine) {
      this.customerHardward.associatedLineId = associetedLine.id;
      this.customerHardward.associatedLineIdentifier = associetedLine.webServiceIdentifier;

    }
    this.customerHardward.subscriptionDate = this.buyingDate;
    this.customerHardward.terminatedAt = this.form.get('realizationDate').value;
    this.customerHardward.terminatedById = this.authTokenService.applicationUser.coachId;
    this.customerHardward.recurrent = this.recurrentCategory === 'Oui';
    const status = this.form.get('statut').value;
    if(status){
      this.customerHardward.status = status.key;
    }
    this.customerHardward.comments = this.form.get('comment').value;
    if(!isNullOrUndefined(this.billAccountCustHardware) && !isNullOrUndefined(this.billAccountCustHardware.billAccountNicheIdentifiant)){
      this.customerHardward.billAccountNicheIdentifier = this.billAccountCustHardware.billAccountNicheIdentifiant;
    }
  }

  annuler(){
    this.canceled = true;
    const dashboard = '/customer-dashboard'
    this.previousUrl = this.notificationService.notifyPreviousUrl();
    if(this.previousUrl.includes('particular') || !this.isEntreprise){
      if(this.previousUrl.includes('see-all')){
        this.router.navigate(
          [dashboard ,  this.customerId , 'see-all','parc-services'],
          {queryParamsHandling: 'merge'}
        );
      }else{
        this.router.navigate(
          [dashboard, 'particular' ,  this.customerId],
          {queryParamsHandling: 'merge'}
        );
      }
    }else{
      if(this.previousUrl.includes('see-all')){
        this.router.navigate(
          [dashboard , this.customerId , 'see-all' , 'parc-services'],
          {queryParamsHandling: 'merge'}
        );
      }else{
        this.router.navigate(
          [dashboard , 'entreprise' , this.customerId],
          {queryParamsHandling: 'merge'}
        );
      }
    }
  }

  itIsAnEntreprise(): boolean {
    return this.route.snapshot.queryParamMap.get('typeCustomer') === 'company';
  }

 

  private getBills() {
    this.customerId = getCustomerIdFromURL(this.route);

      this.customerService.getCustomer(this.customerId).subscribe(
        (customer)=>{
          const nichIdentifiants = [];
          nichIdentifiants.push(customer.nicheIdentifier);
          if(this.isBeneficiary){
            const companyNiche = sessionStorage.getItem('companyNiche');
            nichIdentifiants.push(companyNiche);
            this.getBillAccounts(nichIdentifiants);
          }else{
            this.getBillAccounts(nichIdentifiants);
          }
        }
      );
    
  }

  getBillAccounts(nichIdentifiants) {
    const billCriteria = {} as BillCriteriaVO;
    billCriteria.trigram = 'PAR';
    billCriteria.customersNumber = nichIdentifiants;
    this.callBillAccountService(billCriteria);
  }

  callBillAccountService(billCriteria: BillCriteriaVO) {
    this.billingService.getBillAccounts(billCriteria).subscribe((data) => {
      this.billAccounts = data;
     this.billAccountCustHardware = this.billAccounts ? this.billAccounts.find((x) => x.billAccountIdentifier ===  this.customerHardward.billAccountIdentifier):null;

    });
  }


}
