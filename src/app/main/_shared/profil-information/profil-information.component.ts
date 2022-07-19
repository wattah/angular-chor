import { Subscription } from 'rxjs';

import { DebteService } from './../../../_core/services/debt.service';
import { firstNameFormatter, formatterStatut } from '../../../_core/utils/formatter-utils';
import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  ViewEncapsulation,
  EventEmitter,
  Output,
  OnInit
  
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HomologationAccessService } from './../../../_core/services/index';
import { TASK_STATUS_WITH_ALL_SUB_CATEGORIESSS, CONSTANTS, CONTRAT_STATUTS } from '../../../_core/constants/constants';

import { CustomersLight } from '../../../_core/models/customers_light';

import { BeneficiaireView } from '../../../_core/models/profil-infos-dashboard';
import { countYearsByDate } from '../../../_core/utils/date-utils';
import { nicheIdentifierTransformer } from '../../../_core/utils/formatter-utils';
import {
  getDefaultStringEmptyValue,
  isNullOrUndefined,
  sentenceCase
} from '../../../_core/utils/string-utils';
import { CustomerDashboardService } from '../../customer-dashboard/customer-dashboard.service';
import { CustomerService } from '../../../_core/services';
import { getCustomerIdFromURL, getCustomerTypeStringFromURL } from '../../customer-dashboard/customer-dashboard-utils';
import { CustomerProfileVO } from '../../../_core/models/customer-profile-vo';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-profil-information',
  templateUrl: './profil-information.component.html',
  styleUrls: ['./profil-information.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class ProfilInformationComponent implements  OnChanges , OnInit{
  @Input()
  infoCustomer: BeneficiaireView;

  @Input()
  isEntreprise: boolean;

  @Input()
  isParticular: boolean;

  @Input() isBeneficiary: boolean;

  @Input()
  recoveryDate: Date;

  @Input()
  severalCustomerTit: CustomersLight[];

  @Input()
  customerId: string;

  @Input() entrepriseRecoveryDate: Date;


  nicheIdentifiant: string;

  customerFull: CustomerProfileVO;

  typeCustomerCompany: any;
  nationality = '';

  @Input()
  isProfilReduit: Boolean;

  @Input() typeCustomer: string;

  inCompleteCall: boolean = true;

  isTableWithResilie = false;
  isTableNotResilie = false;
  listCustomers = [];
  listCustomersNotWithResilie = [];
  desactiveMask = false;
  nicheId: string;
  LOCAL_CONTRAT_STATUTS = CONTRAT_STATUTS;
  @Input() detteTotalTTC: number;
  subscription: Subscription;
  @Input() detteTotal: number;
  @Output() onSendNichesWithRemainingGreatThanZero= new EventEmitter<string[]>();
  @Output() onSendRemaining= new EventEmitter<number>();
  errorRecovery: boolean;
  @Input() homologationsIds: number[];
  
  /**
   * Constructeur
   * @param utilsService service
   * @param  customerDashboardService
   */
  constructor(private readonly customerDashboardService: CustomerDashboardService, 
    private readonly route: ActivatedRoute,
    private readonly customerService : CustomerService, private readonly debteService: DebteService, 
    readonly homologationAccessService: HomologationAccessService) {}

    ngOnInit(){
      this.getNicheValue();
      if(!this.detteTotalTTC && !this.detteTotal){
        this.subscription = this.debteService.recoveryOfBill$
        .pipe(delay(0))
        .subscribe(
          (total)=>{
            this.detteTotalTTC = total.detteTotalTTC;
            this.detteTotal = total.detteTotal;
            this.onSendNichesWithRemainingGreatThanZero.emit(total.nichesWithRemainingGreatThanZero);
            this.onSendRemaining.emit(this.detteTotalTTC);
          }
        );
    }
    this.debteService.errorInBill$
        .pipe(delay(0))
        .subscribe(error=>  this.errorRecovery = error);
  }

  openHomologationPopup(): void {
    this.homologationAccessService.openHomologationPopup(this.homologationsIds, this.customerId, 
      getCustomerTypeStringFromURL(this.route), false, null);
  }  

  private getNicheValue() {
    this.nicheId = this.nicheIdentifiant;
  }

  getCustomerFullAndNationality(): void{
    this.customerId = getCustomerIdFromURL(this.route);
    this.customerService.getFullCustomer(this.customerId).subscribe( data => {
      this.customerFull = data;
      if ( this.customerFull.person !== null && this.customerFull.person.refNationality !== null && 
        this.customerFull.person.refNationality.labelComplement ){
      this._filterNationnality(this.customerFull.person.refNationality.labelComplement);
      } else {
        this.nationality = '-';
      }
    });
  }  

  _filterNationnality(valuee: any): string {
    let ib: any =[];
     ib= TASK_STATUS_WITH_ALL_SUB_CATEGORIESSS.filter(
       nationnlite => nationnlite.data.toLowerCase()===valuee.toString().toLowerCase()) ;
       this.nationality=ib[0].label;
      return this.nationality;
       
  }
/**
 * gestion HyperText des masques ou voir Statut resilie  
 */
  maskManagementOrViewStatusCustomer(): void {
      const isWithResilie = this.severalCustomerTit.find(cust => cust.statut === CONTRAT_STATUTS.INACTIVE.key);
      const isNotResilie = this.severalCustomerTit.find(cust => (cust.statut === CONTRAT_STATUTS.ACTIVE.key || 
        cust.statut === CONTRAT_STATUTS.PROSPECT.key || cust.statut === CONTRAT_STATUTS.CONTACT.key));
      this.isTableWithResilie = Boolean(isWithResilie && isNotResilie);
        if(this.isTableWithResilie) {
          this.listCustomers = this.listCustomersNotWithResilie;
          this.isTableNotResilie = false;
        }else {
          this.listCustomers = this.severalCustomerTit;
          this.isTableNotResilie = true;
        }
    }

  getListContrats(value: boolean): CustomersLight[] {
    if(value) {
      this.listCustomers = this.severalCustomerTit;
      this.isTableNotResilie = true;
      return this.listCustomers;
    } else {
      this.isTableNotResilie = false;
      this.listCustomers = this.listCustomersNotWithResilie;
      return this.listCustomers;
    }
    
  }

  formatterStatut(value: string): string {
    return formatterStatut(value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['infoCustomer'] && !isNullOrUndefined(this.infoCustomer)) {
      this.getCustomerFullAndNationality();
      this.nicheIdentifiant = this.infoCustomer.nicheIdentifier;
      this.nicheId = this.nicheIdentifiant;
      this.typeCustomerCompany = CONSTANTS.TYPE_COMPANY;
      this.infoCustomer = {
        ...this.infoCustomer,
        age: countYearsByDate(this.infoCustomer.birthdate),
        title: this.infoCustomer.title,
        firstName: this.infoCustomer.firstName,
        lastName: this.infoCustomer.lastName,
        nicheIdentifier:this.infoCustomer.nicheIdentifier,
        siren: getDefaultStringEmptyValue(this.infoCustomer.siren),

        offerLabel: getDefaultStringEmptyValue(this.infoCustomer.offerLabel),
        dateEntryCercle: this.infoCustomer.dateEntryCercle,
        businessSectorRef: getDefaultStringEmptyValue(
          this.customerDashboardService.businessSecteurRefFormatter(
            this.infoCustomer.businessSectorRef
          )
        ),
        metier: this.getMetier(
          this.infoCustomer.professionRef,
          this.infoCustomer.professionRefParent,
          this.infoCustomer.isAssistant,
          this.infoCustomer.husbandWife
        ),
        providerSupplier: this.customerDashboardService.CheckSupplierBusinesProvider(
          this.infoCustomer.businessProvider,
          this.infoCustomer.supplier
        ),
        companyName: this.infoCustomer.companyName,
        status: this.formatterStatut(this.infoCustomer.status),
        membrePhoto: this.customerDashboardService.profilPicture(
          this.infoCustomer.title,
          this.infoCustomer.photo,
          this.isEntreprise
        )
      };
      sessionStorage.setItem('companyNiche', this.infoCustomer.companyNiche);
    }
    if (changes['severalCustomerTit'] && !isNullOrUndefined(this.severalCustomerTit)) {
      this.listCustomersNotWithResilie = this.severalCustomerTit.filter(obj => obj.statut !== CONTRAT_STATUTS.INACTIVE.key);
      this.maskManagementOrViewStatusCustomer();
      this.selectContractByNicheValue();
    }
    this.inCompleteCall = false;
  }

  private selectContractByNicheValue() {
      this.nicheId = this.nicheIdentifiant;
      if(this.nicheId){
        const selectedResilie = this.severalCustomerTit.find(cust => cust.statut === CONTRAT_STATUTS.INACTIVE.key && cust.nichIdentifiant === this.nicheId);
        if(selectedResilie) {
          this.getListContrats(true);
          this.desactiveMask = true;
        } else {
          this.getListContrats(false);
          this.desactiveMask = false
        }
      }
  }

  getMetier(
    proRef: string,
    proRefParent: string,
    isAssistant: Boolean,
    isHusbandWife: Boolean
  ): string {
    let jobText = '';
    if (isAssistant && isHusbandWife) {
      jobText = 'Assistant(e) de et Époux/Épouse de ';
    } else if (isAssistant || isHusbandWife) {
      if (isAssistant) {
        jobText = 'Assistant(e) de ';
      }
      if (isHusbandWife) {
        jobText = 'Époux/Épouse de ';
      }
    } else {
      jobText = '';
    }
    if (proRefParent !== null) {
      jobText += proRefParent + ' > ';
    }
    if (proRef !== null) {
      jobText += proRef;
    }

    if (jobText === '' || jobText === null) {
      return '-';
    }
    return jobText;
  }


  nameFormatter(object){
    return `${firstNameFormatter(object.firstName)} ${object.lastName.toUpperCase()}`;
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }


}
