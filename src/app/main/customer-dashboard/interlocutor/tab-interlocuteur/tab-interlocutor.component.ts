import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CmInterlocutorVO } from '../../../../_core/models/cm-Interlocutor-vo';
import { Interlocutor360Service } from '../interlocutor-360.service';
import { ContactMethodService, PersonService } from '../../../../_core/services';
import { TYPE_CM_INTERLOCUTOR, CM_MEDIA_REF_KEY, ROLE_INTERLOCUTOR, PERSON_CATEGORY, LANGUAGES } from '../../../../_core/constants/constants';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { PostalAdresseVO } from '../../../../_core/models/postalAdresseVO';
import { InterlocutorVO } from '../../../../_core/models/interlocutor-vo';
import { ReferenceDataVO } from '../../../../_core/models/reference-data-vo';
import { Router } from '@angular/router';
import { getDecryptedValue } from '../../../../_core/utils/functions-utils';
import { ConfirmationDialogService } from '../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { fullNameFormatter } from '../../../../_core/utils/formatter-utils';

@Component({
  selector: 'app-tab-interlocutor',
  templateUrl: './tab-interlocutor.component.html',
  styleUrls: ['./tab-interlocutor.component.scss']
})
export class TabInterlocutorComponent implements OnChanges, OnInit {

  @Input() showinterlocuteur: boolean;
  @Input() interlocutorList;
  @Input() typeCustomer: string;
  @Input() customerId;
  @Output() onValidMobileContact = new EventEmitter<number>();
  @Output() onValidPhoneHomeContact = new EventEmitter<number>();
  @Output() onValidEmailContact = new EventEmitter<number>();
  @Output() onValidAddressContact = new EventEmitter<number>();
  isExistPrincipalInter = true;
  isExistProInter = true;
  cmMediaRef = CM_MEDIA_REF_KEY;
  cmPrincipalList = [];
  cmProList = [];
  cmSeconList = [];
  isFirstEnter = true;
  inCompleteCall = true;
  isValidContacts = {};
  separator = '\n';
  constructor(private readonly interlocutorService: Interlocutor360Service,
    private readonly personService: PersonService, 
    private readonly router: Router,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly contactMethodService: ContactMethodService) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (!isNullOrUndefined(this.interlocutorList)) {
      this.interlocutorsFetch();
      this.interlocutorService.ordorInterlocutorsCM(this.interlocutorList);
    }
  }

  ngOnInit(): void {
    this.isExistPrincipalInter = true;
    console.log('interlocutorList ' , this.interlocutorList);
  }

  getClientName(interlocuteur: InterlocutorVO): string {

    if (interlocuteur.categoryPersonKey === PERSON_CATEGORY.MORALE) {
      if (interlocuteur.crmName !== null) {
        return interlocuteur.crmName ;
      } 
      return '-' ;
      
    } 
    return fullNameFormatter(interlocuteur.title, interlocuteur.firstName, interlocuteur.lastName, this.separator);
    
  }
  interlocutorsFetch(): void {
    this.sortInterlocutorByRole(this.interlocutorList);
    this.initTableCM();
    for (const interVo of this.interlocutorList) {
      if ((interVo !== null && interVo.contactMethodsVO !== null)) {
        this.interlocutorService.ordorInterlocutorsCM(interVo.contactMethodsVO);
        this.getContactMethodsByType(interVo);
      }
    }
  }

  sortInterlocutorByRole(values: InterlocutorVO[]) {
    values.sort((a, b) => {
      if (a && a.roles[0].key === ROLE_INTERLOCUTOR.ROLE_BENEFICIARE.key ||
         a.roles[0].key === ROLE_INTERLOCUTOR.ROLE_TITULAIRE.key ) {
        return -1;
      }
      return 0;
    });
  }

  formatterRole(values: ReferenceDataVO[]): string {
    let result = '';
    if (!isNullOrUndefined(values)) {
      for (const role of values) {
        result += role.label;
        if (values.indexOf(role) < values.length - 1 ) {
          result += ',\n';
        }
      }
    }

    if (values && values.length > 1) {
      result += '.';
    }
    
    if (this.typeCustomer === 'particular') {
      return result.replace(ROLE_INTERLOCUTOR.ROLE_BENEFICIARE.value, 'Particulier');  
    }

    return result;
  }

  cmListByMedia(cmList: CmInterlocutorVO[], mediaRef: string, isPrincipal: boolean, isSecondaire: boolean): CmInterlocutorVO[] {
    return  this.interlocutorService.cmListByMediaRef(cmList, mediaRef, isPrincipal, isSecondaire);
  }

  getcmListInterlocutorBy(cm: InterlocutorVO, mediaRef: string, isPrincipal: boolean): CmInterlocutorVO[] {
    let cmList = [];
    if (!isNullOrUndefined(cm.contactMethodsVO)) {
      this.isExistPrincipalInter = false;
      this.isExistProInter = false;
    }
    if (isPrincipal && !isNullOrUndefined(cm.contactMethodsVO)) {
      cmList = this.getListPriForInter(cm.contactMethodsVO);
      this.isExistPrincipalInter = this.checkList(cm.contactMethodsVO);
    } else if (!isNullOrUndefined(cm.contactMethodsVO)) {
      cmList = this.getListProForInter(cm.contactMethodsVO);
      this.isExistProInter = this.checkList(cmList);
    }
    return  this.interlocutorService.cmListByMediaRef(cmList, mediaRef, isPrincipal, false);
  }

  checkIsExistPro(cm: InterlocutorVO): boolean {
    let cmList = [];
    if (!isNullOrUndefined(cm.contactMethodsVO)) {
      cmList = this.getListProForInter(cm.contactMethodsVO);
    }
    return this.checkList(cmList);
  }

  checkIsExistPrincipal(cm: InterlocutorVO): boolean {
    let cmList = [];
    if (!isNullOrUndefined(cm.contactMethodsVO)) {
      cmList = this.getListPriForInter(cm.contactMethodsVO);
    }
    return this.checkList(cmList);
  }

  checkList(list: any[]): boolean {
    if (isNullOrUndefined(list) || list.length === 0) {
      return false;
    } 
    return true;
  }

  checkInterlocutor(cm: InterlocutorVO): boolean {
    if (this.isInRoleBenefOrTituOrParticular(cm)) {
      return false;
    } 
    return this.isInRoleInterlocutor(cm);
    
  } 

  isInRoleInterlocutor(cm: InterlocutorVO): boolean {
    if (!isNullOrUndefined(cm) && !isNullOrUndefined(cm.roles)) {
      for (const role of cm.roles) {
        if ((this.typeCustomer === 'beneficiary' &&  !isNullOrUndefined(role) && ( role.key === ROLE_INTERLOCUTOR.ROLE_DELEGUE.key 
        || role.key === ROLE_INTERLOCUTOR.ROLE_RESPONSABLE_FACTURATION.key || role.key === ROLE_INTERLOCUTOR.ROLE_RESPONSABLE_SI.key
        || role.key === ROLE_INTERLOCUTOR.ROLE_ASSISTANT_DIRECTION.key)) || 
           (this.typeCustomer === 'company' && !isNullOrUndefined(role) && 
           (role.key === ROLE_INTERLOCUTOR.ROLE_RESPONSABLE_SI.key ||
          role.key === ROLE_INTERLOCUTOR.ROLE_RESPONSABLE_FACTURATION.key || role.key === ROLE_INTERLOCUTOR.ROLE_ASSISTANT_DIRECTION.key ||
          role.key === ROLE_INTERLOCUTOR.ROLE_LEGAL_REPRESENTATIVE.key || 
          role.key === ROLE_INTERLOCUTOR.ROLE_ADMINISTRATEUR.key)) || 
           (this.typeCustomer === 'particular' && !isNullOrUndefined(role) && 
           (role.key === ROLE_INTERLOCUTOR.ROLE_DELEGUE.key || role.key === ROLE_INTERLOCUTOR.ROLE_ASSISTANT_DIRECTION.key))) {
          return true;
        }
      } 
    }
    return false;
  }

  isInRoleBenefOrTituOrParticular(cm: InterlocutorVO): boolean {
    if (!isNullOrUndefined(cm) && !isNullOrUndefined(cm.roles)) {
      return cm.roles.some(role => role.key === ROLE_INTERLOCUTOR.ROLE_BENEFICIARE.key || 
        role.key === ROLE_INTERLOCUTOR.ROLE_TITULAIRE.key);
    }
    return false;
  }

  getFlagClass(favoriteLanguage: string): string {
    switch (favoriteLanguage)  {
       case LANGUAGES.ENG:
        return 'icon en-flag athena mr-3';
       case LANGUAGES.FR:
       return 'icon fr-flag athena mr-3'
       case LANGUAGES.ITA:
       return 'icon it-flag athena mr-3'
       case LANGUAGES.RUN:
        return 'icon uk-flag athena mr-3'
        case LANGUAGES.ASA:
       return 'icon as-flag athena mr-3'
       case LANGUAGES.RUS:
        return 'icon rs-flag athena mr-3'
      
      default:
        return  ' ';
    }
  }

  valideCm(mc: CmInterlocutorVO): void {
    if (mc.isExpired) {
      this.personService.validerCm(mc.id).subscribe(data => {
        if (data === true) {
          this.isFirstEnter = false;
          mc.isExpired = false;
          this.interlocutorService.setIcon(mc);
        }
      });   
    }
  }

  getContactMethodsByType(cm: InterlocutorVO): void {
    for (const cmvo of cm.contactMethodsVO) {
      if (!isNullOrUndefined(cmvo) && !isNullOrUndefined(cmvo.types) && this.isInRoleBenefOrTituOrParticular(cm)) {
        this.getListPriProSec(cmvo);
      }
    }
  }

  getListPriForInter(cmList: CmInterlocutorVO[]): any[] {
    const list = [];
    for (const cmvo of cmList) {
      if (!isNullOrUndefined(cmvo) && !isNullOrUndefined(cmvo.types)) {
        for (const item of cmvo.types) {
          if (item.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key) {
            list.push(cmvo);
          } 
        }
      }
    }
    return list; 
  }

  getListSecForInter(cmList: CmInterlocutorVO[]): any[] {
    const list = [];
    for (const cmvo of cmList) {
      if (!isNullOrUndefined(cmvo) && !isNullOrUndefined(cmvo.types)) {
        for (const item of cmvo.types) {
          if (item.key === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key) {
            list.push(cmvo);
          } 
        }
      }
    }
    return list; 
  }

  getListProForInter(list: CmInterlocutorVO[]): any[] {
    const results = [];
    for (const cm of list) {
      if (!isNullOrUndefined(cm) && !isNullOrUndefined(cm.types)) {
        for (const type of cm.types) {
          if (type.key === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key) {
            results.push(cm);
          }
        }
      }
    }
    return results;
  }

  getListPriProSec(cmvo: CmInterlocutorVO): void {
    for (const item of cmvo.types) {
      if (item.key === TYPE_CM_INTERLOCUTOR.PRINCIPAL.key) {
        this.cmPrincipalList.push(cmvo);
      } else if ( item.key === TYPE_CM_INTERLOCUTOR.PROFESSIONNEL.key) {
        this.cmProList.push(cmvo);
      } else if ( item.key === TYPE_CM_INTERLOCUTOR.SECONDAIRE.key) {
        this.cmSeconList.push(cmvo);
      }
    }
  }

  initTableCM(): void {
    this.cmPrincipalList = [];
    this.cmProList = [];
    this.cmSeconList = [];
  }

  getFullAddress(adressPostal: PostalAdresseVO ): string {
    if (!isNullOrUndefined(adressPostal)) {
      return this.interlocutorService.getFullAddress(adressPostal);
    }
    return '';
  }

  redirectToEditBenOrParOrEnt(personId: number, isInterlocutor: boolean ): void {
    const customerDahboard = '/customer-dashboard';
    const interUsage = 'interlocutor-usage';
    if (this.typeCustomer === 'company' && !isInterlocutor) {
      this.router.navigate(
        [customerDahboard, this.customerId , interUsage , 'modification', 'entreprise', personId],
        {
          queryParams: { typeCustomer: this.typeCustomer },
          queryParamsHandling: 'merge'
        }
      );
    } else {
      this.router.navigate(
        [customerDahboard, this.customerId , interUsage , 'modification', 'particular', personId, isInterlocutor],
        {
          queryParams: { typeCustomer: this.typeCustomer },
          queryParamsHandling: 'merge'
        }
      );
    }
  }

  deleteInterlocutor(person): void {
    const btnOkText = 'Oui je supprime cet interlocuteur';
    const btnCancelText = 'Non, je garde cet interlocuteur';
    let comment = 'Etes-vous sûr de vouloir supprimer ';
    comment += `${fullNameFormatter(null, person.firstName, person.lastName)} ?`;
    this.confirmationDialogService.confirm('', comment, btnOkText, btnCancelText, 'sm')
    .then(
      (confirmed) => {
        if (confirmed) {
           this.personService.deleteInterlocutor(person.personId, getDecryptedValue(this.customerId)).subscribe( result => {
    if (result === true) {
      window.location.reload();
    }
  });
        }
      }     
    );
  }

  deleteCm(type: string, cm: InterlocutorVO, isPrincipal) {
    const btnOkText = 'Oui, je le supprime';
    const btnCancelText = 'Non, je souhaite le garder';
    let comment = 'Etes-vous sûr de vouloir supprimer les coordonnées ';
    comment += `${type} de ${fullNameFormatter(null, cm.firstName, cm.lastName)} ?`;
    this.confirmationDialogService.confirm('', comment, btnOkText, btnCancelText, 'sm')
        .then((confirmed) => {
                  if (confirmed) {
                    const ids = this.checkTypeAndGetIds(type, cm, isPrincipal);
                     this.contactMethodService.deleteContactMethodById(ids).subscribe( data => {
                  if (data === true) {
                    window.location.reload();
                    }
                });
              }
            });
    }

    /**
     * permet de verifier le type de media et recuperer la liste des ids correspond
     * @param type 
     * @param cm 
     * @returns 
     */
    checkTypeAndGetIds(type: string, cm: InterlocutorVO, isPrincipal: boolean): number[] {
      return type === this.interlocutorService.secondaires ? this.getIdsCmSecondaire(cm) : this.getIdsCmProOrPrincipal(cm, isPrincipal);
    }

  getIdsCmProOrPrincipal(cm: InterlocutorVO, isPrincipal): number[] {
    const ids = [];
    for (const  cmvo of this.getcmListInterlocutorBy(cm, this.cmMediaRef.TEL_FIXE, isPrincipal)) {
      ids.push(cmvo.id);
    }
    for (const  cmvo of this.getcmListInterlocutorBy(cm, this.cmMediaRef.TEL_MOBILE, isPrincipal)) {
      ids.push(cmvo.id);
    }
    for (const  cmvo of this.getcmListInterlocutorBy(cm, this.cmMediaRef.EMAIL, isPrincipal)) {
      ids.push(cmvo.id);
    }
    for (const  cmvo of this.getcmListInterlocutorBy(cm, this.cmMediaRef.POSTAL_ADDRESS, isPrincipal)) {
      ids.push(cmvo.id);
    }
    return ids;
  }

  /**
   * permet de recueperer la liste des ids medias 
   * @param cm 
   * @returns 
   */
  getIdsCmSecondaire(cm: InterlocutorVO): number[] {
    const ids = [];
    if(!isNullOrUndefined(cm) && !isNullOrUndefined(cm.contactMethodsVO)) {
          for (const  cmvo of this.getListSecForInter(cm.contactMethodsVO)) {
            ids.push(cmvo.id);
          }
        }
    return ids;
  }

  refresh(): void {
    this.inCompleteCall = true;
    this.personService.getPersonAndInterlocutorsByCustomerId(this.customerId)
                        .pipe(catchError(() => of(null)))
                        .subscribe(
                          (interlocutors) => {
                            this.interlocutorList = interlocutors;
                          },
                          (error) => {
                            this.inCompleteCall = false;
                          },
                          () => {
                            this.inCompleteCall = false;
                          }
                        );
  }

  validMobileContact(contact) {
    if (contact.isExpired) {
      this.onValidMobileContact.emit(contact.id);
    }
  }

  validPhoneHomeContact(contact) {
    if (contact.isExpired) {
      this.onValidPhoneHomeContact.emit(contact.id);
    }
  }

  validEmailContact(contact) {
    if (contact.isExpired) {
      this.onValidEmailContact.emit(contact.id);
    }
  }

  validaddressContact(contact) {
    if (contact.isExpired) {
      this.onValidAddressContact.emit(contact.id);
    }
  }

}
