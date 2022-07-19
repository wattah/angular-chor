import { RedirectionService } from './../../../../_core/services/redirection.service';
import { GassiMockLoginService } from './../../../../_core/services/gassi-mock-login.service';
import { FormGroup, FormBuilder, Validators, ControlContainer, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';

import { getCustomerIdFromURL } from './../../../../main/customer-dashboard/customer-dashboard-utils';

import { CONSTANTS , CSS_CLASS_NAME } from './../../../../_core/constants/constants';

import { CustomersLight } from './../../../../_core/models/customers_light';
import { BillCriteriaVO } from './../../../../_core/models/BillCriteriaVO';
import { AuthTokenService } from './../../../../_core/services/auth_token';
import { BillingService } from './../../../../_core/services/billing.service';
import { PenicheBillAccountLightVO } from './../../../../_core/models/models';
import { CustomerService } from './../../../../_core/services';

import { isNullOrUndefined, generateRandomString } from './../../../../_core/utils/string-utils';
import { CartService } from '../../../../_core/services/cart.service';
import { NotificationService } from '../../../../_core/services/notification.service';
import { LogoPopUpComponent } from '../../../_shared/logo-pop-up/logo-pop-up.component';
import { ApplicationUserVO } from '../../../../_core/models/application-user';
import { CART_STATUS, PERMISSIONS_FACTURATION } from '../tab-billing-constant';

@Component({
  selector: 'app-tab-billing',
  templateUrl: './tab-billing.component.html',
  styleUrls: ['./tab-billing.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})

export class TabBillingComponent implements OnInit , OnChanges {
  form;
  isAwesome = false;
  customerId;
  user: ApplicationUserVO;
  isEntreprise = false;
  severalCustomerTit: CustomersLight[];
  noAccountBilling = true;
  penicheNoAvailable = true;
  billAccounts: PenicheBillAccountLightVO[];
  billAccountsOld: PenicheBillAccountLightVO[];
  isNotElligible = false;
  rowData;
  oldRowData;
  showFacturation = true;
  accountBilling = null;
  cartToSetBill = null;
  @Input() clickCancelBtn= false;
  selectedVal = '';
  arrayOfBolean: boolean[] = [];
  
  @Output() onCheckBillingModification: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() billAccountId;
  @Input() isFacturation;
  @Input() cartId;
  @Input() cartStatus;
  @Input() hasArticleSupscriptionPeriodicityEqualACTE: string;
  roles = [
    'RESSOURCES',
    'MARKETING',
    'RESP MARKETING',
    'VIP BORDEAUX ',
    'RESP_VIP_BDX',
    'DIR PARNASSE',
    'COMMUNICATION',
    'RESP COMMUNICATION',
    'HNO'
  ]
  columnDefs = [
    {
      headerName: '',
      headerTooltip: '',
      field: '',
      minWidth: 45,
      maxWidth: 45,
      autoHeight: true,
      checkboxSelection: (params)=> this.renderCheckBox(params)
    },
    {
      headerName: 'Catégorie',
      headerTooltip: 'Catégorie',
      field: 'billAccountRedcurrent',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      valueGetter: (params) =>
      this.getBillAccountRecurrentLabel(params.data.billAccountRecurrent),
      width: 220,
      suppressCellFlash: true,
    },
    {
      headerName: 'N° client',
      headerTooltip: 'N° de client',
      field: 'billAccountNicheIdentifiant',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 220,
      autoHeight: true
    },
    {
      headerName: 'N° de compte',
      headerTooltip: 'N° de compte',
      field: 'billAccountIdentifier',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 190,
      autoHeight: true
    },
    {
      headerName: 'Règlement',
      headerTooltip: 'Mode de règlement',
      field: 'billAccountPaymentMode',
      valueGetter: (params) =>
        this.getPaymentModeLabel(params.data.billAccountPaymentMode),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      autoHeight: true,
      width: 220
    },
    {
      headerName: 'Payeur',
      headerTooltip: 'Payeur',
      field: 'payeur',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      valueGetter: (params) => this.getPayerName(params.data),
      width: 240
    },
    {
      headerName: 'Adresse',
      headerTooltip: 'Adresse',
      field: 'billAccountPayerAddress',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 260
    }
  ];
  rowId: number;
  activeRole: string;
  params: { force: boolean; suppressFlash: boolean; };
  redrawDetailsRows: boolean;
  withLogo: any;
  showDownloadButton = false;
  isChangedAfterSave = false;
  isBeneficiary: boolean;
  idOfRadioButtons : string;
  myFlagForButtonToggle : string;
  jiraUrl: string;
  hasVisibleActionOnBilling: boolean;
  constructor(private readonly _formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly authTokenService: AuthTokenService,
    private readonly billingService: BillingService,
    private readonly customerService: CustomerService,
    private readonly mockLoginService: GassiMockLoginService,
    private readonly cartService: CartService,
    readonly notificationService: NotificationService,
    private readonly  modalService: NgbModal,
    public parent: FormGroupDirective,
    private readonly redirectionService:RedirectionService
    ) {
      /* check if cart is successfully saved then show download button */
    this.notificationService.getShowButton().subscribe((data) => {
      this.showDownloadButton = data;
    });
    this.form  = new   FormGroup({});
  }

  ngOnInit(): void {
    this.getUserConnected();
    this.idOfRadioButtons = generateRandomString(5);
    this.form = this.parent.form;
    this.form .addControl('billing', new FormGroup({
      radio: this._formBuilder.control('oui', Validators.required),
      billAccountObject : this._formBuilder.control(null)

    }))
    if(this.billAccountId === null){
      this.showDownloadButton = false;
    }
    
    this.isEntreprise = this.itIsAnEntreprise();
    this.isBeneficiary = this.itIsBeneficiary();
    this.retrieveData();
    this.mockLoginService.getCurrentConnectedUser().subscribe(
      (user)=>{
        this.activeRole = user.activeRole.roleName;
        this.user = user;
        this.hasVisibleActionOnBilling = this.hasRightOnFacturation();
        this.params =  {
          force: true,
          suppressFlash: true,
        };
        this.redrawDetailsRows = true;
        if(this.billAccounts){
          this.rowData = this.billAccounts.slice();
          this.filterBillAccountBySupscriptionPeriodicity();
        }
      }
    )
    this.notifyWhenBillingIsChanged();
    this.mockLoginService.getJiraUrl().subscribe(
      (url)=> this.jiraUrl = url
    );
  }

   /**
   * this bloc is for downloading facturette
   * */
  blobToArrayBuffer(base64: any): any {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  saveResponseFileAsPdf(reportName: any, byte: any): any {
    const blob = new Blob([byte], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    const fileName = reportName;
    window.open(link.href);
    link.download = fileName;
    link.click();
  }

   onValChange(val: string, i : any) : any{
    for(let j = 0 ; j <this.arrayOfBolean.length; j++) {
    this.arrayOfBolean[j] = false;
      }
      this.selectedVal = val;
      this.arrayOfBolean[i] = true;
    
  }
  
  downloadTinyBill(): any {
    this.modalService.open(LogoPopUpComponent, { centered: true });
    this.notificationService.getWithLogo().pipe(first())
    .subscribe(
        (response) => this.cartService.generateCartTinyBill( this.cartId , response.toString() ).subscribe((data) => {
          const filePdf = this.blobToArrayBuffer(data.document);
          this.saveResponseFileAsPdf(data.name, filePdf);
        })
        );
  }

  private retrieveData() : any {
    this.route.data.subscribe((resolvedData) => {
      this.ifItIsAnEntreprise(resolvedData);
    });
  }

  private ifItIsAnEntreprise(resolvedData) : any {
    this.customerId = getCustomerIdFromURL(this.route);
    if (this.isEntreprise) {
      this.severalCustomerTit = resolvedData['severalCustomerTit'];
      if(!isNullOrUndefined(this.severalCustomerTit) && !isNullOrUndefined(this.severalCustomerTit[0])){
        const nichIdentifiants = [];
        nichIdentifiants.push(this.severalCustomerTit[0].nichIdentifiant);
        this.getBillAccounts(nichIdentifiants);
      }
    
    }else{
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
      });
    }
  
  }

  private getBillAccounts(nichIdentifiants: string[]) : any {
    const billCriteria = {} as BillCriteriaVO;
    /**
     * @auther fsmail
     * Cette affectation est temporaire pour résoudre 
     * le problème de premier chargement du trigram
     */
    billCriteria.trigram = 'PAR';
    billCriteria.customersNumber = nichIdentifiants;
    this.callBillAccountService(billCriteria);
     
  }

  private callBillAccountService(billCriteria: BillCriteriaVO) : any {
    this.noAccountBilling=false;
    this.billAccounts=null;
    this.billingService.getBillAccounts(billCriteria).subscribe((data) => {
      this.billAccounts = data;
      this.billAccounts.forEach(element => {
        this.arrayOfBolean.push(false);
      });
      this.filterBillAccountBySupscriptionPeriodicity();
      this.getBillingAccount();
      this.accountBilling = null;
      this.noAccountBilling=false;
      if(this.billAccounts === []  || this.billAccounts.length === 0){
        this.penicheNoAvailable=false;
      }
      this.noAccountBilling= !this.rowData || this.rowData.length === 0;
    });
  }
  getBillingAccount() {
    const billAccountsClone = this.billAccounts.slice();
    this.rowId = billAccountsClone.map(account=> account.billAccountIdentifier).indexOf(this.billAccountId)
  }

  private itIsAnEntreprise(): boolean {
    return this.route.snapshot.queryParamMap.get('typeCustomer') === 'company';
  }

  private itIsBeneficiary(): boolean {
    return this.route.snapshot.queryParamMap.get('typeCustomer') === 'beneficiary';
  }

  private getBillAccountRecurrentLabel(billAccountRecurrent: boolean) : any {
    if (billAccountRecurrent) {
      return CONSTANTS.ACCOUNT_CONSULT_RECC_ACCOUNT;
    }
    return CONSTANTS.ACCOUNT_CONSULT_NOT_RECC_ACCOUNT;
  }

  private getPaymentModeLabel(billAccountPaymentMode: string): any {
    if (!isNullOrUndefined(billAccountPaymentMode)) {
      return this.getLabel(billAccountPaymentMode);
    }
    return '';
  }

  private getLabel(billAccountPaymentMode: string) : any {
    switch (billAccountPaymentMode) {
      case 'PRELEVEMENT':
        return 'Prélévement SEPA';
      case 'CHEQUE':
        return 'Chèque';
      case 'VIREMENT':
        return 'Virement';
      case 'CB':
        return 'Carte bancaire';
      case 'AMEX':
        return 'American Express';
      case 'PRELEVEMENT_AMEX':
        return 'Prélévement AMEX';
      case 'PRELEVEMENT_CB':
        return 'Prélévement CB';
      default:
        return '';
    }
  }

  private getPayerName(billAccount: PenicheBillAccountLightVO) : any {
    const emtyVal = ' ';
    if (!isNullOrUndefined(billAccount.billAccountPayerTitle)) {
      if (billAccount.billAccountPayerTitle === 'PM') {
        return billAccount.billAccountPayerCompany;
      } else {
        let name = '';
        if (!isNullOrUndefined(billAccount.billAccountPayerLastName)) {
          name += billAccount.billAccountPayerLastName + emtyVal;
        }
        if (!isNullOrUndefined(billAccount.billAccountPayerFirstName)) {
          name += `${billAccount.billAccountPayerFirstName} `;
        }
        return name;
      }
    }
    return '';
  }

  private notifyWhenBillingIsChanged() {
    this.form.valueChanges.subscribe((data) => {
      if(this.form.get('billing').dirty){
        this.onCheckBillingModification.emit(true);
               /* detect value change then hide download button */
        this.notificationService.setShowButton(false);
        this.onCheckBillingModification.emit(true);
      }
    });
  }

  selectedRow(event) {
    if(event && event.billAccountIdentifier !== this.billAccountId){
      this.accountBilling = event;
      this.billAccountId = event.billAccountIdentifier;
    }else{
      this.accountBilling = {};
      this.billAccountId = 0;
    }
  
    this.form.get('billing').get('billAccountObject').setValue(this.accountBilling);
  }

  clickedRow(){
    this.notificationService.setShowButton(false);
  }
  
  ngOnChanges(change: SimpleChanges){
    if(change['billAccountId'] ){
      this.onCheckBillingModification.emit(false);   
      this.isChangedAfterSave = true;
    }
    if(change['hasArticleSupscriptionPeriodicityEqualACTE']){
      this.filterBillAccountBySupscriptionPeriodicity();
    }
  }
  private filterBillAccountBySupscriptionPeriodicity() {
    if (this.hasArticleSupscriptionPeriodicityEqualACTE === 'true') {
      this.onFilterNotRecurrentBillAccount();
    }else {
      this.rowData = this.billAccounts;
    }
  }

  onFilterNotRecurrentBillAccount() {
    if(this.billAccounts){
      const billAccountsClone = this.billAccounts.slice();
      this.rowData = billAccountsClone.filter(item=> item.billAccountRecurrent);
    }
  }
  
  renderCheckBox(params: any) {
     if(params.data.billAccountIdentifier === this.billAccountId){
      params.node.setSelected(true);
      return true;
    }else{
      return this.hasRightOnFacturation();
    }
   }

   private hasRightOnFacturation(): boolean {
    if(this.user && this.user.activeRole && this.user.activeRole.permissions){
      const permissions = this.user.activeRole.permissions;
      switch (this.cartStatus) {
        case CART_STATUS.PENDING:
          return permissions.includes(PERMISSIONS_FACTURATION.PENDING_FACTURATION);
        case CART_STATUS.AWAITING_APPROVAL:
          return permissions.includes(PERMISSIONS_FACTURATION.AWAITING_APPROVAL_FACTURATION);
        case CART_STATUS.VALIDATE:
          return permissions.includes(PERMISSIONS_FACTURATION.VALIDATION_FACTURATION);
        case CART_STATUS.ESTIMATE_SENT:
          return permissions.includes(PERMISSIONS_FACTURATION.ESTIMATE_SENT_FACTURATION);
        case CART_STATUS.READY_DELIVER:
          return permissions.includes(PERMISSIONS_FACTURATION.READY_DELIVER_FACTURATION);
        case CART_STATUS.DELIVERED:
          return permissions.includes(PERMISSIONS_FACTURATION.DELIVERED_FACTURATION);
        case CART_STATUS.ABANDON:
          return permissions.includes(PERMISSIONS_FACTURATION.ABANDON_FACTURATION);
        default:
          return false;
      }
    }
  }

   toggleIsAwesome(){
    this.isAwesome = !this.isAwesome;
   }
   getUserConnected(){
    const NAME_OF_ROLE = "ADMINISTRATEUR";
    this.mockLoginService.getCurrentConnectedUser().subscribe((user) => {
      this.isNotElligible = false;
      if (user !==null && user.activeRole !== null && user.activeRole.roleName !== null && user.activeRole.roleName === NAME_OF_ROLE) {
        this.isNotElligible = true;
      }
    });

   }
}


