import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { ProfilContractService } from '../profil-contract.service';
import { ReferenceDataTypeService } from '../../../../_core/services';
import { ReferenceDataVO } from '../../../../_core/models';
import { CustomerVO } from '../../../../_core/models/customer-vo';
import { PersonVO } from '../../../../_core/models/person-vo';
import { STATUS_CUSTOMER } from '../../../../_core/constants/constants';


@Component({
  selector: 'app-contractual-status-modification',
  templateUrl: './contractual-status-modification.component.html',
  styleUrls: ['./contractual-status-modification.component.scss']
})
export class ContractualStatusModificationComponent implements OnInit, OnChanges {

  @Input()
  customer: CustomerVO;

  @Input()
  person: PersonVO;

  listCompteTest: ReferenceDataVO[];
  listMotifAdhesion: ReferenceDataVO[];
  lCommentMmbreATilConnuParnasse: ReferenceDataVO[];
  lMotifRealisation: ReferenceDataVO[];
  commentMmbreATilConnuParnasse: ReferenceDataVO;

  formStatusContrat: FormGroup;
  hourIntronisation = 0;
  MinuteIntronisation = 0;

  // to prevent new data of  form
  @Output() changeCustomerFormStatus = new EventEmitter<CustomerVO>();

  @Output() changePersonFormStatus = new EventEmitter<PersonVO>();

  @Output()
  changeDirtyStatusContractualForm = new EventEmitter<boolean>();

  @Input()
  isSelected = false;
  asterix = '';

  isProspectOrContact = false;


  lStatus: Array<{id: number, value: string}>;
   isCancledMember = false;
   motifInvalid = false;
   STATUS_FORM = 'status';
  constructor(readonly fb: FormBuilder,
    readonly profilContractService: ProfilContractService,
    readonly referenceDataTypeService: ReferenceDataTypeService) { }


  ngOnChanges(changes: SimpleChanges): void {
       this.profilContractService.getIsProspectOrContact().subscribe(value => {
        this.asterix = this.profilContractService.getAsterix(value);
        this.isProspectOrContact = value;
       })
       
  }


  ngOnInit() {
    this.lStatus = this.getListStatus();
    this.formStatusContrat =  this.buildPenicheFrom();
    this.initMotifAdhesion();
    this.initCompteTest();
    this.initCommentMemberATilConnuParnasse();
    this.initMotifRealisation();
    this.onChangeForm();
    this.showCancledDateIninit();
  }

  buildPenicheFrom(): any {
    return this.fb.group({
      status: this.fb.control(this.customer.status),
      isMemberValidated: this.fb.control(this.customer.isMemberValidated),
      isHonoraryMember: this.fb.control(this.person.isHonoraryMember),
      isFounderMembership: this.fb.control(this.person.isFounderMembership),
      refTestAccount: this.fb.control(this.person.refTestAccount),
      prospectingAdmissionDate: this.fb.control(this.initDate(this.customer.prospectingAdmissionDate)),
      nicheAdmissionDate: this.fb.control(this.initDate(this.customer.nicheAdmissionDate)),
      dateOfTechnicalStudy: this.fb.control(this.initDate(this.customer.dateOfTechnicalStudy)),
      installationDate: this.fb.control(this.initDate(this.customer.installationDate)),
      realisationStatus: this.fb.control(this.customer.realisationStatus),
      refMembershipReason: this.fb.control(this.customer.refMembershipReason),
      refMembershipReason2: this.fb.control(this.person.refMembershipReason2),
      additionalInformations: this.fb.control(this.person.additionalInformations),
      dateHomologation: this.fb.control(this.initDate(this.customer.dateHomologation)),
      acceptanceDate: this.fb.control(this.initDateIntro(this.customer.acceptanceDate)),
      paymentDate: this.fb.control(this.initDate(this.customer.paymentDate)),
      contractCessionDate: this.fb.control(this.initDate(this.customer.contractCessionDate)),
      refParnasseKnowledge: this.fb.control(this.person.refParnasseKnowledge),
      refCancellationReason: this.fb.control(this.customer.refCancellationReason),
      motifRealisation: this.fb.control(false),
      commentConnuParna: this.fb.control(false),
      hourIntronisation: this.fb.control(0),
      MinuteIntronisation: this.fb.control(0),
      cancellationDate : this.fb.control(this.initDate(this.customer.cancellationDate)),
    })
  }

  initDate(date: Date): Date {
    if(!isNullOrUndefined(date)) {
     return new Date(date);
    }
    return null;
  }

  initDateIntro(date: Date): Date {
    if(!isNullOrUndefined(date)) {
      const newDate = new Date(date);
      this.hourIntronisation = newDate.getHours();
      this.MinuteIntronisation = newDate.getMinutes();
      return newDate;
    }
    return null;
  }

  onChangeTime(time: string): void {
    this.formStatusContrat.get('hourIntronisation').setValue(Number(time.substring(0, 2)));
    this.formStatusContrat.get('MinuteIntronisation').setValue(Number(time.substring(4, 7)));
  }

  initCompteTest(): void {
    this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('TEST_ACCOUNT',1).subscribe(data => {
     this.listCompteTest = data;
     this.initCompTest();
   });
  }

  initCompTest() {
    if(!this.person.refTestAccount){
      this.formStatusContrat.get('refTestAccount').setValue(null);
    }else{
      this.listCompteTest.forEach(
        (type)=>{
          if(type.label === this.person.refTestAccount.label){
            this.formStatusContrat.get('refTestAccount').setValue(type);
          }
        }
      );
    }
  }

  initMotifAdhesion(): void {
    this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('MEMBERSHIP_REASON',1).subscribe(data => {
      this.listMotifAdhesion = data;
      this.initMotifAdh();
      this.initMotifSec();
    });
  }

  initCommentMemberATilConnuParnasse(): void {
    this.referenceDataTypeService.getReferenceDatasByTypeAndNiche('CUSTOMER_KNOWLEDGE_PARNASSE_KNOWLEDGE',1).subscribe(data => {
      this.lCommentMmbreATilConnuParnasse = data;
      this.lCommentMmbreATilConnuParnasse.unshift(this.initListRefTiret());
    });
  }

  initMotifRealisation(): void {
    this.referenceDataTypeService.getParentAndChildRefByTypeData('CANCELLATION_REASON',1).subscribe(data => {
      this.lMotifRealisation = data;
      this.lMotifRealisation.unshift(this.initListRefTiret());
    });
  }

  initMotifAdh() {
    if(!this.customer.refMembershipReason){
      this.formStatusContrat.get('refMembershipReason').setValue(null);
    } else {
      this.listMotifAdhesion.forEach(
        (type)=>{
          if(type.label === this.customer.refMembershipReason.label){
            this.formStatusContrat.get('refMembershipReason').setValue(type);
          }
        }
      );
    }
  }

  initMotifSec() {
    if(!this.person.refMembershipReason2){
      this.formStatusContrat.get('refMembershipReason2').setValue(null);
    } else {
      this.listMotifAdhesion.forEach(
        (type)=>{
          if(type.label === this.person.refMembershipReason2.label){
            this.formStatusContrat.get('refMembershipReason2').setValue(type);
          }
        });
    }
  }

  getListStatus(): Array<{id: number, value: string}> {
    return this.profilContractService.getListStatus(this.customer.status);
  }

  onSelectCommentConnu(event): void {
    this.formStatusContrat.get('commentConnuParna').setValue(true);
    console.log(event)
    if(event.id !== 0) {
      this.formStatusContrat.get('refParnasseKnowledge').setValue(event)
    } else {
      this.formStatusContrat.get('refParnasseKnowledge').setValue(null)
    }
  }
  onSelectMotifResiliation(event): void {
    this.formStatusContrat.get('motifRealisation').setValue(true);
    if(event.id !== 0) {
      this.formStatusContrat.get('refCancellationReason').setValue(event);
    } else {
      this.formStatusContrat.get('refCancellationReason').setValue(null);
    } 
  }

  isValidBy(val: string): boolean {
    return (this.formStatusContrat.controls[val].touched || this.isSelected) && !this.isProspectOrContact &&
    (this.formStatusContrat.get(val).value == null ||
    this.formStatusContrat.get(val).value === undefined ||
    this.formStatusContrat.get(val).value === '')
  }

  isValidMotif() : boolean{
    return isNullOrUndefined(this.formStatusContrat.get('refCancellationReason').value) && !this.isProspectOrContact &&
    this.isSelected
     
  }
  onChangeForm(): void {
    if (!isNullOrUndefined(this.formStatusContrat)) {
      this.formStatusContrat.valueChanges.subscribe( () => {
        if(this.formStatusContrat.get('motifRealisation').value === true ||
           this.formStatusContrat.get('commentConnuParna').value === true) {
            this.changeDirtyStatusContractualForm.emit(true);
        } else {
          this.changeDirtyStatusContractualForm.emit(this.formStatusContrat.dirty);
        }
          this.changePersonFormStatus.emit(this.setPersonVO());
          this.changeCustomerFormStatus.emit(this.setCustomerVO());
      });
    }
  }

  setPersonVO(): PersonVO {
    const person = {} as PersonVO;
        person.isHonoraryMember = this.formStatusContrat.get('isHonoraryMember').value;
        person.isFounderMembership = this.formStatusContrat.get('isFounderMembership').value;
        person.refTestAccount = this.formStatusContrat.get('refTestAccount').value;
        person.refMembershipReason2 = this.formStatusContrat.get('refMembershipReason2').value;
        person.additionalInformations = this.formStatusContrat.get('additionalInformations').value;
        person.refParnasseKnowledge = this.formStatusContrat.get('refParnasseKnowledge').value;
    return person;
  }

  setCustomerVO(): CustomerVO {
    const customer = {} as CustomerVO;
    customer.isMemberValidated = this.formStatusContrat.get('isMemberValidated').value;
    customer.prospectingAdmissionDate = this.formStatusContrat.get('prospectingAdmissionDate').value;
    customer.nicheAdmissionDate = this.formStatusContrat.get('nicheAdmissionDate').value;
    customer.dateOfTechnicalStudy = this.formStatusContrat.get('dateOfTechnicalStudy').value;
    customer.installationDate = this.formStatusContrat.get('installationDate').value;
    customer.realisationStatus = this.formStatusContrat.get('realisationStatus').value;
    customer.refMembershipReason = this.formStatusContrat.get('refMembershipReason').value;
    customer.dateHomologation = this.formStatusContrat.get('dateHomologation').value;
    customer.acceptanceDate = this.formStatusContrat.get('acceptanceDate').value;
    if(!isNullOrUndefined(this.formStatusContrat.get('acceptanceDate').value)) {
      this.formStatusContrat.get('acceptanceDate').value.setHours(this.formStatusContrat.get('hourIntronisation').value);
      this.formStatusContrat.get('acceptanceDate').value.setMinutes(this.formStatusContrat.get('MinuteIntronisation').value);
    }
    customer.paymentDate = this.formStatusContrat.get('paymentDate').value;
    customer.contractCessionDate = this.formStatusContrat.get('contractCessionDate').value;
    customer.status = this.formStatusContrat.get('status').value;
    customer.refCancellationReason = this.formStatusContrat.get('refCancellationReason').value;
    customer.cancellationDate = null;
    if(customer.status === 2){
      customer.cancellationDate = this.formStatusContrat.get('cancellationDate').value;
    }
   
    return customer;
  }

  initListRefTiret(): ReferenceDataVO {
    const ref = {} as ReferenceDataVO;
    ref.id = 0;
    ref.label = '--';
    ref.children = [];
    ref.active = true;
    return ref;
  }

  onChangeStatus(){
    const value = this.formStatusContrat.get(this.STATUS_FORM).value;
    if(value === STATUS_CUSTOMER.STATUS_CLIENT_INACTIF_ID.id){
      this.isCancledMember = true;
    }
    else{
      this.isCancledMember = false;
    }
    if(value === STATUS_CUSTOMER.STATUS_CONTACT_ID.id ||
      value === STATUS_CUSTOMER.STATUS_PROSPECT_ID.id ) {
        this.profilContractService.setIsProspectOrContact(true);
      } else {
        this.profilContractService.setIsProspectOrContact(false);
      }
  }

    showCancledDateIninit(){
      if(this.customer.status === 2){
        this.isCancledMember = true;
      }
    }
  
}
