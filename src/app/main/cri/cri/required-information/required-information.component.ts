import { CommonService } from './../../../cart/cart/common.service';
import { Component, OnInit, ElementRef, ViewChild, 
  Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators, ControlContainer, FormGroupDirective, AbstractControl } from '@angular/forms';
import { catchError, map, startWith } from 'rxjs/operators';

import { DatePipe } from '@angular/common';

import { ReferenceDataVO } from '../../../../_core/models';
import { ReferenceDataTypeService, CustomerService, ContactMethodService, ParcLigneService } from '../../../../_core/services';
import { getCustomerIdFromURL } from './../../../../main/customer-dashboard/customer-dashboard-utils';
import { CustomerReferentLight } from '../../../../_core/models/customer-referent-light';
import { CONSTANTS, NICHE_CONTRACTS_STATUTS } from '../../../../_core/constants/constants';
import { CustomerView } from '../../../../_core/models/customer-view';
import { CmInterlocutorVO } from '../../../../_core/models/cm-Interlocutor-vo';
import { PostalAdresseVO } from '../../../../_core/models/postalAdresseVO';
import { CustomerParkItemVO } from '../../../../_core/models/customer-park-item-vo';

import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { PopAddAddressComponent } from '../../../_shared/pop-add-address/pop-add-address.component';

import { CustomerProfileVO } from '../../../../_core/models/customer-profile-vo';
import { ContactMethodVO } from '../../../../_core/models/models';
import { DestinataireVO } from '../../../../_core/models/destinataireVO';
import { firstNameFormatter } from '../../../../_core/utils/formatter-utils';



@Component({
  selector: 'app-required-information',
  templateUrl: './required-information.component.html',
  styleUrls: ['./required-information.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class RequiredInformationComponent implements OnInit, OnChanges  {
  
  listDemandeur: ReferenceDataVO[] = [];
  listHoussingType: ReferenceDataVO[] = [];
  demandeur: ReferenceDataVO ;
  housingTypes: ReferenceDataVO;
  listInterventionRepot: ReferenceDataVO[];
  listTypesInterventionRepot: ReferenceDataVO[];
  showPrecision : boolean;
  precision: boolean;
  coachChecked =true;

  workProChecked = false;
  alarmChecked = false;
  referents: CustomerReferentLight[] = [];
  contactFirstName = '';
  contactLastName = '';
  iscoach = true;
  parkItems: CustomerParkItemVO[];
  coachPresentChecked =false;
  coachNotPresentChecked = false;
  
  customerFull : CustomerProfileVO;
  customer: CustomerView;
  allContactMethod: CmInterlocutorVO[];
  isAreaSupe =false;
  isAreMine =false;
  contact = 'Contact' + '(';
  str1 = ')' ;
  str2 = '-';
  parc = 'Parc' + '('
  
  parcListNumbers: Array<string> = new Array<string>();
  contactListNumbers: Array<string> = new Array<string>();
  @Input() contactMobileList: DestinataireVO[];
  filteredContactMobileList: Observable<DestinataireVO[]>;

  holderBeneficiaryLabel = '';
  labelContactMethod = ''; 
  labelParcMethod = ''; 
  typeCustomer: string ; 
  adresseRdv: PostalAdresseVO[];
  listOfContactPhoneNumbers :ContactMethodVO[];
  dateOfWork = false;
  alarmPresence: boolean;
  listTypesIntervention: Array<ReferenceDataVO> = new Array<ReferenceDataVO>();



  form: FormGroup;
  myControladd = new FormControl();
  contactController= new FormControl();
  workProgress= new FormControl();
  housingType = new FormControl();
  typeLogmentcontroller = new FormControl();
  interventionTypesController = new FormControl();

  requestercontroller = new FormControl();
  alarme = new FormControl();
  parcPhoneController = new FormControl();

// champs domaine intervetion
  
  domaines: ReferenceDataVO[] = [];
  customerId : string;
  customerNeeds : string;
  listtelephone : CmInterlocutorVO[]=[];

  requiredInfoForm: FormGroup;
  endWorkDate =null ;
  garantieChecked =false;
  allDomaines = [];
  nexListOfDomains : ReferenceDataVO[] = [];
  interentionRequesterId : number;
  precis : string;
  address: PostalAdresseVO = null;

  @Input() interventionReport;
  @Input() tabchangedOrSave: boolean;
  @Output() onChangeDomains = new EventEmitter<Array<ReferenceDataVO>>();

  @Output() onChangeInterventionType = new EventEmitter<string>();
  @Output() isFromCriAndCriChangeOut = new EventEmitter<boolean>();
  //=======================Champs validation ========================
  demandeurInvalid = false;
  adresseInvalid = false;
  parcTelInvalid = false;
  typeLogInvalid = false;
  precisionTypeLogInvalid = false;
  superfecieInvalid = false;
  typeInterventionInvalid = false;
  coachInvalid = false;
  doaminIntervInvalid = false;
  garantieInvalid = false;
  contactFNameInvalid = false;
  cantactLNameInvalid = false;
  precisionDemandeurInvalid = false;
  decriptionTraveauInvalid = false;
  typeAlarmeInvalid = false;
//=============================Constructeur==============================
  constructor(private readonly referenceDataTypeService: ReferenceDataTypeService,
    private readonly customerService: CustomerService,
    private readonly route: ActivatedRoute,
    private readonly contactMethodService: ContactMethodService,
    private readonly parcLigneService: ParcLigneService, private readonly modalService: NgbModal,
    readonly fb: FormBuilder,
    private readonly datePipe: DatePipe, 
    public parent: FormGroupDirective,
    private readonly commonService: CommonService
   ) { 
      this.requiredInfoForm  = new   FormGroup({});
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['interventionReport']
    && !changes['interventionReport'].firstChange  && this.interventionReport){
     this.initOnchangeReport();
    }
    if(changes['tabchangedOrSave'] && !changes['tabchangedOrSave'].firstChange  ){
      this.initValidation();
      this.validateRquiredInformation(this.requiredInfoForm.controls.form);
    }
  }
//================================================================================
  initOnchangeReport(){
    this.initDemandeurOnChangeReport();
    this.initContactOnChangeReport();
    this.initAdresseOnChangeReport();
    this.initTypeLogementOnChangeReport();
    this.initSuperficieOnChangeReport();
    this.initWorkProgressOnChangeReport();
    this.initAlarmeOnChangeReport();
    this.initTypeInterventionOnChangeReport();
    this.initCoachPresenceOnChangeReport();
    this.initGarantieOnChangeReport();
    this.initDomains();
    this.initCustomerNeedsOnChangeReport();
  }

  ngOnInit() : any {
    this.customerId = getCustomerIdFromURL(this.route);
    this.formController();
    this.showOrHideBlocs();
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.getTypeCustomer();
    this.getParkUserCategory();
    this.initvalues2();
    this.initValues1();
    this.getHosingType();
    this.getListTypeIntervention();
    this.getListTypesInterventions();
    this.getListdomainsInterventions();
    this.getcoach(true);
    this.getAdressbyPersonId();
    this.getListPhoneNumber();
    this.observeInterventionType();
    this.initFirstNameAndLastName();
    this.initGarantieOnChangeReport();
    this.initCoachPresenceOnChangeReport();
  }

  initFirstNameAndLastName(){
    if(this.interventionReport && this.interventionReport.id){
      this.contactLastName = this.interventionReport.contactName;
      this.contactFirstName = this.interventionReport.contactFirstName;
    }
    
  }
  onChoseAddress(adress : PostalAdresseVO) : void{
    const adr = this.adresseRdv.find((x) => x === adress);
    if(!isNullOrUndefined(this.interventionReport) 
    && !isNullOrUndefined(this.interventionReport.id) &&  
    !isNullOrUndefined(this.interventionReport.postalAdress)){
      this.interventionReport.postalAdress=[];
      this.interventionReport.postalAdress = adr;
    } else {
      this.interventionReport.postalAdress = adr;
    }  
  }

  formController(): void{
    this.requiredInfoForm = this.parent.form;
     this.requiredInfoForm .addControl('form', new FormGroup({
       requestercontroller: this.fb.control(null, [Validators.required]),
       typeLogmentcontroller : this.fb.control(null, [Validators.required]),
       interventionTypesController: this.fb.control(null, [Validators.required]),
       precision: this.fb.control(null),
       contacts : this.contactController,
       lastNameController : this.fb.control(null, [Validators.required]),
       firstNameController : this.fb.control(null, [Validators.required]),
       parcPhoneController : this.parcPhoneController,
       infoController : this.fb.control(null),
       myControladd  : this.fb.control(null, [Validators.required]),
       housingType : this.housingType,
       precisionControler : this.fb.control([Validators.required]),
       superficieController  : this.fb.control(null, [Validators.required]),
       complementController : this.fb.control(null),
       workProgress : this.workProgress,
       DateController : this.fb.control(null),
       alarme : this.alarme,
       typeController : this.fb.control(null),
       worKDescriptionController : this.fb.control(null),
       accessCodeController : this.fb.control(null),
       garantieController : this.fb.control(false, [Validators.required]),
       myDomainsControl : this.fb.control(null, [Validators.required]),
       clientrequestControler : this.fb.control(null),
       coachPresenceControler : this.fb.control(false, [Validators.required])
     }));
  }
getAdressbyPersonId() : void{
  this.customerService.getCustomerProfile(this.customerId).subscribe( data => {
    this.customerFull = data;
    this.adresseRdv = [];
    this.contactMethodService.getListPostalAddress(this.customerFull.person.id).subscribe((data) => {
    this.adresseRdv = data;
    if (this.adresseRdv && this.adresseRdv.length !== 0) {
      this.adresseRdv = this.commonService.sortAdresseRdv(this.adresseRdv);
      this.adresseRdv.forEach (adressee => {
        if ( this.interventionReport !== null && this.interventionReport.postalAdress !== null && adressee.id === this.interventionReport.postalAdress.id){
          this.requiredInfoForm.get('form').get('myControladd').setValue('Adresse '+this.interventionReport.postalAdress.types[0].label); 
        }
      });
      const adresseRdvClone = this.adresseRdv.slice();
      const principalAdresse = adresseRdvClone.filter((adr) =>
        adr.types[0].label.includes('Principal')
      )[0];
    
      if (principalAdresse && this.interventionReport.id === null ) { 
        this.requiredInfoForm.get('form').get('myControladd').setValue('Adresse Principal');
        this.interventionReport.postalAdress =  principalAdresse;
      }
    } else {
      this.requiredInfoForm.get('form').get('myControladd').setValue('- -');
    }   
  } );
   }); 
 
  }
  getParkUserCategory(): void {
    this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('INTERVENTION_REQUEST_ORIGINE',1).subscribe( data => {
      this.listDemandeur = data;
      if(this.interventionReport.refInitiator){
        this.listDemandeur.forEach(contact => {
          if(this.interventionReport !== null && this.interventionReport.id !== null 
            &&this.interventionReport.refInitiator && 
             contact.label===this.interventionReport.refInitiator.label){
            this.requiredInfoForm.get('form').get('requestercontroller').setValue(contact);
          } 
        })
      } else {
        this.requiredInfoForm.get('form').get('requestercontroller').setValue(null);
      }
      if( this.interventionReport && this.interventionReport.refInitiator && this.interventionReport.refInitiator.label==='Autre' ){
        this.showPrecision=true;
        this.addPrecisionValidator();
      }
    });
  }

  onChangeType(event : any) : void{
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    const type = this.listInterventionRepot.find((x) => x.label === selectElementText);
    if(!isNullOrUndefined(this.interventionReport) 
    && !isNullOrUndefined(this.interventionReport.id)) { 
      this.interventionReport.type = null;
      this.interventionReport.type= type;
    } else {
      this.interventionReport.type= type;
    }
  
  }
  onChangeLogement(event : any) : void{
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    const type = this.listHoussingType.find((x) => x.label === selectElementText);
    if(!isNullOrUndefined(this.interventionReport) 
    && !isNullOrUndefined(this.interventionReport.id) &&  
    !isNullOrUndefined(this.interventionReport.refInterventionHousingType)){ 
      this.interventionReport.refInterventionHousingType = null;
      this.interventionReport.refInterventionHousingType= type;
    } else {
      this.interventionReport.refInterventionHousingType= type;
    }
  }

  onChangeInterventionTypes(event : any) : void{
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    const type = this.listTypesIntervention.find((x) => x.label.trim() === selectElementText);
    if(!isNullOrUndefined(this.interventionReport)  && 
    !isNullOrUndefined(this.interventionReport.interventionDetail)
    ){ 
      this.interventionReport.interventionDetail[0].refInterventionType = null;
      this.interventionReport.interventionDetail[0].refInterventionType= type;
    }
  this.requiredInfoForm.get('form').get('interventionTypesController').setValue(type);

   this.onChangeInterventionType.emit(type.label)
  }
  

  onChangeRequester(event : any) : void{

    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    const requester = this.listDemandeur.find((x) => x.label === selectElementText);
    if(!isNullOrUndefined(this.interventionReport) 
    && !isNullOrUndefined(this.interventionReport.id) &&  
    !isNullOrUndefined(this.interventionReport.refInitiator)){ 
      this.interventionReport.refInitiator = [];
      this.interventionReport.refInitiator= requester;
    } else {
      this.interventionReport.refInitiator= requester;
    }
  }

  initInCreateOrCancelCreate(){
    this.customerNeeds = "";
    this.alarmPresence = false;
    this.alarmChecked = false;
    this.requiredInfoForm.get('form').get('alarme').setValue("false"); 
    this.coachNotPresentChecked = true;
    this.garantieChecked = false;
   
    
  }
  initvalues2(): void{
    this.initInCreateOrCancelCreate();
    if(this.interventionReport !== null && this.interventionReport.id !== null) {
      if(this.interventionReport.isCoachPresent){
        this.coachPresentChecked =true;
      } else {
        this.coachPresentChecked = false;
      }
      if (this.interventionReport.interventionDetail[0] && this.interventionReport.interventionDetail[0].inWarranty === true) {

        this.garantieChecked = true;
      } else {
         this.garantieChecked = false;
      }
      if (this.interventionReport.interventionDetail[0] && this.interventionReport.interventionDetail[0].customerNeeds) {

        this.customerNeeds = this.interventionReport.interventionDetail[0].customerNeeds;
      }

      if (!isNullOrUndefined(this.interventionReport.type)) {
        this.requiredInfoForm.get('form').get('alarme').setValue("true");
        this.alarmPresence = true;
        this.addTypeAlarmeValidator();
        this.alarmChecked = true;
      } else {
        this.requiredInfoForm.get('form').get('alarme').setValue("false");
        this.alarmPresence = false;
        this.removeTypeAlarmeValidator();
        this.alarmChecked = false;
      }
     
    }
  }

  initValues1(): void{
    this.dateOfWork = false;
    this.endWorkDate = null;
    this.requiredInfoForm.get('form').get('workProgress').setValue("false"); 
    this.requiredInfoForm.get('form').get('superficieController').setValue(null);
    this.coachChecked = true;
    this.contactController.setValue("true");
    
    if(!isNullOrUndefined(this.interventionReport && this.interventionReport.id)){
      if(this.interventionReport.isCoachContact===true){
        this.coachChecked = true;
        this.contactController.setValue("true");
        this.removeParcValidator();
      }
      if(this.interventionReport.isMembreContact===true){
        this.coachChecked = false;
        this.contactController.setValue("false");
        this.addParcValidator();
      }

      if( this.interventionReport.isAreaSup===false ){
        this.isAreaSupe =true;
        this.requiredInfoForm.get('form').get('superficieController').setValue("true");
      } else {
        this.isAreMine = true;
        this.requiredInfoForm.get('form').get('superficieController').setValue("false");
      }
      if(this.interventionReport.isWorkInProgress){
        this.workProChecked = true;
        this.requiredInfoForm.get('form').get('workProgress').setValue("true"); 
        this.dateOfWork = true;
        this.addDescriptionTraveauValidator();
      } else {
        this.workProChecked = false;
        this.requiredInfoForm.get('form').get('workProgress').setValue("false"); 
        this.removeDescriptionTraveauValidator();
      }
      if (this.interventionReport.endWorkDate) {
        this.endWorkDate = this.transformDateInterven(this.interventionReport.endWorkDate);
      }
    }
    this.interventionReport.isWorkInProgress =false
  }

  onSelectStartDate(event: any):void{
    this.interventionReport.endWorkDate= event.value;
  }

  updateCustomerNeeds() : void{
    this.interventionReport.interventionDetail[0].customerNeeds=this.requiredInfoForm.get('form').get('clientrequestControler').value;
  }

  
  changeRequester(): void{

    this.requiredInfoForm.get('form').get('requestercontroller').valueChanges.subscribe(
      (data) => { 
        if(data){
        if ( data.label === 'Autre') {
          this.showPrecision = true;
          this.addPrecisionValidator();
        } else  {
          this.showPrecision = false;
          this.removePrecisionValidator();
        }
      }
      }
      );
 }

  getTypeCustomer(): void {
    if (this.typeCustomer === CONSTANTS.TYPE_COMPANY ) {
      this.holderBeneficiaryLabel = 'Titulaire' ; 
    } else if (this.typeCustomer === CONSTANTS.TYPE_BENEFICIARY ) {
      this.holderBeneficiaryLabel = 'Bénéficiaire' ;
    } else if (this.typeCustomer === CONSTANTS.TYPE_PARTICULAR ) {
      this.holderBeneficiaryLabel = 'Particulier' ; 
    }
  }

  getHosingType(): void {
   
    this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('HOUSING_TYPE',1).subscribe( data => {
      this.listHoussingType = data;
      if(this.interventionReport.refInterventionHousingType){
        this.listHoussingType.forEach(housing => {
          if(this.interventionReport  && this.interventionReport.id 
            && this.interventionReport.refInterventionHousingType 
            && housing.label===this.interventionReport.refInterventionHousingType.label){
          this.requiredInfoForm.get('form').get('typeLogmentcontroller').setValue(housing);
          }   
        })
      } else {
        this.requiredInfoForm.get('form').get('typeLogmentcontroller').setValue(null);
      }
   
    }); 
    
  }

  getListTypeIntervention(): void {
   
    this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('INTERVENTION_REPORT',1).subscribe( data => {
      this.listInterventionRepot = data;
    if(!isNullOrUndefined(this.interventionReport.type)){
      this.listInterventionRepot.forEach (type => {
    if ( this.interventionReport !== null && this.interventionReport.id !== null 
          && this.interventionReport.type !==null &&
          type.label===this.interventionReport.type.label){
      this.requiredInfoForm.get('form').get('typeController').setValue(type); 
    } 
      });
    } else {
      this.requiredInfoForm.get('form').get('typeController').setValue(null); 
    }
    }); 
    
  }

  getListdomainsInterventions(): void {
   if(!isNullOrUndefined( this.allDomaines) && this.allDomaines.length > 0){
    this.initDomains();
   } else {
    this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('INTERVENTION_DOMAIN',1).subscribe( data => {
      this.listTypesInterventionRepot = data;
      this.listTypesInterventionRepot.forEach (domaine => {
      this.allDomaines.push(domaine);
      });
      this.initDomains();
    });
   }
   
    
  }
  //==============================INIT DOMAINS=======================================
  initDomains(){
    this.domaines = [];
    if(this.interventionReport !== null && this.interventionReport.id !== null ){
         this.nexListOfDomains= this.interventionReport.interventionDetail[0].interventionDomaine;
        if(!isNullOrUndefined(this.interventionReport.interventionDetail[0].interventionDomaine)){
        this.domaines = this.nexListOfDomains;
      }
    } else {
      if(this.interventionReport.interventionDetail && this.interventionReport.interventionDetail[0] &&
        !isNullOrUndefined(this.interventionReport.interventionDetail[0].interventionDomaine)){
        this.domaines = this.interventionReport.interventionDetail[0].interventionDomaine;
      }
    }
    if (this.domaines.length > 0) {
      this.domaines.forEach(d => {
        const index = this.allDomaines.findIndex( elt => elt.id === d.id);
        this.allDomaines[index].checked = true;
      });
    }
    this.requiredInfoForm.get('form').get('myDomainsControl').setValue(this.domaines);
    this.onChangeDomains.emit(this.domaines);
  }
  //======================================================
  getListTypesInterventions(): void {
    if(isNullOrUndefined(this.listTypesIntervention) ||  this.listTypesIntervention.length === 0){
      this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('INTERVENTION_TYPE',1).subscribe( data => {
        this.listTypesIntervention = (data); 
      this.setTypeIntervention();
      
      }); 
    } else {
      this.setTypeIntervention();
    }  
  }
  setTypeIntervention(){
    if( this.interventionReport.interventionDetail
      && !isNullOrUndefined(this.interventionReport.interventionDetail[0].refInterventionType)){
      this.listTypesIntervention.forEach(type => {
        if ( this.interventionReport !== null && this.interventionReport.id !== null && 
          this.interventionReport.interventionDetail[0].refInterventionType &&
          type.label===this.interventionReport.interventionDetail[0].refInterventionType.label){
          this.requiredInfoForm.get('form').get('interventionTypesController').setValue(type); 
        }
       
      });
    } else {
      this.requiredInfoForm.get('form').get('interventionTypesController').setValue(null); 
    }
  
  }



//======================================================================================

  remove(domaine: ReferenceDataVO): void {
    const index = this.domaines.findIndex(d => d.id === domaine.id);
    if (index >= 0) {
      this.domaines.splice(index, 1);
      this.interventionReport.interventionDetail[0].interventionDomaine = this.domaines;
    }
  }
  
  // max 4 selected
  selected(domain ): void {
    this.domaines.push(domain);
    this.pushDomainesInReport(domain);
  }

  onSelect (event , domain ) {
    if (event.target.checked) {
      if (this.domaines.length < 4  ) {
       this.selected(domain);
      }else {
        event.target.checked = false;
      }
    } else {
      this.remove(domain);
    }
    this.isFromCriAndCriChangeOut.emit(true);
    this.requiredInfoForm.get('form').get('myDomainsControl').setValue( this.domaines);
    this.onChangeDomains.emit(this.domaines.slice());
  }
  
 
//================================================================================
  pushDomainesInReport(selectedDomain: any){
    if(this.interventionReport !== null && this.interventionReport.id !== null && 
      this.interventionReport.interventionDetail && 
      this.interventionReport.interventionDetail[0]){
        if(!isNullOrUndefined(this.interventionReport.interventionDetail[0].interventionDomaine)){
          const existe = this.interventionReport.interventionDetail[0].interventionDomaine.find(domaine => domaine === selectedDomain);
          if(isNullOrUndefined(existe)) {
            this.interventionReport.interventionDetail[0].interventionDomaine = this.domaines;
          }
        } else {
          this.interventionReport.interventionDetail[0].interventionDomaine = [];
          this.interventionReport.interventionDetail[0].interventionDomaine = this.domaines;
        }  
    }
    this.interventionReport.interventionDetail[0].interventionDomaine = this.domaines;
  }
  onClickContactMembre() : boolean{
      this.contactController
      .valueChanges.subscribe(
     (data) => {
       if(data==='true'){
         this.coachChecked= true;
         this.removeParcValidator();
         this.getcoach(false);
       } else if(data==='false'){
         this.coachChecked  = false;
         this.addParcValidator();
         this.getmember(false);
       }
     });
     return this.coachChecked;
    
     
    }

  getTypes(types: any): string {
    let str = ''; 
    if(types !== null && types.length > 0){
     for (let i = 0; i < types.length; i++) {
     str += types[i].label;
     if( i < types.length - 1 )  {
       str += ',';
     }
   }
     
   }
   return str;

  }
//=============================================================================
  getmember(isInit) : any{
  const customerId = getCustomerIdFromURL(this.route);
  this.customerService.getFullCustomer(customerId).subscribe( data => {
    this.customerFull = data;
    this.onClickContactMembre()
    if( this.customerFull != null && this.coachChecked===false   ){
      if(isInit && !isNullOrUndefined(this.interventionReport.id)){
        this.initFirstNameAndLastName();
      } else {  
      this.contactFirstName=this.customerFull.person.firstName;
      this.contactLastName= this.customerFull.person.lastName;
      this.interventionReport.contactName =  this.contactLastName;
      this.interventionReport.contactFirstName =  this.contactFirstName;
      this.interventionReport.isCoachContact =false;
      this.interventionReport.isMembreContact= true;
      }
    }
 
  });
 }
  getcoach(isInit) : any{
  const customerId = getCustomerIdFromURL(this.route);
  this.customerService
    .getListReferents(customerId)
    .pipe(catchError(() => of(null)))
    .subscribe(
      (referents) => {
        this.referents = referents;
        this.referents.forEach(element => {
         this.onClickContactMembre()
          if (element.roleId === CONSTANTS.ROLE_COACH && this.coachChecked===true) {
            if(isInit && !isNullOrUndefined(this.interventionReport.id)){
              this.initFirstNameAndLastName();
            } else {
              this.contactFirstName = element.firstName;
              this.contactLastName = element.lastName;
              this.interventionReport.contactName =  this.contactLastName;
              this.interventionReport.contactFirstName =  this.contactFirstName;
              this.interventionReport.isCoachContact =true;
              this.interventionReport.isMembreContact= false;
            }
          } 
        });

      }
    );
  }


 housingTypesChanges(): void{
  this.requiredInfoForm.get('form').get('typeLogmentcontroller').valueChanges.subscribe(
    (data) => { 
      if(data){
  if (data.label === 'Autre') {
    this.precision = true;
    this.addPrecisionLogValidator();
      } else {
    this.precision = false;
    this.removePrecisionLogValidator();
          } 
        }
        });
}
//===========================change chekbox Superficie ==== ====================
housingSuperficieChange(valueCheck){
if(valueCheck.srcElement.id === 'isAreaSupe'){
  this.interventionReport.isAreaSup = false;
}else{this.interventionReport.isAreaSup = true;}
}
//===========================change chekbox Traveau en cours ====================
progressWorkChange(valueCheck){
  if(valueCheck.srcElement.id === 'workProgressTrue'){
    this.addDescriptionTraveauValidator();
    this.dateOfWork = true;
    this.interventionReport.isWorkInProgress = true;
  }else{
    this.removeDescriptionTraveauValidator();
    this.interventionReport.isWorkInProgress = false;
    this.dateOfWork = false;
}
  }
//===========================Change Alarme ====================================
alarmeChange(valueCheck){
  if(valueCheck.srcElement.id === 'alarmeTrue'){
    this.alarmPresence = true;
    this.addTypeAlarmeValidator();
  }else{
    this.alarmPresence = false;
    this.interventionReport.type = null;
    this.removeTypeAlarmeValidator();
  }
  }
//===============================Change Coach================================
 coachChange(valueCheck){
  if(valueCheck.srcElement.id === 'coachPresentTrue'){
    this.interventionReport.isCoachPresent =true;
  }else{this.interventionReport.isCoachPresent =false;}

  }
//==============================Change Garantie==============================
garantieChange(valueCheck){
    if(!isNullOrUndefined(this.interventionReport.interventionDetail) && 
    !isNullOrUndefined(this.interventionReport.interventionDetail[0])){
      this.interventionReport.interventionDetail[0].inWarranty = 
      valueCheck.srcElement.id === 'garantieTrue' ? true : false;
    } else {
      this.interventionReport.interventionDetail[0] = [];
      this.interventionReport.interventionDetail[0].inWarranty = 
      valueCheck.srcElement.id === 'garantieTrue' ? true : false;
    }
  }
//=================================================================================
cantactChange(valueCheck){
  if(valueCheck.srcElement.id === 'coach'){
    this.interventionReport.isCoachContact =true;
    this.interventionReport.isMembreContact= false;
    this.coachChecked= true;
    this.removeParcValidator();
    this.getcoach(false);
  } else {
    this.interventionReport.isCoachContact =false;
    this.interventionReport.isMembreContact= true;
    this.coachChecked = false;
    this.addParcValidator();
    this.getmember(false);
  }
}
showOrHideBlocs() : void  {
  this.housingTypesChanges();
  this.changeRequester();
}

  
 transformDateInterven(date):Date{
  const patternDate = "yyyy-MM-dd";
  return date ? new Date(this.datePipe.transform(date, patternDate)): null
  }

 openPopup() {
  let valueResult: PostalAdresseVO  = {} as PostalAdresseVO;
  const modal = this.modalService.open(PopAddAddressComponent, { centered: true, 
    windowClass: 'custom_popup',
    size: 'lg', backdrop : 'static', keyboard: false
    });
    modal.componentInstance.personId = this.customerFull.person.id;
    modal.componentInstance.customerId = this.customerId;
    modal.componentInstance.resultCmPostalAddressVO.subscribe((emmitedValue) => {
      valueResult = emmitedValue;
    }); 
    modal.result.then((result) => {
       if(result) {
        this.getAddressTemporaire(valueResult);
       }
    });
  }

  getAddressTemporaire(postalAddress: PostalAdresseVO): void {
      this.adresseRdv.push(postalAddress);
        this.adresseRdv = this.commonService.sortAdresseRdv(this.adresseRdv);
        this.requiredInfoForm.get('form').get('myControladd').setValue(postalAddress);
        this.requiredInfoForm.get('form').get('myControladd').setValue(`Adresse ${postalAddress.types[0].label}`);
        this.interventionReport.postalAdress =  postalAddress;
        console.log(' postalAddress temporaire ', this.interventionReport.postalAdress);
    
      }
  
   /**
    * @author YFA
    * watch modification on intervention type to
    * update blocks in information technic tab
    */
  observeInterventionType(){
    this.requiredInfoForm.get('form').get('interventionTypesController').valueChanges.subscribe(
      (type)=> {
        if(type && type.label){
          this.onChangeInterventionType.emit(type.label);
        }
      }
    );
  
  }

//=================================Add Validators Precision==============================
addPrecisionValidator(){
  this.requiredInfoForm.get('form').get('precision').setValidators(Validators.required);
  this.requiredInfoForm.get('form').get('precision').updateValueAndValidity();
 }
//=================================Remove validators Precision==============================

removePrecisionValidator(){
  this.requiredInfoForm.get('form').get('precision').setValidators(null);
  this.requiredInfoForm.get('form').get('precision').updateValueAndValidity();
 }
 //=================================Add Validators Precision==============================
addPrecisionLogValidator(){
  this.requiredInfoForm.get('form').get('precisionControler').setValidators(Validators.required);
  this.requiredInfoForm.get('form').get('precisionControler').updateValueAndValidity();
 }
//=================================Remove validators Precision==============================

removePrecisionLogValidator(){
  this.requiredInfoForm.get('form').get('precisionControler').setValidators(null);
  this.requiredInfoForm.get('form').get('precisionControler').updateValueAndValidity();
 }
  //=================================Add Validators Precision==============================
addParcValidator(){
  this.requiredInfoForm.get('form').get('parcPhoneController').setValidators([ Validators.required, this.phoneNumberValidator]);
    this.requiredInfoForm.get('form').get('parcPhoneController').updateValueAndValidity();
}
//=================================Remove validators Precision==============================

removeParcValidator(){
  this.requiredInfoForm.get('form').get('parcPhoneController').setValidators(null);
  this.requiredInfoForm.get('form').get('parcPhoneController').updateValueAndValidity();
 }
//==============================validation ======================================
addDescriptionTraveauValidator(){
  this.requiredInfoForm.get('form').get('worKDescriptionController').setValidators(Validators.required);
  this.requiredInfoForm.get('form').get('worKDescriptionController').updateValueAndValidity();
 }
//=================================Remove validators Precision==============================

removeDescriptionTraveauValidator(){
  this.requiredInfoForm.get('form').get('worKDescriptionController').setValidators(null);
  this.requiredInfoForm.get('form').get('worKDescriptionController').updateValueAndValidity();
 }
 //==============================validation ======================================
 //==============================validation ======================================
addTypeAlarmeValidator(){
  this.requiredInfoForm.get('form').get('typeController').setValidators(Validators.required);
  this.requiredInfoForm.get('form').get('typeController').updateValueAndValidity();
 }
//=================================Remove validators Precision==============================

removeTypeAlarmeValidator(){
  this.requiredInfoForm.get('form').get('typeController').setValidators(null);
  this.requiredInfoForm.get('form').get('typeController').updateValueAndValidity();
 }
 //==============================validation ======================================
validateRquiredInformation(form){ 
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {

        switch (name) {
          case 'requestercontroller':
            this.demandeurInvalid = true;
          break;
          case 'typeLogmentcontroller':
          this.typeLogInvalid = true;
          break;
          case 'precision':
          this.precisionDemandeurInvalid = true;
          break;
          case 'firstNameController':
          this.contactFNameInvalid = true;
          case 'lastNameController':
            this.cantactLNameInvalid = true;
          break;
          case 'parcPhoneController':
          this.parcTelInvalid = true;
          break;
          case 'precisionControler':
          this.precisionTypeLogInvalid = true;
          break;
          case 'superficieController':
          this.superfecieInvalid = true;
          break;
          case 'garantieController':
          this.garantieInvalid = true;
          break;
          case 'myDomainsControl':
          this.doaminIntervInvalid = true;
          break;
          case 'coachPresenceControler':
          this.coachInvalid = true;
          break;
          case 'interventionTypesController':
          this.typeInterventionInvalid = true;
          break;
          case 'myControladd':
            this.adresseInvalid = true;
          break;
          case 'worKDescriptionController':
            this.decriptionTraveauInvalid = true;
          break;
          case 'typeController':
            this.typeAlarmeInvalid = true;
          break;
          default:
          console.log('valide');
           break;
          }
          }
      } 
}

initValidation(){
  this.demandeurInvalid = false;
  this.adresseInvalid = false;
  this.parcTelInvalid = false;
  this.typeLogInvalid = false;
  this.precisionTypeLogInvalid = false;
  this.superfecieInvalid = false;
  this.typeInterventionInvalid = false;
  this.coachInvalid = false;
  this.doaminIntervInvalid = false;
  this.garantieInvalid = false;
  this.contactFNameInvalid = false;
  this.cantactLNameInvalid = false;
  this.precisionDemandeurInvalid = false;
  this.decriptionTraveauInvalid = false;
  this.typeAlarmeInvalid  = false;
}
//=====================================Fin validation======================================
initDemandeurOnChangeReport(){
  this.showPrecision = false;
  this.removePrecisionValidator();
  this.requiredInfoForm.get('form').get('requestercontroller').setValue(null);
  if( this.interventionReport && this.interventionReport.refInitiator){
    const demandeur = this.listDemandeur.find((demandeur) => demandeur.id === this.interventionReport.refInitiator.id)
    if(!isNullOrUndefined(demandeur)){
      this.requiredInfoForm.get('form').get('requestercontroller').setValue(demandeur);
      if(this.interventionReport.refInitiator && this.interventionReport.refInitiator.label==='Autre' ){
        this.showPrecision = true;
        this.addPrecisionValidator();
      }
    }
  }
}
//=======================================================================================
initContactOnChangeReport(){
    if(this.interventionReport.isMembreContact===true){
      this.coachChecked = false;
      this.contactController.setValue("false");
      this.addParcValidator();
    }
    else{
        this.coachChecked = true;
        this.contactController.setValue("true");
        this.removeParcValidator();
    }
}

//==================================================================================
initAdresseOnChangeReport(){
  this.requiredInfoForm.get('form').get('myControladd').setValue(null); 
if(this.interventionReport && this.interventionReport.postalAdress){
  this.requiredInfoForm.get('form').get('myControladd').setValue(this.interventionReport.postalAdress.types[0].label); 
}
}
//=======================================================================================
initTypeLogementOnChangeReport(){
  this.requiredInfoForm.get('form').get('typeLogmentcontroller').setValue(null);
  if(this.interventionReport.refInterventionHousingType){
    const housing = this.listHoussingType.find((housing) => housing.id === this.interventionReport.refInterventionHousingType.id)
    if(!isNullOrUndefined(housing)){
      this.requiredInfoForm.get('form').get('typeLogmentcontroller').setValue(housing);
    }
    }
}
//=========================================================================
initSuperficieOnChangeReport(){
  this.requiredInfoForm.get('form').get('superficieController').setValue(null)
  if( this.interventionReport.isAreaSup===false ){
    this.isAreaSupe =true;
    this.requiredInfoForm.get('form').get('superficieController').setValue("true");
  }
  if( this.interventionReport.isAreaSup===true){
    this.isAreMine = true;
    this.requiredInfoForm.get('form').get('superficieController').setValue("false");
  }
}
//================================================================================
initWorkProgressOnChangeReport(){
 if(this.interventionReport.isWorkInProgress){
    this.workProChecked = true;
    this.requiredInfoForm.get('form').get('workProgress').setValue("true"); 
    this.dateOfWork = true;
    this.addDescriptionTraveauValidator();
    if (this.interventionReport.endWorkDate) {
      this.endWorkDate = this.transformDateInterven(this.interventionReport.endWorkDate);
    }
  } else {
    this.workProChecked = false;
    this.removeDescriptionTraveauValidator();
    this.requiredInfoForm.get('form').get('workProgress').setValue("false"); 
    this.dateOfWork = false;
  }
}
//===========================================================================
initAlarmeOnChangeReport(){
  if (this.interventionReport.type) {
    this.requiredInfoForm.get('form').get('alarme').setValue("true");
    this.alarmPresence = true;
    this.alarmChecked = true;
    const type = this.listInterventionRepot.find((type) => type.id === this.interventionReport.type.id)
    if(!isNullOrUndefined(type)){
      this.requiredInfoForm.get('form').get('typeController').setValue(type);
    }      
  } else {
    this.requiredInfoForm.get('form').get('alarme').setValue("false");
    this.alarmPresence = false;
    this.removeTypeAlarmeValidator();
    this.alarmChecked = false;
  }
}
//===============================================================================
initTypeInterventionOnChangeReport(){
  this.requiredInfoForm.get('form').get('interventionTypesController').setValue(null);
  if(this.interventionReport.interventionDetail 
    && this.interventionReport.interventionDetail[0].refInterventionType){
      const intervTypeIn = this.interventionReport.interventionDetail[0].refInterventionType ;
      const typeInterv = this.listTypesIntervention.find((typeInterv) => typeInterv.id === intervTypeIn.id)
      if(!isNullOrUndefined(typeInterv)){
        this.requiredInfoForm.get('form').get('interventionTypesController').setValue(typeInterv);
      }
    }
}
//=========================================================================================
initCoachPresenceOnChangeReport(){
  if(this.interventionReport.isCoachPresent){
    this.coachPresentChecked =true;
    this.requiredInfoForm.get('form').get('coachPresenceControler').setValue("true");
  } else {
    this.coachPresentChecked = false;
    this.requiredInfoForm.get('form').get('coachPresenceControler').setValue("false");
  }
}
//=========================================================================================
initGarantieOnChangeReport(){
  if (this.interventionReport.interventionDetail &&
    this.interventionReport.interventionDetail[0] && 
    this.interventionReport.interventionDetail[0].inWarranty === true) {
    this.garantieChecked = true;
    this.requiredInfoForm.get('form').get('garantieController').setValue("true");
  } else {
    this.garantieChecked = false;
    this.requiredInfoForm.get('form').get('garantieController').setValue("false");
  }
}
//===================================================================================
initCustomerNeedsOnChangeReport(){
  this.customerNeeds = "";
  if (this.interventionReport.interventionDetail && 
    this.interventionReport.interventionDetail[0] && 
    this.interventionReport.interventionDetail[0].customerNeeds) {

    this.customerNeeds = this.interventionReport.interventionDetail[0].customerNeeds;
  }
}

/**
 * @author: ich
 * @description: BEGINNING ATHENA-5316 => [FR - CRI] Modification du champ téléphone de contact du CRI
 **/
  setMobileContactInForm(): void {
    let phoneNumber : DestinataireVO;
    if(this.interventionReport !== null && this.interventionReport.id !== null ) {
        if (this.interventionReport.phoneNumber !==null && this.interventionReport.phoneNumber.id !== null) {
          phoneNumber = this.contactMobileList.find( el => el.phoneNumber === this.interventionReport.phoneNumber.value);
        } else if( this.interventionReport.customerParkItem !==null && this.interventionReport.customerParkItem.id !== null){
          phoneNumber = this.contactMobileList.find( el => el.phoneNumber === this.interventionReport.customerParkItem.webServiceIdentifier);
        } else if (this.interventionReport.contactPhoneNumber !== null) {
          phoneNumber = { 'contactMethodId': null, 'parcItemId': null, 'phoneNumber': this.interventionReport.contactPhoneNumber} as DestinataireVO;
        }
    }
    this.requiredInfoForm.get('form').get('parcPhoneController').setValue(phoneNumber);
  }

  getListPhoneNumber() {
    if (!isNullOrUndefined(this.interventionReport.contactPhoneNumber)) {
      this.contactMobileList.unshift({
        'contactMethodId': null, 'parcItemId': null, 'phoneNumber': this.interventionReport.contactPhoneNumber,
      } as DestinataireVO );
    }
    
    this.filteredContactMobileList = this.parcPhoneController.valueChanges.pipe(
      startWith(''),
      map(value => this._filterContactMobileList(value))
    );
    this.setMobileContactInForm();
  }

  _filterContactMobileList(value: string): DestinataireVO[] {
    if (  isNullOrUndefined(value) ||   (typeof value !== 'string')  ) {
      this.interventionReport.contactPhoneNumber = null;
      this.interventionReport.phoneNumber = null;
      this.interventionReport.customerParkItem= null ;
      return this.contactMobileList.slice();
    } else {
      const filterValue = value.toLowerCase().trim();
      this.interventionReport.contactPhoneNumber = value;
      this.interventionReport.phoneNumber = null;
      this.interventionReport.customerParkItem= null ;
      return this.contactMobileList.filter( option => option.phoneNumber.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  displayMobileContact(mobilContact: DestinataireVO): string {
    return  mobilContact.phoneNumber;
  }

  onChoosePhoneMobile(mobilContact: DestinataireVO): void {
    if (mobilContact.contactMethodId === null && mobilContact === null) {
      this.interventionReport.phoneNumber = null;
      this.interventionReport.customerParkItem= null ;
      this.interventionReport.contactPhoneNumber= mobilContact.phoneNumber; 
    } else if(mobilContact.parc) {
      this.interventionReport.phoneNumber = null;
      this.interventionReport.customerParkItem= { id: mobilContact.parcItemId } as CustomerParkItemVO ; 
      this.interventionReport.contactPhoneNumber= null;
    } else {
      this.interventionReport.phoneNumber = { id: mobilContact.contactMethodId} as CmInterlocutorVO;
      this.interventionReport.customerParkItem= null ; 
      this.interventionReport.contactPhoneNumber= null;
    }
  }

  formatContactMobile(destinataire: DestinataireVO) {
    let statuts = NICHE_CONTRACTS_STATUTS.STATUS.slice().filter((status)=>status.key===destinataire.status);
    const CONCATENATION =' ';
    if (destinataire && (destinataire.firstName || destinataire.lastName)) {
      const name = 
      ((!isNullOrUndefined(destinataire.firstName) &&  destinataire.firstName != ' ') ? (firstNameFormatter(destinataire.firstName) +  CONCATENATION ) : '')  
      + (!isNullOrUndefined(destinataire.lastName) ? (destinataire.lastName.toUpperCase()) : '');
      if (!destinataire.parc) {
        return  name + CONCATENATION + destinataire.role + CONCATENATION + destinataire.contactType + CONCATENATION + destinataire.phoneNumber ;
      } else if ((this.typeCustomer === CONSTANTS.TYPE_BENEFICIARY  && statuts.length !==0) || this.typeCustomer !== CONSTANTS.TYPE_BENEFICIARY ) {
        const PARC  = ' parc ';
        return name + PARC + destinataire.phoneNumber;
      } 
    } else if( ! isNullOrUndefined( destinataire.phoneNumber)) {
      return destinataire.phoneNumber;
    }
  }

  phoneNumberValidator(control: AbstractControl) {
    let value = control.value;
    const regex = /^[\+\d]{1}(\d{0,19})$/gi;
    if ( typeof value === 'string' && !isNullOrUndefined(value)  && value.match(regex) == null ){
      return { invalidPhoneNumber: {value: control.value}}
    }
    return null;
  }

  /**
 * @author: ich
 * @description: END ATHENA-5316 => [FR - CRI] Modification du champ téléphone de contact du CRI
 **/
}
