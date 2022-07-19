import { Component, EventEmitter, OnInit,Output } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationDialogService } from './../../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';

import { CONSTANTS , CSS_CLASS_NAME, WEB_CONSTANT, getLabelByEnum, CONSTANTLABEL, 
  FacadeStatus, TELCO_UNIVERS} from './../../../../../_core/constants/constants';

import { NicheContractStatusWithFilter, NicheContractStatusWithFilters } from './../../../../../_core/enum/customer-park-item-statut.enum';
import { ParcLigneService, ReferenceDataService, CustomerService } from './../../../../../_core/services';
import { CustomerParkItemVO } from './../../../../../_core/models/customer-park-item-vo';
import { ReferenceDataVO } from './../../../../../_core/models';
import { PersonVO } from './../../../../../_core/models/models';
import { AuthTokenService } from './../../../../../_core/services/auth_token';
import { CustomerProfileVO } from './../../../../../_core/models/customer-profile-vo';
import { getEncryptedValue } from './../../../../../_core/utils/functions-utils';
import { CustomerVO } from './../../../../../_core/models/customer-vo';
import { isNullOrUndefined } from './../../../../../_core/utils/string-utils';
import { NotificationService } from './../../../../../_core/services/notification.service';
import { ParkItemUpdateService } from '../park-item-form-update/park-item-update.service';

export interface User {
  name: string;
}

@Component({
  selector: 'app-line-detail',
  templateUrl: './line-detail.component.html',
  styleUrls: ['./line-detail.component.scss']
})
export class LineDetailComponent implements OnInit {
  NicheContractStatusWithFilter = NicheContractStatusWithFilter;
  NicheContractStatusWithFilters = NicheContractStatusWithFilters;
  selectedStatusList = [];
  espace = ' ' ;
  /**
			 * Customer  of the selcted customer (beneficiary), its null in the case of "Particulier" category
			 */
  _selectedCompanyCustomer:CustomerVO;
  @Output() onCanceledChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  typeCustomer :string;
  personOfCustomer : PersonVO;
  getRowHeight: any;
  customerId:string;
  rowData : any= null;
  isQuestionsAsked = false;
  showDetailLine = false;
  typeOfLigne : number;
  customerParkItem:CustomerParkItemVO = {} as CustomerParkItemVO ;
  phoneNumberController = new FormControl();
  myController = new FormControl();
  isMultisim = new FormControl();
  isNumParnasse = new FormControl();
  lineHolderController = new FormControl();
  date = new FormControl();
  linkedLigneController = new FormControl();
  statutController= new FormControl();
  benefController = new FormControl();
  ligneOrigineControoler = new FormControl();
  fullNames ='';
  selectedCustomer : CustomerVO;
  beneficiariesDataProvider : CustomerVO[]=[] ;
  origine : any;
  customerpark : CustomerParkItemVO ;
  existCutomerParkItem = false;
  noParkAvailable = false;
  isEntreprise = false;
  parkItems : CustomerParkItemVO[]  = []; 
  form: FormGroup;
  type : any;
  lineNumber : any ;
  typeNumber = 2;
  startDate : Date = new Date();
  origineLine: ReferenceDataVO[];
  tmpcustomerfull : any;
  lineHolder : ReferenceDataVO = null;
  customerDashboard = '/customer-dashboard';
  fullCustomerss: CustomerProfileVO;
  curentCustomer : CustomerVO;
  fullName: Array<string> = new Array<string>();
  webServiceIdentifiers : string [] = [];
  concateanation = " - ";
  userCatgory: any;
  idLineHolder ='';
  showlinkedLine = false;
  statut = '';
  lineHolderNamee = new FormControl();
  typeOfCustomer : string;
  listparkItems : CustomerParkItemVO[] = [];
  parkExiste = false;
  ligneLegacy = false;
  isParnasseNumber = false;
  noLigneAvaailable = false;
  statutActif = false;
  chaineVide = " ";
  noSave = false;

  /** gestion des erreurs */
  invalidForm = false;
  numeroInvalid = false;
  numberSelectedInvalid = false;
  origineInvaalid = false;
  benefeceryInvalid = false;
  linkedligneInvalid = false;
  typeClient: string;
  seeAll: '';
  typeRequest: '';
 
  constructor(private readonly route: ActivatedRoute, private readonly router: Router,
    private readonly parcItemUpdateService: ParkItemUpdateService,
    private readonly parcLigneService : ParcLigneService,
    private readonly fb: FormBuilder,
    private readonly referencesDataService : ReferenceDataService,
    private readonly authTokenService: AuthTokenService,
    private readonly customerService: CustomerService,
    private readonly location: Location,
    private readonly confirmationDialogService : ConfirmationDialogService,
    private readonly notificationService: NotificationService
    ) { }

  ngOnInit() : any {
    
    this.seeAll=this.route.snapshot.queryParams['from'];
    this.typeRequest=this.route.snapshot.queryParams['typeRequest'];
    
    this.route.queryParamMap.subscribe(params => this.typeOfCustomer = params.get('typeCustomer'));
    this.form = this.fb.group({
      typeController: this.fb.control(null, [Validators.required]),
      phoneNumberController: this.fb.control(null, [Validators.required]),
      isMultisim: this.fb.control(null),
      isNumParnasse  : this.fb.control(null),
      lineHolderNamee : this.fb.control(null),
      date :  this.fb.control(null, [Validators.required]),
      lineHolderController : this.fb.control(null),
      ligneOrigineControoler : this.fb.control(null, [Validators.required]),
      linkedLigneController : this.fb.control(null, [Validators.required]),
      benefController : this.fb.control(null, [Validators.required]),
      statutController : this.fb.control(null, [Validators.required])
    });
    this.statutActif = true;
    this.isEntreprise = this.itIsAnEntreprise();
    this.selectedStatusList = this.parcItemUpdateService.getListContractStatut();
    this.form.get('statutController').setValue('ACTIF');
    this.form.get('typeController').setValue('Mobile');
    this.form.get('date').setValue(new Date());
    this.route.parent.parent.parent.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
      this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer'); 
    });
    this.route.data.subscribe(resolversData => {
      this.origineLine = resolversData['origineLineReferenceData'];
      this.origineLine .sort((a,b) => a.label.localeCompare(b.label));
      this.fullCustomerss  = resolversData ['fullCustomerss'];
      this.initBeneficiaries();
      this.listparkItems= resolversData ['impactParkItemLines']
      this.selectedCustomer = this.fullCustomerss.customer;
    });
    this.getSelectedcompanyCustomer();
     
    this.getParkItems(this.customerId);
    this.getParkUserCategory();
    this.observeIsMultisim();
    this.observeNumParnass();
  }
  getParkUserCategory(): void {
    this.referencesDataService
     .getReferencesData('PARK_USER_CATEGORY')
     .pipe(catchError(() => of(null)))
     .subscribe(userCatgory  => {
       
       this.userCatgory = userCatgory;
       this.userCatgory.forEach((cat) => {
         if(cat.label==='Titulaire'){
           this.form.get('lineHolderController').setValue(cat);
           this.lineHolder =cat;
           this.customerParkItem.lineHolder = cat;

         }

       });
     });
     
  }

  annuler(): void {
          const title = 'Erreur!';
          const comment = 'Êtes-vous sûr de vouloir annuler votre saisie ?';
          const btnOkText = 'Oui';
    const btnCancelText = 'Non';
          this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText, 'lg',true)
           .then((confirmed) => {
         if (confirmed) {
           this.gobackTo();
         }  
       })
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  } 
   
  gobackTo(): any {
    if (!isNullOrUndefined(this.seeAll) || !isNullOrUndefined(this.typeRequest)){
      let page = (this.typeCustomer === 'company') ? 'list-enterprise' : 'list-particular';
      this.router.navigate(
       [this.customerDashboard, this.customerId, 'park-item', page]  ,
            {
              queryParams: { 
                typeCustomer: this.typeCustomer,
              },
              queryParamsHandling: 'merge'
            }
          );
    } else {
      let page = (this.typeCustomer === 'company') ? 'entreprise' : 'particular';
      this.router.navigate([this.customerDashboard, page , this.customerId],
        {
          queryParams: { 
            typeCustomer: this.typeCustomer,
          },
          queryParamsHandling: 'merge'
        }
      );
    }
  }

  observeIsMultisim() : any {
    this.form.get('isMultisim').valueChanges.subscribe(
    (isMultisim)=> {
      if(isMultisim === true){
        this.showlinkedLine = true;
      } else {
        this.showlinkedLine = false;
      }
    }
  );
  }

  onChangeLigne(event) : any{
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    const origne = this.parkItems.find((x) => x.webServiceIdentifier === selectElementText);
    this.customerParkItem.linkedParkItemId = origne.id;
    this.origine = origne;
  }

  onChangeUser(event){
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    const origne = this.userCatgory.find((x) => x.label === selectElementText);
    this.lineHolder = origne;
    this.customerParkItem.lineHolder = origne;

  }


  observeNumParnass() {
    this.form.get('isNumParnasse').valueChanges.subscribe(
    (isNumParna)=> {
      if(isNumParna === true){
        this.isParnasseNumber = true;
        this.customerParkItem.isParnasseNumber = true;
      }else{
        this.isParnasseNumber = false;
        this.customerParkItem.isParnasseNumber = false;
      }
    }
  );
  }

  itIsAnEntreprise(): boolean {
    return this.route.snapshot.queryParamMap.get('typeCustomer') === 'company';
  }


  initBeneficiaries() : any {
    if (this.isEntreprise && this.fullCustomerss !== null ) {
      this.fullCustomerss.holderContracts.forEach((currentHolder: any) => {
        const currentOffer = currentHolder.offerLabel;
        if ((currentHolder.companyCustomerId === 0 || currentHolder.companyCustomerId === null) &&
    currentHolder.customerAffiliates !== null
    ) {
          currentHolder.customerAffiliates.forEach((currentMember: any) => {
        currentMember.offerLabel = currentOffer;
        this.beneficiariesDataProvider.push(currentMember);
      });
        }
      });
    }
  }
  

  isNotValid(): any {
   this.numberSelectedInvalid = !this.existCutomerParkItem;

    if(this.phoneNumberController.value !== '--' && this.phoneNumberController.value !== '' && !isNullOrUndefined( this.phoneNumberController.value)  ) {
      this.numeroInvalid = false;
    }
    if(this.ligneOrigineControoler.value !== '--' && this.ligneOrigineControoler.value !== '' && !isNullOrUndefined(this.ligneOrigineControoler.value)){
  
      this.origineInvaalid = false;
    }
    if(this.typeCustomer==='company' && this.form.value.benefController !== '--' && this.form.value.benefController !== '' && !isNullOrUndefined(this.form.value.benefController)){
      this.benefeceryInvalid = false;
    }
    if(this.linkedLigneController.value !== '--' && this.linkedLigneController.value !== '' && !isNullOrUndefined(this.linkedLigneController.value)){
    
      this.linkedligneInvalid = false;
    }
    if(this.numeroInvalid || this.origineInvaalid || this.benefeceryInvalid || this.linkedligneInvalid || this.parkExiste || this.ligneLegacy || !this.existCutomerParkItem  ){
      this.invalidForm = true;
    } else {
      this.invalidForm = false;
    }
    return this.invalidForm;
  }

  initValidator(): void {
    this.invalidForm = true;
    this.numeroInvalid = true;
    this.origineInvaalid = true;
    if(this.isEntreprise){
      this.benefeceryInvalid = true;
    }
    if(this.showlinkedLine === true){
      this.linkedligneInvalid = true;
    } else {
      this.linkedligneInvalid = false;
    }
    this.ligneLegacy = false;
    this.parkExiste = false;
    

  }

  onChangeType(event: any) : number {
    
    this.type =event.target['options'][event.target['options'].selectedIndex].text;
    if(this.type==='Mobile' ){
      this.typeNumber = 2
      this.customerParkItem.universe = TELCO_UNIVERS.TEL_MOBILE;
      this.customerParkItem.webService = WEB_CONSTANT.WEBSERVICE_AS_METIER;
      
    }
    if(this.type==='Internet'){
      this.typeNumber = 3
      this.customerParkItem.universe = TELCO_UNIVERS.INTERNET;
      this.customerParkItem.webService = WEB_CONSTANT.WEBSERVICE_FACADE;

    }
    if(this.type==='Fixe' ){
      this.typeNumber = 1
      this.customerParkItem.universe = TELCO_UNIVERS.TEL_FIXE;
      this.customerParkItem.webService = WEB_CONSTANT.WEBSERVICE_DRAKKAR;
    }
    return this.typeNumber;
  }

 

  onSearchLine() : any{
    
    this.existCutomerParkItem = false;
    this.noLigneAvaailable = false;
    this.noParkAvailable = false;
    this.parcLigneService.searchParkByNumString(this.lineNumber, this.typeNumber ).subscribe(
  (data) => {
    if (data !== null) {
      this.existCutomerParkItem = true;
      this.noSave = false;
      this.noParkAvailable = false;
      this.customerpark = data;
      this.rowData = [
        { 
          titulaire: this.customerpark.name, status: this.getState(this.customerpark) 
        }
      ];
    } else {
      this.noLigneAvaailable = true;
      this.existCutomerParkItem = false;
    }
 
  },
(error) => 
this.LineISnotAvailable()
);
  }

  LineISnotAvailable() : any{
    this.existCutomerParkItem = false;
    this.noParkAvailable = true;
    this.noLigneAvaailable= false;
  }
  getParkItems(customerId: string) : void {
    this.parcLigneService.getParkItemsFull(customerId).subscribe((data) => {
      this.parkItems = data;
      if(this.parkItems !== null && this.parkItems.length > 0 ) {
        this.parkItems.forEach (parc => {
          if (parc.webServiceIdentifier !== null) {
            this.webServiceIdentifiers.push(parc.webServiceIdentifier) 
          }
        }); 
      }
    });
  }

  columnDefs = [
  
    {
      headerName: '',
      headerTooltip: '',
      field: 'checkbox',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      minWidth: 40,
      maxWidth: 40,
      checkboxSelection: (params)=> this.renderCheckBox(params)
    },
    {
      headerName: 'Titulaire',
      headerTooltip: 'titulaire',
      field: 'titulaire',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      minWidth: 260,
      maxWidth: 260,
    },
    {
      headerName: 'Statut',
      field: 'status',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      minWidth: 194,
      maxWidth: 194,
    },
  ];


  onSelectStartDate(event : any) : any{
    this.customerParkItem.dateSubscription= event.value;
  }

  onChangeOrigine(event){
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    const origne = this.origineLine.find((x) => x.label === selectElementText);
    this.customerParkItem.lineOrigin = origne;
 
  }
  renderCheckBox(params: any) : boolean | undefined {
    if(params.data !== null){
      params.node.setSelected(true);
      return true;
    }
 
  }
 

  calculateRowHeightOfMasterDetail(): void {
    this.getRowHeight = (params) => {
      if (params.node) {
        const offset = 20;
        const lignes = params.data.status.split(/\r\n|\r|\n/);
        let allDetailRowHeight = lignes.length;

        lignes.forEach((ligne: string) => {
          const snb = ligne.length / 60;
          if (snb > 1) {
              allDetailRowHeight += snb - 1;
            }
        });
        return allDetailRowHeight * 20 + offset;
      }
      return null;
    };
  }

  selectPhoneNumber() : any {
    this.lineNumber = this.phoneNumberController.value;
  
    this.customerParkItem.webServiceIdentifier=this.lineNumber;
    return this.lineNumber;
    
  }

  onChangeStatut(event: any) : any{
    this.statut =event.target['options'][event.target['options'].selectedIndex].text;
    if(this.statut === 'Actif'){
      this.statutActif = true;
    } else {
      this.statutActif = false;
    }
    this.customerParkItem.nicheContractStatus = this.statut;
  }
  userName() : void{
    this.customerParkItem.lineHolderName = this.form.get('lineHolderNamee').value;
  }

  onSaveParcElement() : any{
    this.initValidator();
    let statutselected =null;
    let customerPark:CustomerParkItemVO ;
    if(!isNullOrUndefined(this.customerpark)){
      customerPark = this.getCustomerParkFromDataGrid();
      if( this.showlinkedLine === true && !isNullOrUndefined(this.origine)){
        customerPark.linkedParkItemId = this.origine.id;
        customerPark.customerParkItemContract.numTelSubCard =this.origine.webServiceIdentifier;
      }
      
    }
   // test sur l'existence d'un numero dans le park
    this.parkItems.forEach(parc => {
      if(!isNullOrUndefined(customerPark) && 
   parc.webServiceIdentifier === customerPark.webServiceIdentifier &&
   parc.universe === customerPark.universe ){
        this.parkExiste = true;
      }
    })
  // le statut « en cours de création » doit être refusé. Si elle n’existe pas c’est passant
    statutselected=this.form.get('statutController').value;
    this.checkStatutLigne(statutselected,this.customerpark);
    if(!this.isNotValid()){
      this.parcLigneService
    .saveCustomerParkItemWithCRAndCF( customerPark ).pipe(catchError(() => of(null)))
    .subscribe((data) => {
      if (data !== null) {
        this.gobackTo();
      } else {
        this.noSave = true; 
        this.notificationService.setCPI(customerPark);
        this.gotoRequiredInfo();
        this.popUpAccountNotFound();
      }
    });
    }
  }

  goBack(): void {
    this.router.navigate(
      [this.customerDashboard, this.customerId, 'park-item', 'list-particular'] ,
           {
             queryParams: { 
               typeCustomer: this.typeCustomer,
             },
             queryParamsHandling: 'merge'
           }
         )
  }

  checkStatutLigne(statutselected: any,customerpark: CustomerParkItemVO): void{
    if(statutselected === NicheContractStatusWithFilter.EN_CREATION &&
       !isNullOrUndefined(customerpark) && customerpark.universe !== 'FIXE'){
      switch (customerpark.universe) {
        case TELCO_UNIVERS.TEL_MOBILE :
          if (!isNullOrUndefined(customerpark.customerParkItemContract) && 
        !isNullOrUndefined(customerpark.customerParkItemContract.stateDoss) && 
        customerpark.customerParkItemContract.stateDoss !== CONSTANTLABEL.PORTABILITE_ENTRANTE 
        && customerpark.customerParkItemContract.stateDoss !== CONSTANTLABEL.INCONNU) {
          this.ligneLegacy = true;
        } 
        break;
        case TELCO_UNIVERS.INTERNET :
          if (!isNullOrUndefined(customerpark.customerParkItemContract) 
        && !isNullOrUndefined(customerpark.customerParkItemContract.stateDoss)&&
        customerpark.customerParkItemContract.stateDoss !== FacadeStatus.INITIALISED 
        && customerpark.customerParkItemContract.stateDoss !== FacadeStatus.INCONNU){
          this.ligneLegacy = true;
        } 
        break;
        default:
          return ;
      }
    }
  }

  onChangebenef(event: any) : any{
    
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].value;
    const benef = this.beneficiariesDataProvider.find((x) => x.customerFullName === selectElementText );
    this.selectedCustomer = benef;
    this.fullCustomerss.holderContracts.forEach(element => {
      if(benef.companyCustomerId === element.id || benef.id === element.id ){
         this._selectedCompanyCustomer = element;
       }
      this.getPerson(this._selectedCompanyCustomer, CONSTANTS.PERSON_CUSTOMER_TITU);
    });
  }

  setSelectedCompanyCustomer() : void{
    this._selectedCompanyCustomer = null;
    const tmpCustomer : CustomerVO = this.selectedCustomer;
    if(tmpCustomer === null || this.fullCustomerss===null || this.fullCustomerss.holderContracts.length===0 ){
      return;
    }
    this.fullCustomerss.holderContracts.forEach(element => {
      if(tmpCustomer.companyCustomerId === element.id || tmpCustomer.id === element.id ){
          this._selectedCompanyCustomer = element;
        }  
    });

  }
  getSelectedcompanyCustomer() : CustomerVO{
    let idCustomer ='';
    if( this.selectedCustomer.companyCustomerId >0){
      idCustomer = getEncryptedValue(this.selectedCustomer.companyCustomerId);
      
      this.customerService.getFullCustomer(idCustomer).subscribe(
          data => {
            if(data){
              this.fullCustomerss = data;
              this.setSelectedCompanyCustomer();
            }
          }
        );
    }
    return this._selectedCompanyCustomer;
  }

     

  
  fillCustomerPark(customerParkItem : CustomerParkItemVO): any{
    if(!isNullOrUndefined(customerParkItem)){
      customerParkItem.id = 0;
      if(this.selectedCustomer !== null){
          if(this.selectedCustomer.companyCustomerId > 0){
            customerParkItem.customerId = this.selectedCustomer.companyCustomerId;
          } else {
            customerParkItem.customerId = this.selectedCustomer.id;
          }
          customerParkItem.customerBeneficiairyId = this.selectedCustomer.id;
    
        }

      customerParkItem.creatorId = this.authTokenService.applicationUser.coachId;
      customerParkItem.modifierId = this.authTokenService.applicationUser.coachId;
      customerParkItem.dateSubscription = new Date();
      customerParkItem.nicheContractStatus = this.form.get('statutController').value;
      customerParkItem.lineOrigin = this.ligneOrigineControoler.value;
      customerParkItem.isParnasseNumber = this.isParnasseNumber;
      customerParkItem.lineHolder = this.lineHolder;							
    }
  
  }

  getPerson(customer:any, personRole:string):PersonVO {
    this.personOfCustomer = {} as PersonVO;
      // on retourn a new person pour éviter null pointerException (test sur null)
    if (customer === null  ) {
      return this.personOfCustomer;
    }
    if(!isNullOrUndefined(customer.personCustomerRolesLight)){
    const listCutomers = customer.personCustomerRolesLight;
    listCutomers.forEach((person) => {
      if(person.refRole.key === personRole){
          this.personOfCustomer = person;
        }
    });
  }
    return this.personOfCustomer;
  }


  getState(customerpark : any):string {
    if (customerpark !== null && customerpark.customerParkItemContract !== null) {
      switch (this.customerpark.universe) {
       case TELCO_UNIVERS.TEL_MOBILE:
         return getLabelByEnum(customerpark.customerParkItemContract.stateDoss);
         break;
       case TELCO_UNIVERS.TEL_FIXE:
         return getLabelByEnum(customerpark.customerParkItemContract.stateDoss);
         break;
       case TELCO_UNIVERS.INTERNET:
         return getLabelByEnum(customerpark.customerParkItemContract.stateDoss);
         break;
       default:
         return '';
     }
    
    }
    return '';
  }

  getCustomerParkFromDataGrid():CustomerParkItemVO {
    let customerParkItem:CustomerParkItemVO = null;
    customerParkItem = this.customerpark;
    if(!isNullOrUndefined(customerParkItem) 
  && !isNullOrUndefined(customerParkItem.customerParkItemContract)  ) {
      customerParkItem.customerParkItemContract.id = 0;
      customerParkItem.customerParkItemContract.customerParkItemId= 0;
    }
    this.fillCustomerPark(customerParkItem);
    if (this.selectedCustomer !== null && !isNullOrUndefined(customerParkItem)) {
      if (!isNaN(this.selectedCustomer.companyCustomerId) && 
    this.selectedCustomer.companyCustomerId !== 0 && !isNullOrUndefined(this._selectedCompanyCustomer)) {
       customerParkItem.customerIdentifier = this._selectedCompanyCustomer.nicheIdentifier;
       this.getCustomerLastNameFirstName(customerParkItem, this._selectedCompanyCustomer);
     } else {
       customerParkItem.customerIdentifier = this.selectedCustomer.nicheIdentifier;
       this.getCustomerLastNameFirstName(customerParkItem, this.selectedCustomer);
     }
    }
        
    return customerParkItem;
  }

  getCustomerLastNameFirstName(customerPark:CustomerParkItemVO, customer:any):void{
    let lineUserNameTextInput ='';
    lineUserNameTextInput = this.form.get('lineHolderNamee').value;
    if(lineUserNameTextInput !== null && lineUserNameTextInput.length!==0){
      customerPark.lineHolderName = lineUserNameTextInput;
      return;
    } 
    let firstNameLastName = '';
    if (!isNullOrUndefined(customer)  && customer.categoryCustomer === 'PARTICULIER') {
      const person:PersonVO = this.getPerson(customer, CONSTANTS.PERSON_CUSTOMER_BEN);
      if(!isNullOrUndefined(person) && !isNullOrUndefined(person.firstName)  && !isNullOrUndefined(person.lastName)){
          firstNameLastName = person.firstName;
          firstNameLastName = firstNameLastName + this.chaineVide + person.lastName.toUpperCase();
        }
    } else if (!isNullOrUndefined(customer) && customer.categoryCustomer ==='ENTREPRISE' && 
    customer.customerFirstName !== null && customer.customerLastName!== null  ) {
        
        firstNameLastName = customer.customerFirstName;
        firstNameLastName = firstNameLastName + this.chaineVide + customer.customerLastName.toUpperCase();
      } 
    customerPark.lineHolderName = firstNameLastName;
  }

  classError(value: boolean): string {
    if(value) { 
      return 'form-control error';
    }
    return 'form-control';
  }

  gotoRequiredInfo() {
    this.router.navigate(
        [this.customerDashboard, this.customerId, 'detail', 'creation-line','required-info'],
      {
        queryParams: { typeCustomer: this.typeCustomer, customerId: this.customerId },
        queryParamsHandling: 'merge'
      }
      );
  }

  popUpAccountNotFound(): void {
          const title = 'Attention';
          const comment = 'Il n\'y a pas de compte de facturation associé dans Péniche, merci de le créer pour valider l\'enregistrement';
          const btnOkText = 'OK';
          this.confirmationDialogService.confirm(title, comment, btnOkText, null, 'lg',true)
           .then((confirmed) => {
         if (confirmed) {
           this.gotoRequiredInfo();
         }
        })
        .catch(() => console.log('User dismissed the dialog'));
  }

}
