import { getDecryptedValue } from 'src/app/_core/utils/functions-utils';
import { Component, ElementRef, ViewChild, ViewEncapsulation, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RequestCustomerVO } from 'src/app/_core/models/request-customer-vo';
import { CustomerInteractionVO } from '../../../../_core/models/request/crud/customer-interaction';
import { GassiMockLoginService } from '../../../../_core/services';
import { UserVo } from '../../../../_core/models/user-vo';
import { PostalAdresseVO } from '../../../../_core/models/postalAdresseVO';
import { CmPostalAddressVO } from '../../../../_core/models/cm-postaladdress-vo';
import { ReferenceDataVO } from '../../../../_core/models/reference-data-vo';
import { Person } from '../../../../_core/models';
import { InteractionReasonVO } from '../../../../_core/models/request/crud/interaction-reason';
import { InteractionService } from '../../../../_core/services/interaction.service';
import { BeneficiaryVO } from '../../../../_core/models/beneficiaryVO';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANTS , MEDIA} from '../../../../_core/constants/constants';
import { DatePipe, Location } from '@angular/common';
import { isNullOrUndefined, stringToBoolean } from  '../../../../_core/utils/string-utils';
import { RequestAnswersVO } from 'src/app/_core/models/models';
import { InteractionsService } from '../../interactions.service';

@Component({
  selector: 'app-interaction-creation-form',
  templateUrl: './interaction-creation-form.component.html',
  styleUrls: ['./interaction-creation-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InteractionCreationFormComponent implements OnInit {


  @Output() onFormGroupChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() onSubmittedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCanceledChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() request: RequestCustomerVO;
  @Input() mediaData: ReferenceDataVO[];
  @Input() adresseRdv: CmPostalAddressVO[];
  @Input() listUsers: UserVo[];
  @Input() customerId: string;
  @Input() interlocutors: Person[];
  @Input() destinataires: BeneficiaryVO[];
  @Input() requestAnswers: RequestAnswersVO[] = [];
  interactionReasonList: InteractionReasonVO[] = [];
  requestTitle: string;
  interactionForm: FormGroup;
  dateDebut: Date;
  separator = ' ';
  isEntreprise: boolean;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredUsers: Observable<UserVo[]>;
  users: UserVo[] = [];
  userDefault: UserVo;
  attachedUserId: number;
  isRdv = false;
  hourStartDate = 0;
  minuteStartDate = 0; 
  hourEndDate = 0;
  MinuteEndDate = 0;
  detailRequest: any ;

  invalidForm = false;
  mediaInvalid = false;
  motifInvalid = false;
  precisionInvalid = false;
  participantInvalid = false;
  interlocutorInvalid = false;
  isValidBtn = false;
  previousPage;

  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipList', { static: false }) chipList;
  updateMode: boolean;
  interactionToUpdate= {} as CustomerInteractionVO;
  selectedMotif = { label : '--', id: null}
  constructor(private readonly route: ActivatedRoute, private readonly fb: FormBuilder,
    private readonly gassiMockLoginService: GassiMockLoginService, private readonly datePipe: DatePipe, private readonly location: Location,
    private readonly interactionService: InteractionService, private readonly interactionsService: InteractionsService, private readonly router: Router) {
    this.filteredUsers = this.fruitCtrl.valueChanges.pipe(
      startWith(''),
      map((user: UserVo | null) => user ? this._filter(user) : this.listUsers.slice()));
        
  }
  ngOnInit(): void {
    this.interactionForm = this.createFormGroup();
    this.dateDebut = new Date();
    this.route.parent.queryParamMap.subscribe(params => {
      this.isEntreprise = (params.get('typeCustomer') === CONSTANTS.TYPE_COMPANY); 
      this.previousPage = params.get('previousPage');
    });  
    this.onFormGroupChange.emit(this.interactionForm);
    this.dateDebut = new Date();
    this.initInteractionReasonList(this.request.requestTypeId, this.request.universId);
    this.initAttachedTo();
    this.route.data.subscribe(resolversData => {
      this.updateMode = resolversData['updateMode'];
      if (this.updateMode) {
        this.interactionToUpdate = resolversData['interaction'];
        this.initInteractionFormInCaseOfUpdate()
      }
      
    });

  }

  initInteractionFormInCaseOfUpdate() {
    this.interactionForm.setValue({
      destinataire: null,
      precision: this.interactionToUpdate.moreInformation,
      description: this.interactionToUpdate.description,
      adresseId: this.interactionToUpdate.contactMethodId,
      media: this.interactionToUpdate.refMediaId,
      dateDebut: this.interactionToUpdate.startDate,
      motif: this.interactionToUpdate.interactionReasonId,
      interlocuteur: this.interactionToUpdate.interlocuteurId
    });
    this.dateDebut = new Date(this.interactionToUpdate.startDate);
    this.selectedMotif = { id: this.interactionToUpdate.interactionReasonId, label: this.interactionToUpdate.interactionReasonLabel }
    this.mediaChangeHandler();
    this.users = (isNullOrUndefined(this.interactionToUpdate.participants)) ? [] : this.interactionToUpdate.participants;
    const [startDate , endDate ] =  [new Date(this.interactionToUpdate.startDate), new Date(this.interactionToUpdate.endDate)]; 
    this.hourStartDate = startDate.getHours();
    this.minuteStartDate = startDate.getMinutes(); 
    this.hourEndDate = endDate.getHours();
    this.MinuteEndDate = endDate.getMinutes(); 
    this.interactionForm.updateValueAndValidity();
  }

  initInteractionReasonList(requestTypeId: number, universId: number): void {
    if(!isNullOrUndefined(requestTypeId)) {
      this.interactionService.listInteractionReasons(universId, 
        requestTypeId, 'PENDING', false, false).subscribe(irList => {
          this.interactionReasonList = irList;
          if (this.interactionReasonList && this.interactionReasonList.length === 1 
            && this.interactionReasonList[0].children.length === 1) {
            this.requestTitle = this.interactionReasonList[0].label + ' > ' + this.interactionReasonList[0].children[0].label;
          }
        });
    } else {
      this.interactionReasonList = [];
    }
  }

  initAttachedTo(): void {
    const currentUserCuid = this.gassiMockLoginService.getCurrentCUID().getValue();
    if (this.listUsers) {
      if (this.listUsers) {
        const userConnected = this.listUsers.find(user => user.ftUniversalId === currentUserCuid)
        this.userDefault = userConnected ? userConnected : null;
        this.attachedUserId = this.userDefault.id;
        this.users.push(this.userDefault); 
      }
    }
  }

  mediaChangeHandler() {
    if( this.interactionForm.value.media === MEDIA.FACE_A_FACE.id) {
      this.isRdv = true;
    } else {
      this.isRdv = false;
    }
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      destinataire: this.fb.control(''),
      precision: this.fb.control(''),
      description: this.fb.control(''),
      adresseId: this.fb.control(''),
      media: this.fb.control(''),
      dateDebut: this.fb.control(''),
      motif: this.fb.control(''),
      interlocuteur: this.fb.control('')
    });
  }
  remove(user: UserVo): void {
    const index = this.users.indexOf(user);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if(!isNullOrUndefined(this.users)) {
      const isExist = this.users.find(user => user.ftUniversalId === event.option.value.ftUniversalId);
        if (isNullOrUndefined(isExist)) {
          this.users.push(event.option.value);
        }
    }
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
    this.chipList.errorState = false;
  }

  _filter(value: UserVo): UserVo[] {
    if(!isNullOrUndefined(value))
    return this.listUsers.filter(user => user.ftUniversalId.toLowerCase().indexOf(value.ftUniversalId.toLowerCase()) === 0);
    return null;
  }

  classError(value: boolean): string {
    if ( value) 
      return 'form-control error';
    return 'form-control';
  }


  formatterDest(dest: BeneficiaryVO): string {
    let str = '';
    if ( isNullOrUndefined(dest.idCompany)) {
      let offre = ' Aucun offre ! ';
      if( isNullOrUndefined(dest.offreLabel)) {
        str  = dest.crmName + ' - ' + offre + ' ( ' + dest.firstName + dest.lastName  + ' ) ';
      } else {
        str  = dest.crmName + ' - ' + dest.offreLabel + ' ( ' +  + dest.firstName + dest.lastName  + ' ) ';
      }
    }  else {
      let offre = ' Aucun offre ! ';
      if( isNullOrUndefined(dest.offreLabel)) {
        str = dest.firstName + ' ' + dest.lastName + ' - ' + offre;
      } else {
        str = dest.firstName + ' ' + dest.lastName + ' - ' + dest.offreLabel;
      }
    }
    return str;
  }


  getFullAddress(adressPostal: PostalAdresseVO): string {
    let str = '';
    if (adressPostal.companyName !== null && adressPostal.companyName !== '') {
      str += adressPostal.companyName + this.separator;
    }
    if (adressPostal.title !== null) {
      if (adressPostal.title !== 'UNKNOWN') {
        str += adressPostal.title + ' ' ;
      } else {
        str += '';
      }
    }
    str += this.getcivility(adressPostal);
    str += this.separator + this.getAddress(adressPostal);
    return str;
  }

  getcivility(postalAddress: PostalAdresseVO): string {
    let str = '';
    if (postalAddress.socialTitle !== null) {
      str += postalAddress.socialTitle + ' ';
    }			
    if (postalAddress.lastName !== null) {
      str += postalAddress.lastName + ' ' ;
    }
    if (postalAddress.firstName !== null) {
      str += postalAddress.firstName + ' ';
    }
    
    return str;
  }

  getAddress(postalAddress: PostalAdresseVO): String {
    let str = '';
    if (postalAddress.addrLine2 !== null && postalAddress.addrLine2 !== '') {
      str += postalAddress.addrLine2 + this.separator ;
    }
    if (postalAddress.addrLine3 !== null && postalAddress.addrLine3 !== '') {
      str += postalAddress.addrLine3 + this.separator ;
    }
    if (postalAddress.logisticInfo !== null && postalAddress.logisticInfo !== '') {
      str += postalAddress.logisticInfo;
    }
    if (postalAddress.addrLine4 !== null && postalAddress.addrLine4 !== '') {
      str += postalAddress.addrLine4 + this.separator ;
    }
    if (postalAddress.addrLine5 !== null && postalAddress.addrLine5 !== '') {
      str += postalAddress.addrLine5 + this.separator ;
    }
    if (postalAddress.postalCode !== null && postalAddress.postalCode !== '') {
      str += postalAddress.postalCode + ' ';
    }
    if (postalAddress.city !== null) {
      str += postalAddress.city;
    }
    if (postalAddress.cedex !== null) {
      str += ' ' + postalAddress.cedex;
    }
    if (postalAddress.country) {
      str += this.separator + postalAddress.country;
    }
    return str;
  }

  onChangeTimeStart(time: any): void {
    this.hourStartDate = Number(time.substring(0, 2));
    this.minuteStartDate = Number(time.substring(4, 7));
    if (this.hourEndDate < this.hourStartDate || (this.hourEndDate === this.hourStartDate && this.MinuteEndDate < this.minuteStartDate)) {
      this.hourEndDate = this.hourStartDate;
      this.MinuteEndDate = this.minuteStartDate;
    } 
  }

  onChangeTimeStartJusqu(time: any): void {
    this.hourEndDate = Number(time.substring(0, 2));
    this.MinuteEndDate = Number(time.substring(4, 7));
  }

  annuler(): void {
      this.onCanceledChange.emit(true);
      if (!isNullOrUndefined(this.route.snapshot.queryParams['fromDashbord'] ) &&
      stringToBoolean(this.route.snapshot.queryParams['fromDashbord']) === true) {
        this.router.navigate(['/']);
      }
      else{
        switch (this.previousPage) {
          case 'request':
            this.interactionsService.navigateToRequestPage(this.router, this.customerId, this.request.idRequest);
            break;
          case 'history':
            this.interactionsService.navigateToInteractionHistoryPage(this.router, this.customerId);
            break;
          default:
            this.interactionsService.navigateToDetailInteractionPageByType(this.router, this.customerId, this.request.idRequest, this.interactionToUpdate.id);
            break;
        }

      }
    
  }

  save(): void {
   this.initValidator();
   if(!this.isNotValid()) {
     this.isValidBtn = true;
    let cust = this.preparedObjectForSave();
    console.log(cust.startDateStr)
    this.interactionService.saveCustomerInteraction(cust).subscribe(() => {
      this.onSubmittedChange.emit(true);
      if (!isNullOrUndefined(this.route.snapshot.queryParams['fromDashbord'] ) &&
      stringToBoolean(this.route.snapshot.queryParams['fromDashbord']) === true) {
        this.router.navigate(['/']);
      }
      else{
         this.location.back();

      }
    
    });
   } else {
     this.isValidBtn = false;
   }
  }

  preparedObjectForSave():  CustomerInteractionVO{
    let customerInteraction: CustomerInteractionVO;
    const datePattern = 'yyyy-MM-dd HH:mm:ss';
    let starDate = new Date(this.interactionForm.value.dateDebut.getFullYear(), this.interactionForm.value.dateDebut.getMonth(),
       this.interactionForm.value.dateDebut.getDate(), this.hourStartDate, this.minuteStartDate);
    let endDate = new Date(this.interactionForm.value.dateDebut.getFullYear(), this.interactionForm.value.dateDebut.getMonth(),
       this.interactionForm.value.dateDebut.getDate(), this.hourEndDate, this.MinuteEndDate);
     const creationDate = (this.updateMode) ? new Date(this.interactionToUpdate.creationDate) : new Date();
     const id = (this.updateMode) ? this.interactionToUpdate.id : null;
     const attachedUserId = (this.updateMode) ? this.interactionToUpdate.attachedUserId : this.attachedUserId;
    customerInteraction = {
      refMediaId: this.interactionForm.value.media,
      requestId: this.request.idRequest,
      attachedUserId: attachedUserId,
      universId: this.request.universId,
      idDestinataire: this.interactionForm.value.destinataire,
      interactionReasonId: this.interactionForm.value.motif,
      interactionReasonLabel: '',
      interlocuteurId: this.interactionForm.value.interlocuteur,
      moreInformation: this.interactionForm.value.precision,
      startDate: null,
      startDateStr: this.datePipe.transform(starDate, datePattern),
      participants: this.users,
      description: this.interactionForm.value.description,
      customerId: getDecryptedValue(this.customerId),
      id: id,
      creationDate: null,
      creationDateStr: this.datePipe.transform(creationDate, datePattern),
      creatorId: null,
      actorId: null,
      contactMethodId: this.interactionForm.value.adresseId,
      objetRequest: this.request.requestTypeLabel,
      endDate: null,
      endDateStr: this.datePipe.transform(endDate, datePattern)

    }
    return customerInteraction;
  }

  isNotValid(): boolean {
    console.log(this.interactionForm.value)
      if( this.interactionForm.value.motif !== '--' &&  this.interactionForm.value.motif !== '') {
        this.motifInvalid = false;
      } if ( this.interactionForm.value.media !== '--' && this.interactionForm.value.media !== '') {
        this.mediaInvalid = false;
      } if (this.interactionForm.value.precision !== '') {
        this.precisionInvalid = false;
      } 
      if (isNullOrUndefined(this.users) || this.users.length === 0 ) {
        this.participantInvalid = true;
        this.chipList.errorState = true;
      } else {
        this.participantInvalid = false;
        this.chipList.errorState = false;
      }
      
      if(this.interactionForm.value.interlocuteur === '' ) {
        this.interlocutorInvalid = true;
      } else {
        this.interlocutorInvalid = false;
      }
    if ( this.mediaInvalid || this.motifInvalid || 
      this.precisionInvalid 
      || this.participantInvalid || this.interlocutorInvalid) {
        this.invalidForm = true;
      }else {
        this.invalidForm = false;
      }
      return this.invalidForm;

  }

  initValidator(): void {
    this.invalidForm = true;
    this.mediaInvalid = true;
    this.motifInvalid = true;
    this.interlocutorInvalid = true;
    this.precisionInvalid = true;
    this.participantInvalid = true;
  }

  onSelectMotif(motif: any): void {
    this.interactionForm.controls.motif.setValue(motif.id);
  }
}
