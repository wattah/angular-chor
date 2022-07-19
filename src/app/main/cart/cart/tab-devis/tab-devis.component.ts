import { CommonService } from './../common.service';
import { AuthTokenService } from './../../../../_core/services/auth_token';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { PostalAdresseVO } from './../../../../_core/models/postalAdresseVO';
import { ContactMethodService } from './../../../../_core/services/contact-method.service';
import { Person } from '../../../../../app/_core/models';
import { getCustomerIdFromURL } from './../../../../main/customer-dashboard/customer-dashboard-utils';
import { ParcLigneService } from './../../../../_core/services/parc-ligne.service';
import { ActivatedRoute } from '@angular/router';
import { CustomerParkItemVO } from './../../../../_core/models/customer-park-item-vo';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ControlContainer, FormGroupDirective, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from '../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoPopUpComponent } from '../../../_shared/logo-pop-up/logo-pop-up.component';
import { NotificationService } from '../../../../_core/services/notification.service';
import { CartVO } from '../../../../_core/models/cart-vo';
import { CartService } from './../../../../_core/services/cart.service';
import { CartCreationService } from '../cart-creation.service';
import { PopAddAddressComponent } from '../../../_shared/pop-add-address/pop-add-address.component';
import { BaseForm } from '../../../../_shared/components';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

export interface User {
  name: string;
}

/**
 * @title Display value autocomplete
 */
@Component({
  selector: 'app-tab-devis',
  templateUrl: './tab-devis.component.html',
  styleUrls: ['./tab-devis.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class TabDevisComponent extends BaseForm implements OnInit , OnChanges {
  form: FormGroup;

  hasAssossiedLine = false;
  options: User[] = [{ name: '' }];
  filteredPersons: Observable<Array<{ name: string; id: number }>>;
  parkItems: CustomerParkItemVO[];
  customerId: any;
  interlocutors: Person[];
  interlocutorsAsString: Array<{ name: string; id: number }>;
  person: Person;
  separator = ' ';
  adresseRdv: PostalAdresseVO[];
  address: PostalAdresseVO = null;
  parcours: string;
  cart: CartVO;
  cartId: any;
  cartToSaveDevis;
   //
  withLogo: any;
  showDownloadButton = false;
  savedCartId;

  @Input() visibleActionsOnDevis = false;

  @Input() clickCancelBtn= false;
  @Output() onCheckDevisFormValidation: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCheckDevisModification: EventEmitter<boolean> = new EventEmitter<boolean>();
  isChangedAfterSave = false;
  personIdWithReceLivraison: number;
  disable: boolean;
  _formBuilder: FormBuilder;
  route: ActivatedRoute;
  parcLigneService: ParcLigneService;
  contactMethodService: ContactMethodService;
  confirmationDialogService: ConfirmationDialogService ;
  modalService: NgbModal; 
  cartService: CartService;
  authToken: AuthTokenService;
  notificationService: NotificationService;
  parent: FormGroupDirective;
  cartCreationService:CartCreationService;
  commonService: CommonService;
  constructor(
    private readonly injector : Injector
  ) {
    super();
    this.injectServices();
     /* check if cart is successfully saved then show download button */
    this.notificationService.getShowButton().subscribe((data) => {
      this.showDownloadButton = data;
    });
    
    this.form  = new   FormGroup({});
  }
  
	ngOnChanges(change: SimpleChanges){
    if(!isNullOrUndefined(this.form.get('devis')) && !isNullOrUndefined(change['visibleActionsOnDevis']) 
    && change['visibleActionsOnDevis']){
       if(this.visibleActionsOnDevis){
        this.disable = false;
        this.form.get('devis').enable();
      }else{
        this.disable = true;
        this.form.get('devis').disable();
    }
  }
}

  initDestination(){
    this.route.data.subscribe((resolveData) => {
      this.interlocutors = resolveData['interlocutors'];
      this.cartCreationService.restoreInterlocuteurs(resolveData['interlocutors']);
      this.cart = resolveData['carts'];
      this.cartId = this.cart[0].id;
      let interlocuteur;
      if(this.cart[0]){
        if(this.cart[0].id){
          this.showDownloadButton = true;
        }
        this.cartToSaveDevis = this.cart[0];
        interlocuteur = this.cart[0].request.interlocuteur;
        if(interlocuteur){
          const interlocutorsClone = this.interlocutors.slice();
          const isExist = interlocutorsClone.filter(interlocutor=> interlocutor.idPerson === interlocuteur.personId)[0];
          if(isNullOrUndefined(isExist) && !isNullOrUndefined(interlocuteur) && !isNullOrUndefined(interlocuteur.personCustomerRoles[0])){
            const localInterlocuteur = {} as Person;
            localInterlocuteur.idPerson = interlocuteur.personId;
            localInterlocuteur.firstName = interlocuteur.firstName
            localInterlocuteur.lastName = interlocuteur.lastName
            localInterlocuteur.roleLabel = interlocuteur.personCustomerRoles[0].refRole.label
            localInterlocuteur.roleKey = interlocuteur.personCustomerRoles[0].refRole.key
            this.interlocutors.unshift(localInterlocuteur);
          }
        }
      }
      this.interlocutorsAsString = this.interlocutors.map(
        (interlocutor) => this.formatInterlocutor(interlocutor)
      );
      this.filteredPersons = this.form.get('devis').get('destination').valueChanges.pipe(
        startWith(''),
        map((name) =>
          name ? this._filter(name) : this.interlocutorsAsString.slice()
        )
      );
      this.setDefaultDestination();
     
    });
  
    
  }
  initParkLigne(){
    this.customerId = getCustomerIdFromURL(this.route);
    this.parcLigneService
      .getParkItemsFull(this.customerId)
      .subscribe((data) => {
        this.parkItems = data;
        this.setDevisValues();
      });
  }
  ngOnInit() {
    this.form = this.parent.form;
    this.form .addControl('devis', new FormGroup({
      destination: this._formBuilder.control(null),
      descriptif: this._formBuilder.control(''),
      addressDevis: this._formBuilder.control(null),
      addressDevisObject: this._formBuilder.control(null),
      associetedLine: this._formBuilder.control(null),
      etageInput : this._formBuilder.control(null),
      interventionOnLine : this._formBuilder.control(null),
    }))
    this.setValidatorsByParcoursType();
    this.initDestination();
    this.initParkLigne();
    this.setRestrictions();
  }
  setRestrictions() {
    if(this.visibleActionsOnDevis) {
      this.disable = false;
      this.form.get('devis').enable();
      this.notifyWhenDevisFromIsValid();
    }else{
      this.disable = true;
      this.form.get('devis').disable();
      this.onCheckDevisFormValidation.emit(true);
    }
  }


  setDevisValues() {
     if(this.cart[0]){
      this.form.get('devis').get('descriptif').setValue(this.cart[0].quotationDescription);
      this.form.get('devis').get('interventionOnLine').setValue(this.cart[0].interventionOnLine);
      if(!isNullOrUndefined(this.cart[0].quotationPostalAddressNewVo) && !isNullOrUndefined(this.cart[0].quotationPostalAddressNewVo.id)){
        this.setAddressById(this.cart[0].quotationPostalAddressNewVo.id);
      }
      if(this.cart[0].parkItemId){
        this.hasAssossiedLine = true;
        const parkItemId = this.cart[0].parkItemId;
        const parkItems = this.parkItems.slice();
        const parkItem = parkItems.filter(parkItem => parkItem.id = parkItemId)[0];
        this.form.get('devis').get('associetedLine').setValue(parkItem);
      }else{
        this.hasAssossiedLine = false;
      }
    }
  }
 
  setAddressById(quotationPostalAddressId: number) {
    this.contactMethodService.getAddressById(quotationPostalAddressId).subscribe(
      (address)=>{
        this.form.get('devis').get('addressDevisObject').setValue(address);
        if(address && address.types){
          this.form.get('devis').get('addressDevis').setValue(`Adresse ${address.types[0].label}`)
        }
       
       
      }
    );
  }
  setDefaultDestination() {
    if(this.cart[0] && this.cart[0].quotationPostalAddressNewVo && this.cart[0].quotationPostalAddressNewVo.personId){
      this.interlocutorsAsString.forEach((interlocuteur)=> {
         if(interlocuteur.id  && this.cart[0].quotationPostalAddressNewVo.personId === interlocuteur.id){
             this.form.get('devis').get('destination').setValue(interlocuteur.name);
             this.onChosePerson(interlocuteur);
          }
      });
    }
    else{
      const beneficiaire = this.interlocutorsAsString.filter((interlocutor) =>
      interlocutor.name.includes('Bénéficiaire'))[0];
      if (beneficiaire) {
        this.form.get('devis').get('destination').setValue(beneficiaire.name);
        this.onChosePerson(beneficiaire);
      } else {
        const particulier = this.interlocutorsAsString.filter((interlocutor) =>
          interlocutor.name.includes('Particulier')
        )[0];
        if (particulier) {
          this.form.get('devis').get('destination').setValue(particulier.name);
          this.onChosePerson(particulier);
        }
      }
    }
  
  }

  downloadDevis(): any {
    this.savedCartId = this.cartId;
    console.log('cart id devis', this.savedCartId);
    this.modalService.open(LogoPopUpComponent, { centered: true });
    this.notificationService.getWithLogo().pipe(first()).subscribe((response) => 
    this.cartService.generateCartQuotation(this.savedCartId, response.toString()).subscribe((data) => {
      const filePdf = this.commonService.blobToArrayBuffer(data.document);
      this.commonService.saveResponseFileAsPdf(data.name, filePdf);
    })
    );
  }

  //

  private notifyWhenDevisFromIsValid() {
    this.emitFirstState();
    this.form.get('devis').valueChanges.subscribe((data) => {
      if(this.form.get('devis').dirty){
        this.onCheckDevisModification.emit(true);
        console.log('notifyWhenDevisFromIsValid ');
        this.notificationService.setShowButton(false);
      }
        this.emitFormState();
    });
  }

  private emitFormState() {
    if (this.disable) {
      this.onCheckDevisFormValidation.emit(true);
    } else {
      this.onCheckDevisFormValidation.emit(this.form.get('devis').valid);
    }
  }


  private emitFirstState() {
    if (this.form.get('devis')) {
      this.emitFormState();
    }
  }

  private setValidatorsByParcoursType() {
    this.parcours = this.route.snapshot.queryParamMap.get('parcours');
    if (
      this.parcours === 'Achat - Prestation' ||
      this.parcours === 'Achat - Abonnement solution sécurité'
    ) {
      this.form.get('devis').get('destination').setValidators(Validators.required);
      this.form.get('devis').get('destination').updateValueAndValidity();
      this.form.get('devis').get('descriptif').setValidators([Validators.required , Validators.minLength(3)]);
      this.form.get('devis').get('descriptif').updateValueAndValidity();
      this.form.get('devis').get('addressDevis').setValidators(Validators.required);
      this.form.get('devis').get('addressDevis').updateValueAndValidity();
      this.form.get('devis').get('addressDevisObject').setValidators(Validators.required);
      this.form.get('devis').get('addressDevisObject').updateValueAndValidity();
    }else{
      this.form.get('devis').clearValidators();
      this.form.get('devis').updateValueAndValidity();
    }
  }

  formatInterlocutor(interlocutor: Person): { name: string; id: number } {
    let nameToRetourn = '';
    let idToRetourn;
    if(interlocutor){
      const firstName = !isNullOrUndefined( interlocutor.firstName) ?
      interlocutor.firstName.charAt(0).toUpperCase() +
      interlocutor.firstName.slice(1) : '';
    interlocutor.lastName = interlocutor.lastName.toLowerCase();
    const lastName = !isNullOrUndefined( interlocutor.lastName) ?
      interlocutor.lastName.charAt(0).toUpperCase() +
      interlocutor.lastName.slice(1) : '';
     const interlocutorRole =  interlocutor.roleLabel ?'-'+ interlocutor.roleLabel: 
     (interlocutor.personRoleLabel ? '-'+ interlocutor.personRoleLabel : '');  
     nameToRetourn = `${firstName} ${lastName}  ${interlocutorRole}`;
     idToRetourn = interlocutor.idPerson;
    }
    return {
      'name': nameToRetourn,
      'id': idToRetourn,
    };
  }

  private _filter(name: string): Array<{ name: string; id: number }> {
    const filterValue = name.toLowerCase();
    return this.interlocutorsAsString.filter(
      (option) => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  annuler(): any {
        const title = 'Erreur!';
        const comment = 'Êtes-vous sûr de vouloir annuler votre création ?';
        const btnOkText = 'Oui, j\'annule ma création';
        const btnCancelText = 'Non je reviens à ma création';
        this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText, 'lg',true)
        .then((confirmed) => console.log('User confirmed:', confirmed))
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
   }

  getOptions(event) {
    this.hasAssossiedLine = event.checked;
    if (
      this.hasAssossiedLine &&
      (this.parcours === 'Achat - Prestation' ||
        this.parcours === 'Achat - Abonnement solution sécurité')
    ) {
      this.form.get('devis').get('associetedLine').setValidators([Validators.required]);
      this.form.get('devis').get('associetedLine').updateValueAndValidity();
    }
  }

  onChosePerson(person) {
    if (person) {
      this.person = this.interlocutors.filter(
        (interlocutor) => interlocutor.idPerson === person.id
      )[0];
      this.address = null;
      this.form.get('devis').get('addressDevis').setValue('- -');
      if(this.person){
        this.personIdWithReceLivraison = this.person.idPerson;
      this.contactMethodService
        .getListPostalAddress(this.person.idPerson)
        .subscribe((data) => {
          this.adresseRdv = data;
          if (this.adresseRdv && this.adresseRdv.length !== 0) {
            this.adresseRdv = this.commonService.sortAdresseRdv(this.adresseRdv);
            const adresseRdvClone = this.adresseRdv.slice();
            const principalAdresse = adresseRdvClone.filter((adr) =>
              adr.types[0].label.includes('Principal'))[0];
            this.defaultAffichageAdresse(principalAdresse, this.adresseRdv[0]);
          } else {
            this.form.get('devis').get('addressDevis').setValue('- -');
          }
        });}
    }

  }

  onClickDestination(formControl: AbstractControl, autoCompleteTrigger: MatAutocompleteTrigger) {
    const DEVIS = 'devis';
    super.clearAutoCompleteInputControl( formControl as FormControl, autoCompleteTrigger);
    this.form.get(DEVIS).get('addressDevis').setValue('');
    this.form.get(DEVIS).get('addressDevisObject').setValue(null);
    this.adresseRdv = [];
    this.form.get(DEVIS).get('destination').updateValueAndValidity();
  }

  defaultAffichageAdresse(isPrincipal, adresse: PostalAdresseVO) {
  if(!isNullOrUndefined(this.cart[0].quotationPostalAddressNewVo)) {
    this.form.get('devis').get('addressDevisObject').setValue(adresse);
    this.form.get('devis').get('addressDevis').setValue(`Adresse ${adresse.types[0].label}`);
  }else if (isPrincipal) {
      this.form.get('devis').get('addressDevisObject').setValue(adresse);
      this.form.get('devis').get('addressDevis').setValue('Adresse Principal');
    }else {
      this.form.get('devis').get('addressDevis').setValue('- -');
    }
  }
  
  sort(rdv1, rdv2): number {
    const label1 = rdv1.types[0].label.toUpperCase();
    const label2 = rdv2.types[0].label.toUpperCase();
    if (label1 > label2) {
      return 1;
    }
    if (label1 < label2) {
      return -1;
    }
    return 0;
  }

  onChoseAddress(adresse) {
    this.form.get('devis').get('addressDevisObject').setValue(adresse);
    this.address = adresse;
  }

  openPopup() {
    let valueResult: PostalAdresseVO  = {} as PostalAdresseVO;
    const modal = this.modalService.open(PopAddAddressComponent, { centered: true, 
      windowClass: 'custom_popup',
      size: 'lg', backdrop : 'static', keyboard: false
      });
      modal.componentInstance.personId = this.personIdWithReceLivraison;
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

    getAddressTemporaire(resultCmPostalAddressVO: PostalAdresseVO) {
      this.adresseRdv.push(resultCmPostalAddressVO);
          if (this.adresseRdv && this.adresseRdv.length !== 0) {
            this.adresseRdv = this.commonService.sortAdresseRdv(this.adresseRdv);
              this.form.get('devis').get('addressDevisObject').setValue(resultCmPostalAddressVO);
              this.form.get('devis').get('addressDevis').setValue(`Adresse ${resultCmPostalAddressVO.types[0].label}`);
              this.address = resultCmPostalAddressVO;
          } 
      }


  changeAdresseInput($event){
    if(this.form.get('devis').dirty){
      this.form.get('devis').get('addressDevisObject').setValue(null);
    } 
  }

  injectServices() {
    this._formBuilder = this.injector.get<FormBuilder>(FormBuilder);
    this.route = this.injector.get<ActivatedRoute>(ActivatedRoute);
    this.parcLigneService = this.injector.get<ParcLigneService>(ParcLigneService);
    this.contactMethodService = this.injector.get<ContactMethodService>(ContactMethodService);
    this.confirmationDialogService = this.injector.get<ConfirmationDialogService>( ConfirmationDialogService);
    this.modalService = this.injector.get<NgbModal>(NgbModal);
    this.notificationService = this.injector.get<NotificationService>(NotificationService);
    this.cartService = this.injector.get<CartService>(CartService);
    this.authToken = this.injector.get<AuthTokenService>(AuthTokenService);
    this.parent = this.injector.get<FormGroupDirective>(FormGroupDirective);
    this.cartCreationService = this.injector.get<CartCreationService>(CartCreationService);
    this.commonService = this.injector.get<CommonService>(CommonService);
  }
}
