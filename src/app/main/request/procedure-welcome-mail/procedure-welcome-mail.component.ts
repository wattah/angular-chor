import { CommonService } from './../../cart/cart/common.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PostalAdresseVO } from '../../../_core/models/postalAdresseVO';
import { Person, TaskVo, WelcomeMailVO } from '../../../_core/models';
import { RequestAnswersVO } from '../../../_core/models/models';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { ContactMethodService, CustomerService, WelcomeMailService } from '../../../_core/services';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { TYPE_CM_INTERLOCUTOR, ROLE_INTERLOCUTOR, CONSTANTS } from '../../../_core/constants/constants';
import { PopAddAddressComponent } from '../../_shared/pop-add-address/pop-add-address.component';
import { firstNameFormatter, fullNameFormatter } from '../../../_core/utils/formatter-utils';
import { getDecryptedValue } from '../../../_core/utils/functions-utils';
import { LogoPopUpComponent } from '../../_shared/logo-pop-up/logo-pop-up.component';

@Component({
  selector: 'app-procedure-welcome-mail',
  templateUrl: './procedure-welcome-mail.component.html',
  styleUrls: ['./procedure-welcome-mail.component.scss']
})
export class ProcedureWelcomeMailComponent implements OnInit {

  // object to send ;
  welcomeMail: WelcomeMailVO = {
    id: null,
    recipient: null,
    addressId: null,
    address: null,
    fullTitle: null,
    civility: null,
    issueDate: null,
    coach: null,
    fullInfosWelcomeMail: null,
    requestId: null,
    isArchived: false,
    isValid: false,
    customerId: null
  };

  filteredPersons: Observable<Person[]>; 
  interlocutors: Person[];

  form: FormGroup;
  customerId: string;
  idRequest: string;
  idTask: string;
  task: TaskVo;
  detailRequest: RequestCustomerVO;
  requestAnswers: RequestAnswersVO[];
  typeCustomer: string;

  adresseRdv: PostalAdresseVO[];

  loading = false;
  civility = 'Cher Membre';

  constructor(private readonly route: ActivatedRoute, private readonly router: Router,
    private readonly fb: FormBuilder, private readonly customerService: CustomerService, private readonly welcomeMailService: WelcomeMailService,
    private readonly contactMethodService: ContactMethodService, private readonly modalService: NgbModal , private readonly commonService: CommonService ) { 
  }

  /*****************************************************************************
   *                              INITIALISATION                               *
   *****************************************************************************/
  ngOnInit(): void {
    this.route.parent.paramMap.subscribe(params => this.customerId = params.get('customerId')); 

    this.route.paramMap.subscribe(params => {
      this.idRequest = params.get('idRequest');
      this.idTask = params.get('idTask');
    });
    
    this.route.queryParamMap.subscribe(queryParams => this.typeCustomer = queryParams.get('typeCustomer'));
    
    this.setCoachName();
    this.buildForm();
    this.onInitRecipientList();
    this.route.data.subscribe(resolversData => {
      this.task = resolversData['currentTask'];
      this.detailRequest = resolversData['detailRequest'];
      this.requestAnswers = resolversData['requestAnswers'];
      this.interlocutors = resolversData['interlocutors'];
      this.welcomeMail = resolversData['welcomeMail'];
      this.initializeWelcomeMail(this.welcomeMail);
    });

  }

  initializeWelcomeMail(wcm: WelcomeMailVO ): void {
    if ( ! isNullOrUndefined(wcm)) {
      this.contactMethodService.getAddressById(wcm.addressId).subscribe( adr => { 
        wcm.address = adr;
        this.interlocutors.forEach( interlocutor => {
          if (interlocutor.idPerson === wcm.address.personId) { 
            wcm.recipient = interlocutor;
            this.contactMethodService.getListPostalAddress(interlocutor.idPerson).subscribe (data => {
              this.adresseRdv = data;
              this.adresseRdv = this.commonService.sortAdresseRdv(this.adresseRdv);
            });
            this.form.get('recipient').setValue( wcm.recipient);
            this.form.get('address').setValue( wcm.address);
            this.form.get('civility').setValue( wcm.civility);
            this.form.get('issueDate').setValue( new Date(wcm.issueDate));
          }
        }) ;
      });
      this.welcomeMail = wcm;
    } else {
      this.setDefaultDestination();
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      recipient: this.fb.control(this.welcomeMail.recipient, [Validators.required]),
      address: this.fb.control(this.welcomeMail.address, [Validators.required]),
      civility: this.fb.control(this.welcomeMail.civility, [ Validators.required ]),
      issueDate: this.fb.control(this.welcomeMail.issueDate, [ Validators.required ])
    });
  }

  /*****************************************************************************
   *                              INTERLOCUTEUR                                *
   *****************************************************************************/

  setDefaultDestination(): void {
    let type = ROLE_INTERLOCUTOR.ROLE_BENEFICIARE.value;
    if ( this.typeCustomer === CONSTANTS.TYPE_COMPANY) {
      type = ROLE_INTERLOCUTOR.ROLE_TITULAIRE.value;
    } 
    const defaultRecipient = this.interlocutors.filter((interlocutor) => interlocutor.roleLabel.includes(type))[0];
    this.form.get('recipient').setValue(defaultRecipient);
    this.onChoseRecipient(defaultRecipient);
  }

  nameFormatter(interlocutor: Person): string {
    if (isNullOrUndefined(interlocutor)) {
      return '- -';
    }  
    if ( isNullOrUndefined(interlocutor.lastName) && isNullOrUndefined(interlocutor.firstName)) {
      return '';
    }
    
    return `${fullNameFormatter(null, interlocutor.firstName, interlocutor.lastName).trim()} `;
  }

  onChoseRecipient(person: Person): void {
    this.adresseRdv = [];
    this.contactMethodService.getListPostalAddress(person.idPerson).subscribe (data => {
      this.adresseRdv = data;
      if (this.adresseRdv && this.adresseRdv.length !== 0) {
        
        this.adresseRdv = this.commonService.sortAdresseRdv(this.adresseRdv);
        const principalAdresse = this.adresseRdv.filter( adr => adr.types[0].label.includes(TYPE_CM_INTERLOCUTOR.PRINCIPAL.value))[0];

        if (principalAdresse) {
          this.form.get('address').setValue( principalAdresse);
          this.onChoseAddress(principalAdresse);
        } else {
          this.form.get('address').setValue(null);
          this.onChoseAddress(null);
        }
      } else {
        this.form.get('address').setValue(null);
        this.onChoseAddress(null);
      }
    });    
  }

  onInitRecipientList(): void {
    this.filteredPersons = this.form.get('recipient').valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : this.nameFormatter(value)),
          map(option => option ? this._filterInterlocutor(option) : this.interlocutors.slice())
        ); 
  }

  displayRecipient(r: any): string {
    if (isNullOrUndefined(r)) {
      return '--';
    }
    const firstName = (isNullOrUndefined(r.firstName) || r.firstName.length === 0 )? '' : firstNameFormatter(r.firstName);
    const lastName = isNullOrUndefined(r.lastName) ? '' : r.lastName.toUpperCase();
    return `${firstName} ${lastName} - ${r.roleLabel}`;
  }

  _filterInterlocutor(name: any): Person[] {
    const filterValue = name.toLowerCase();
    return this.interlocutors.filter(option => this.nameFormatter(option).toLowerCase().indexOf(filterValue) === 0);
  }
  
  /*****************************************************************************
   *                                  ADDRESSE                                 *
   *****************************************************************************/

  displayAddress(adr: any): string {
    if ( !isNullOrUndefined(adr) && !isNullOrUndefined(adr.types) && adr.types.length >= 1) {
      return `Adresse ${adr.types[0].label} `;
    }
    return '--';
  }

  onChoseAddress(adr: any): void {

    if (!isNullOrUndefined(adr)) {
      this.form.get('issueDate').setValue(new Date());
      this.welcomeMail.fullTitle = (adr.title === 'M') ? 'Monsieur' : 'Madame';
      this.form.get('civility').setValue(this.civility);
    } else {
      this.form.get('issueDate').setValue(null);
      this.form.get('civility').setValue(null);
      this.welcomeMail.fullTitle = null;
    }   
    
  }

  changeAdresseInput(_event: any): void {
    if ( isNullOrUndefined( _event.target.value) || _event.target.value === '' ) {
      this.form.get('address').setValue(null);
      this.onChoseAddress(null);
    }
  }

  openPopupNewAdresse(): void {
    let valueResult: PostalAdresseVO = {} as PostalAdresseVO;
    const modal = this.modalService.open(
      PopAddAddressComponent, { centered: true, windowClass: 'custom_popup', size: 'lg', backdrop : 'static', keyboard: false }
    );
    modal.componentInstance.personId = this.form.get('recipient').value.idPerson;
    modal.componentInstance.customerId = this.customerId;
    modal.componentInstance.resultCmPostalAddressVO.subscribe( emmitedValue => valueResult = emmitedValue); 
    modal.result.then((result) => {
      if (result) {
        this.getAddressTemporaire(valueResult);
      }
    });
  }

  getAddressTemporaire(resultCmPostalAddressVO: PostalAdresseVO): void {
    this.adresseRdv.push(resultCmPostalAddressVO);
    if (this.adresseRdv && this.adresseRdv.length !== 0) {
      this.adresseRdv = this.commonService.sortAdresseRdv(this.adresseRdv);
      this.form.get('address').setValue(resultCmPostalAddressVO);
      this.onChoseAddress(resultCmPostalAddressVO);
    } 
  }

  // set Name Coach
  setCoachName(): void {
    this.customerService.getListReferents(this.customerId).subscribe(
      (referents: any) => referents.forEach(element => {
        if (element.roleId === CONSTANTS.ROLE_COACH) {
          this.welcomeMail = {
            ...this.welcomeMail,
            coach: this.nameFormatter(element)
          };
        }
      }));
  }

  /*****************************************************************************
   *                                  SAUVEGARDE                               *
   *****************************************************************************/
  
  prepareAdresseToSave(): string {
    const adr = this.form.get('address').value;
    const rec = this.form.get('recipient').value;
    let fullInfosWelcomeMail = '';
    if (!isNullOrUndefined(adr.companyName)) {
      fullInfosWelcomeMail += `${adr.companyName} \r`;
    }

    fullInfosWelcomeMail += `${this.nameFormatter(rec)} \r`;
    
    if (!isNullOrUndefined(adr.companyName)) {
      fullInfosWelcomeMail += `${adr.companyName} \r`;
    }

    if (!isNullOrUndefined(adr.addrLine2)) {
      fullInfosWelcomeMail += adr.addrLine2;
    }
    if (!isNullOrUndefined(adr.addrLine3)) {
      fullInfosWelcomeMail += adr.addrLine3;
    }
    if (!isNullOrUndefined(adr.logisticInfo)) {
      fullInfosWelcomeMail += adr.logisticInfo;
    }
    if (!isNullOrUndefined(adr.addrLine4)) {
      fullInfosWelcomeMail += adr.addrLine4;
    }
    if (!isNullOrUndefined(adr.addrLine5)) {
      fullInfosWelcomeMail += adr.addrLine5;
    }
    fullInfosWelcomeMail += `\r`;
    if (!isNullOrUndefined(adr.postalCode)) {
      fullInfosWelcomeMail += adr.postalCode;
    }
    if (!isNullOrUndefined(adr.city)) {
      fullInfosWelcomeMail += `${adr.city} \r`;
    }
    return fullInfosWelcomeMail;
  }

  prepareWelcomeMailTosend(isNotresumeLater: boolean): WelcomeMailVO {
    return {
      ...this.welcomeMail,
      addressId: this.form.get('address').value.id,
      fullInfosWelcomeMail: this.prepareAdresseToSave(),
      civility: this.form.get('civility').value,
      issueDate: this.form.get('issueDate').value,
      isValid: isNotresumeLater,
      isArchived: isNotresumeLater,
      requestId: Number(this.idRequest),
      customerId: getDecryptedValue(this.customerId)
    };
  }
  
  saveWelcomeMail(isNotresumeLater: boolean, text: string): void {
    if (this.form.valid) {
      this.welcomeMail = this.prepareWelcomeMailTosend(isNotresumeLater);
      this.loading = true;
      this.welcomeMailService.saveWelcomeMail(this.welcomeMail).subscribe( _data => {
        this.loading = false;
        this.router.navigate(
          ['/customer-dashboard', this.customerId, 'request', this.idRequest, 'task-details', this.idTask], 
          { queryParamsHandling: 'merge' }
        ).then(() => this.welcomeMailService.openSnackBar(text));
      });
    }
  }
   
  onResumeLater(): void {
    this.saveWelcomeMail(false, 'les informations ont bien été enregistrées');
  }

  onValidateMail(): void {
    this.saveWelcomeMail(true, 'Le courrier de bienvenue a bien été enregistré et archivé');
  }

  onSeeMail(): void {
    if (this.form.valid) {
      this.welcomeMail = this.prepareWelcomeMailTosend(true);
      this.loading = true;
      this.customerService.getCustomerOfferStatus(this.customerId).subscribe( offreStatus => {
        this.loading = false;
        if (offreStatus === 'HAS_ONE_OFFER') {
          this.modalService.open(LogoPopUpComponent, { centered: true })
          .result.then((withLogo) => this.openDocument(withLogo));
        
        } else {
          let text = `Le système a détecté une incohérence dans l'offre attribuée au membre.<br/>Veuillez contacter l'équipe RUN avant de générer le courrier.`;
          if (offreStatus === 'NO_OFFER') {
            text = `Une offre de service est obligatoire.<br/>Contactez le desk pour en attribuer une au client.`;
          } 
          this.welcomeMailService.openErrorPopup(text);
        }
      });
    }
  }

  openDocument(withLogo: boolean): void {
    this.welcomeMailService.generateWelcomeMail(withLogo, this.welcomeMail).subscribe(
      (data) => {
        const type = data.headers.get('Content-Type');
        const file = new Blob([data.body], { type });     
        const element = document.createElement('a');
        element.target = '_blank';
        element.href = URL.createObjectURL(file);
        document.body.appendChild(element);
        element.click();
      }, 
      (_error) => {
        console.error('', 'Erreur Technique : Le document que vous souhaitez télécharger est introuvable.', 'Ok', null, 'lg', false);
      }
    );   
  }

  onSubmit(_f: any ): void { 
  }

}
