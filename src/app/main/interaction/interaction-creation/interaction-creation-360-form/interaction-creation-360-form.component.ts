import { getDecryptedValue } from 'src/app/_core/utils/functions-utils';
import { Component, ElementRef, ViewChild, AfterViewInit, ViewEncapsulation, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { dateComparator } from '../../../../_core/utils/date-utils';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RequestCustomerVO } from '../../../../_core/models/request-customer-vo';
import { DateFormatPipeFrench, StatusRequestFrPipe } from '../../../../_shared/pipes';
import { isNullOrUndefined, getDefaultStringEmptyValue } from  '../../../../_core/utils/string-utils';
import { toUpperCase } from '../../../../_core/utils/formatter-utils';
import { CONSTANTS, UNIVERS, MEDIA, TYPE_REQUEST } from 'src/app/_core/constants/constants';
import { isThisISOWeek, isValid } from 'date-fns';
import { InteractionService } from '../../../../_core/services/interaction.service';
import { ReferenceDataVO } from '../../../../_core/models/reference-data-vo';
import { InteractionReasonVO } from '../../../../_core/models/request/crud/interaction-reason';
import { Person } from '../../../../_core/models';
import { BeneficiaryVO } from '../../../../_core/models/beneficiaryVO';
import { strict } from 'assert';
import { CmPostalAddressVO } from '../../../../_core/models/cm-postaladdress-vo';
import { PostalAdresseVO } from '../../../../_core/models/postalAdresseVO';
import { UserVo } from '../../../../_core/models/user-vo';
import { GassiMockLoginService } from '../../../../_core/services';
import { CustomerInteractionVO } from '../../../../_core/models/request/crud/customer-interaction';
import { DatePipe } from '@angular/common';






@Component({
  selector: 'app-interaction-creation-360-form',
  templateUrl: './interaction-creation-360-form.component.html',
  styleUrls: ['./interaction-creation-360-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InteractionCreation360FormComponent implements  AfterViewInit, OnInit {
  
  
  @Output() onFormGroupChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() onSubmittedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCanceledChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() requests: RequestCustomerVO;
  @Input() mediaData: ReferenceDataVO[];
  @Input() adresseRdv: CmPostalAddressVO[];
  @Input() listUsers: UserVo[];
  @Input() customerId: string;
  @Input() interlocutors: Person[];
  @Input() destinataires: BeneficiaryVO[];
  interactionReasonList: InteractionReasonVO[] = [];
  requestTitle: string;
  interactionForm: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredUsers: Observable<UserVo[]>;
  users: UserVo[] = [];
  defaultSortModel;
  columnDefs;
  typeCustomer: string;
  isboundRequest = false;

  isService = true;
  isMobile = true;
  isInternet = true;
  isFixe = true;
  isAutre = true;
  isSelectedUnivers = false;
  dateDebut: Date;
  isEntreprise = false;
  isRdv = false;
  separator = ' ';
  userDefault: UserVo;
  requestId: number;
  universId: number;
  attachedUserId: number;
  idDestinataire: number;
  objetRequest: string;

  hourStartDate = 0;
  minuteStartDate = 0; 

  hourEndDate = 0;
  MinuteEndDate = 0;

  maxDate: Date;
  isValidBtn = false;

  /** gestion des erreurs */
  invalidForm = false;
  demandeInvalid = false;
  mediaInvalid = false;
  motifInvalid = false;
  universInvalid = false;
  precisionInvalid = false;
  destinataireInvalid = false;
  dateInvalid = false;
  participantInvalid = false;
  interlocutorInvalid = false;
  /* end */
  
  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('chipList', { static: false }) chipList;

  constructor(private route: ActivatedRoute, private dateFormatPipeFrench: DateFormatPipeFrench, 
    private statusRequestFr: StatusRequestFrPipe, private fb: FormBuilder, 
    private interactionService: InteractionService, 
    private gassiMockLoginService: GassiMockLoginService, private datePipe: DatePipe,
    private router: Router) {
      this.maxDate = new Date();
    this.defaultSortModel = [
      { colId: 'createdAt', sort: 'desc' }
    ];
    this.setColumnRef();
    this.filteredUsers = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((user: UserVo | null) => user ? this._filter(user) : this.listUsers.slice()));
        
  }

  ngOnInit(): void {
    this.interactionForm = this.createFormGroup();
    this.dateDebut = new Date();
    this.route.parent.queryParamMap.subscribe(params => {
      console.log(params)
      this.isEntreprise = (params.get('typeCustomer') === CONSTANTS.TYPE_COMPANY); 
    });
    this.initAttachedTo();
    this.onFormGroupChange.emit(this.interactionForm);
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.chipList.errorState = this.participantInvalid;
    });
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

  radioIsBoundRequestChangeHandler(event: any) {
    this.showUnivers();
    this.isSelectedUnivers = false;
    if (event.target.value === 'oui') {
      this.isboundRequest = true;
      this.demandeInvalid = true;
    } else {
      this.isboundRequest = false;
      this.demandeInvalid = false;
      this.interactionReasonList = [];
      this.requestId = null;
    }
  }

  mediaChangeHandler() {
    if( this.interactionForm.value.media === MEDIA.FACE_A_FACE.id) {
      this.isRdv = true;
    } else {
      this.isRdv = false;
    }
  }

  radioUniversChangeHandler(event: any) {
    this.universInvalid = false;
    if( event.target.value === UNIVERS.MOBILE.value) {
      this.initInteractionReasonList(0,UNIVERS.MOBILE.id);
      this.universId = UNIVERS.MOBILE.id;
    } else if ( event.target.value === UNIVERS.SERVICE.value) {
      this.initInteractionReasonList(0,UNIVERS.SERVICE.id);
      this.universId = UNIVERS.SERVICE.id;
    } else if ( event.target.value === UNIVERS.INTERNET.value) {
      this.initInteractionReasonList(0,UNIVERS.INTERNET.id);
      this.universId = UNIVERS.INTERNET.id;
    } else if ( event.target.value === UNIVERS.FIXE.value) {
      this.initInteractionReasonList(0,UNIVERS.FIXE.id);
      this.universId = UNIVERS.FIXE.id;
    } else if ( event.target.value === UNIVERS.AUTRE.value) {
      this.initInteractionReasonList(0,UNIVERS.AUTRE.id);
      this.universId = UNIVERS.AUTRE.id;
    } else {
      this.universInvalid = true;
    }
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      isBoundRequest: this.fb.control('non'),    
      optionsRadiosUnivers: this.fb.control(''),
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

  setColumnRef(): void {
    this.columnDefs = [
      {
        headerName: 'DU',
        headerTooltip: 'DU',
        field: 'createdAt',
        colId: 'dateCreation',
        comparator: dateComparator,
        width: 240,
        checkboxSelection: true,
        valueGetter: params => this.dateFormatPipeFrench.transform(params.data.createdAt),
        sort: 'desc'
      },
      {
        headerName: 'OBJET DEMANDE',
        headerTooltip: 'OBJET DEMANDE',
        field: 'requestTypeLabel',
        cellClass: 'cell-wrap-text',
        width: 220,
        sortable: false,
        autoHeight: true
      },
      {
        headerName: 'STATUT',
        headerTooltip: 'STATUT',
        field: 'statuts',
        cellClass: 'cell-wrap-text',
        sortable: false,
        width: 160,
        valueGetter: params => this.statusRequestFr.transform(params.data.statuts),
      },
      {
        headerName: 'À TRAITER PAR',
        headerTooltip: 'À TRAITER PAR',
        field: 'firstNamePorteur',
        cellClass: 'cell-wrap-text',
        width: 260,
        valueGetter: params => {
          if (isNullOrUndefined(params.data)) { return '-'; }
          const firstName: string = params.data.firstNamePorteur ? 
          params.data.firstNamePorteur.charAt(0).toUpperCase() + params.data.firstNamePorteur.slice(1) : '';
          const lastName: string = params.data.lastNamePorteur ? toUpperCase(params.data.lastNamePorteur) : '';
          let libelle = firstName + ' ' + lastName; 
          return getDefaultStringEmptyValue(libelle);
        },
        sortable: false,
        autoHeight: true,
      }
    ];
  }

  clickCell(params: any): void {
    this.universInvalid = false;
    if (!isNullOrUndefined(params)) {
      this.requestId = params.idRequest;
      this.objetRequest = params.requestTypeLabel;
      this.initInteractionReasonList(params.requestTypeId, params.universId);
      this.demandeInvalid = false;
      this.hideUnivers();
      if (UNIVERS.MOBILE.value === params.labelUnivers) {
        this.isMobile = true;
        this.isSelectedUnivers = true;
      } else if ( UNIVERS.SERVICE.value === params.labelUnivers) {
        this.isService = true;
        this.isSelectedUnivers = true;
      } else if (UNIVERS.INTERNET.value === params.labelUnivers) {
        this.isInternet = true;
        this.isSelectedUnivers = true;
      } else if (UNIVERS.FIXE.value === params.labelUnivers) {
        this.isFixe = true;
        this.isSelectedUnivers = true;
      } else if( UNIVERS.AUTRE.value === params.labelUnivers) {
        this.isAutre = true;
        this.isSelectedUnivers = true;
      } else {
        this.demandeInvalid = true;
      }
    } else {
      this.demandeInvalid = true;
      this.requestId = null;
      this.initInteractionReasonList(null, null);
      this.showUnivers();
      this.isSelectedUnivers = false;
    }
    
  }

  initInteractionReasonList(requestTypeId: number, universId: number): void {
    if(!isNullOrUndefined(requestTypeId)) {
      this.interactionService.listInteractionReasons(universId, 
        TYPE_REQUEST.GESTION_PARNASSE.id , 'PENDING', true, true).subscribe(irList => {
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

  hideUnivers(): void {
    this.isMobile = false;
    this.isService = false;
    this.isInternet = false;
    this.isFixe = false;
    this.isAutre = false;
  }

  showUnivers() : void {
    this.isMobile = true;
    this.isService = true;
    this.isInternet = true;
    this.isFixe = true;
    this.isAutre = true;
  }
  remove(u: UserVo): void {
    const index = this.users.indexOf(u);
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

  private _filter(value: UserVo): UserVo[] {
    const filterValue = value;
    console.log(value)
    return this.listUsers.filter(user => user.ftUniversalId.toLowerCase().indexOf(value.ftUniversalId.toLowerCase()) === 0);
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

  save(): void {
    this.onSubmittedChange.emit(true);
    this.initValidator();
    let InValid = this.validator();
    if( !InValid) {
      this.isValidBtn = true;
        let cust = this.preparedObjectForSave();
        this.interactionService.saveCustomerInteraction(cust).subscribe(() => {
        this.redirectionTo();
        });
    } else {
      this.isValidBtn = false;
    }
  }

  preparedObjectForSave(): CustomerInteractionVO {
    let customerInteraction: CustomerInteractionVO;
    console.log(this.interactionForm.value)
    let starDate = new Date(this.interactionForm.value.dateDebut.getFullYear(), this.interactionForm.value.dateDebut.getMonth(),
       this.interactionForm.value.dateDebut.getDate(), this.hourStartDate, this.minuteStartDate);
    let endDate = new Date(this.interactionForm.value.dateDebut.getFullYear(), this.interactionForm.value.dateDebut.getMonth(),
       this.interactionForm.value.dateDebut.getDate(), this.hourEndDate, this.MinuteEndDate);
       let creationDate = new Date();
    customerInteraction = {
      refMediaId: this.interactionForm.value.media,
      requestId: this.requestId,
      attachedUserId: this.attachedUserId,
      universId: this.universId,
      idDestinataire: this.interactionForm.value.destinataire,
      interactionReasonId: this.interactionForm.value.motif,
      interactionReasonLabel: null,
      interlocuteurId: this.interactionForm.value.interlocuteur,
      moreInformation: this.interactionForm.value.precision,
      startDate: null,
      startDateStr: this.datePipe.transform(starDate, 'yyyy-MM-dd HH:mm:ss'),
      participants: this.users,
      description: this.interactionForm.value.description,
      customerId: getDecryptedValue(this.customerId),
      id: null,
      creationDate: null,
      creationDateStr: this.datePipe.transform(creationDate, 'yyyy-MM-dd HH:mm:ss'),
      creatorId: null,
      actorId: null,
      contactMethodId: this.interactionForm.value.adresseId,
      objetRequest: this.objetRequest,
      endDate: null,
      endDateStr: this.datePipe.transform(endDate, 'yyyy-MM-dd HH:mm:ss'),

    }
    return customerInteraction;
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

  classError(value: boolean): string {
    if ( value) 
      return 'form-control error';
    return 'form-control';
  }

  validator(): boolean {
    console.log(this.interactionForm.value)
    if( this.interactionForm.value.motif !== '--' &&  this.interactionForm.value.motif !== '') {
      console.log(this.interactionForm.value)
      this.motifInvalid = false;
    } if ( this.interactionForm.value.media !== '--' && this.interactionForm.value.media !== '') {
      this.mediaInvalid = false;
    } if (this.interactionForm.value.precision !== '') {
      this.precisionInvalid = false;
    } if ( this.isEntreprise && isNullOrUndefined(this.requestId) && (isNullOrUndefined(this.interactionForm.value.destinataire) || this.interactionForm.value.destinataire === '--' || this.interactionForm.value.destinataire === '')) {
      this.destinataireInvalid = true;
    } else {
      this.destinataireInvalid = false;
    } if (isNullOrUndefined(this.users) || this.users.length === 0 ) {
      this.participantInvalid = true;
    } else {
      this.participantInvalid = false;
    }
    if(this.interactionForm.value.optionsRadiosUnivers === '' && isNullOrUndefined(this.requestId) ) {
      this.universInvalid = true;
    } else {
      this.universInvalid = false;
    }
    if(this.interactionForm.value.interlocuteur === '' ) {
      this.interlocutorInvalid = true;
    } else {
      this.interlocutorInvalid = false;
    }
    

  if (this.demandeInvalid || this.mediaInvalid || 
    this.universInvalid || this.motifInvalid || 
    this.precisionInvalid || ( this.destinataireInvalid && this.isEntreprise)
    || this.dateInvalid || this.participantInvalid || this.interlocutorInvalid) {
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
    console.log(this.requestId)
    console.log(this.universInvalid)
    if(isNullOrUndefined(this.requestId)) 
      this.universInvalid = true;
    this.precisionInvalid = true;
    if( this.isEntreprise)
     this.destinataireInvalid = true;
    this.participantInvalid = true;
  }

  onChangeTimeStart(time: any): void {
      this.hourStartDate = Number(time.substring(0, 2));
      this.minuteStartDate = Number(time.substring(4, 7));
      this.hourEndDate = this.hourStartDate;
      this.MinuteEndDate = this.minuteStartDate;
    }

    onChangeTimeStartJusqu(time: any): void {
      this.hourEndDate = Number(time.substring(0, 2));
      this.MinuteEndDate = Number(time.substring(4, 7));
    }

    annuler(isNotSave: boolean): void {
      console.log(isNotSave)
      if(isNotSave) {
        this.onCanceledChange.emit(true);
        this.onSubmittedChange.emit(false);
      } else {
        this.onCanceledChange.emit(false);
        this.onSubmittedChange.emit(true);
      }
        if(this.isEntreprise) {
          this.router.navigate(
            ['/customer-dashboard/entreprise', this.customerId],
            { 
              queryParams: { 'typeCustomer': this.typeCustomer },
              queryParamsHandling: 'merge' 
            }
          );
        } else {
          this.router.navigate(
            ['/customer-dashboard/particular', this.customerId], {
            queryParams: { 'typeCustomer': this.typeCustomer }
             });
        } 
    }

   redirectionTo(): void {
    this.onSubmittedChange.emit(true);
    console.log(this.requestId)
     if( !isNullOrUndefined(this.requestId)) {
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'detail', 'request', this.requestId],
        { queryParamsHandling: 'merge' }
      );
     } else {
      this.annuler(false);
     }
   }

    onSelectMotif(motif: any): void {
      this.interactionForm.controls.motif.setValue(motif.id);
    }
}
