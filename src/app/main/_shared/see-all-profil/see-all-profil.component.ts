import { AbsenceLight } from './../../../_core/models/absence-light';
import { UserService } from './../../../_core/services/user-service';
import { delay } from 'rxjs/operators';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { COLOR_TYPE_CUSTOMER, CONSTANTS, TASK_STATUS_WITH_ALL_SUB_CATEGORIESSS } from '../../../_core/constants/constants';
import { CustomerProfileVO } from '../../../_core/models/customer-profile-vo';
import { PersonNoteVo } from '../../../_core/models/person-note';
import { BeneficiaireView } from '../../../_core/models/profil-infos-dashboard';
import { CustomerService, PersonService } from '../../../_core/services';
import { countYearsByDate } from '../../../_core/utils/date-utils';
import { formatterStatut, fullNameFormatter } from '../../../_core/utils/formatter-utils';
import { getDefaultStringEmptyValue, isNullOrUndefined } from '../../../_core/utils/string-utils';
import { getCustomerIdFromURL } from '../../customer-dashboard/customer-dashboard-utils';
import { CustomerDashboardService } from '../../customer-dashboard/customer-dashboard.service';
import { CustomerTotalsDebt } from '../../../_core/models/customer-totals-debt';
import { DebtRecouverementService } from '../../../_core/services/debt-recouverement.service';
import { Observable } from 'rxjs';
import { CustomersLight } from 'src/app/_core/models/customers_light';



@Component({
  selector: 'app-see-all-profil',
  templateUrl: './see-all-profil.component.html',
  styleUrls: ['./see-all-profil.component.scss']
})
export class SeeAllProfilComponent implements OnChanges, OnInit {
  @Input()
  infoCustomer: BeneficiaireView;

  @Input()
  goodToKnow: PersonNoteVo;

  @Input()
  isEntreprise: boolean;

  @Input()
  typeCustomer: string;

  @Input()
  customerId: number;

  custId: string;

  @Input()
  recoveryDate: Date;
  
  @Input()
  referents = [];

  @Input() entrepriseRecoveryDate: Date;

  coachName: string;
  deskName: string;
  displayTotal = true;

  skypeUrl: string;
  nationality: any;
  customerFull: CustomerProfileVO;
  detteTotalTTC: number;
  detteTotal: number;
  @Input() totalDebt: CustomerTotalsDebt[];
  nichesWithRemainingGreatThanZero: string[];
  nicheId: string;
  errorRecovery = false;
  backUpCoach$: Observable<AbsenceLight>; 
  severalCustomerTit: CustomersLight[];
  backUpDesk$: Observable<AbsenceLight>;
  /**
	 * Constructeur
	 * @param  customerDashboardService
	 */
  constructor(private readonly customerDashboardService: CustomerDashboardService, 
    private readonly sanitizer: DomSanitizer,
    private readonly customerService : CustomerService,
    private readonly route: ActivatedRoute,
    private readonly debtRecouverementService: DebtRecouverementService,
    private readonly personService: PersonService,
    private readonly userService: UserService) {}

  ngOnInit(): void {
    this.custId = getCustomerIdFromURL(this.route);
    this.customerService.getFullCustomer(this.custId).subscribe( data => {
      this.customerFull = data;
      if( this.customerFull.person !== null && this.customerFull.person.refNationality !== null
         &&this.customerFull.person.refNationality.labelComplement !== null ){
      this._filterNationnality(this.customerFull.person.refNationality.labelComplement);
      }
    });
    if(this.infoCustomer){
      sessionStorage.setItem('nicheIdentifier' , this.infoCustomer.nicheIdentifier);
    }
    this.getNicheValue();
    this.personService.getSeveralTitCustomersBy(this.custId).subscribe(data => {
      this.severalCustomerTit = data; 
      this.displayTotal = this.severalCustomerTit != null && this.severalCustomerTit.length > 1;
    });
  }

  private getNicheValue() {
    this.route.queryParams.subscribe(params => {
      this.nicheId = params['nicheValue'];
      if (!this.nicheId) {
        this.nicheId = params['nicheId'];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['infoCustomer'] && !isNullOrUndefined(this.infoCustomer)) {
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
          this.customerDashboardService.businessSecteurRefFormatter(this.infoCustomer.businessSectorRef)
        ),
        professionRef: getDefaultStringEmptyValue(this.infoCustomer.professionRef),
        providerSupplier: this.customerDashboardService.CheckSupplierBusinesProvider(
          this.infoCustomer.businessProvider,
          this.infoCustomer.supplier
        ),
        companyName: this.infoCustomer.companyName,
        status: this.formatterStatut(this.infoCustomer.status),
        membrePhoto: this.customerDashboardService.profilPicture(this.infoCustomer.title, this.infoCustomer.photo, this.isEntreprise)
      };
      this.getRecoveryInformation();
    }
	if (changes['referents'] && !isNullOrUndefined(this.referents)) {
      this.setDeskAndCoachNames();
    }
  }

  private _filterNationnality(valuee: any): any {
     const ib=  TASK_STATUS_WITH_ALL_SUB_CATEGORIESSS.filter(
       nationnlite => nationnlite.data.toLowerCase()===valuee.toString().toLowerCase()) ;
       this.nationality=ib[0].label;
       return this.nationality;
  }

  /**
   *  une méthode qui permet d'ouvrir skype
   */
  openSkype(value: string): SafeUrl {
    this.skypeUrl = 'sip:<' + value + '>';
    return this.sanitizer.bypassSecurityTrustUrl(this.skypeUrl);
  }

  getClassEnvByTypeCustomer(): string {
    return 'env-' + COLOR_TYPE_CUSTOMER[this.typeCustomer];
  }

  getClassBadgeByTypeCustomer(): string {
    return 'badge-' + COLOR_TYPE_CUSTOMER[this.typeCustomer];
  }

  formatterStatut(value: string): string {
    return formatterStatut(value);
  }

  setDeskAndCoachNames(): void {
    this.referents.forEach(element => {
      if (element.roleId === CONSTANTS.ROLE_DESK) {
        this.deskName = getDefaultStringEmptyValue (fullNameFormatter(null,element.firstName, element.lastName));
        this.backUpDesk$ = this.getBackUpOfUser(element.userId);
      }
      if (element.roleId === CONSTANTS.ROLE_COACH) {
        this.coachName = getDefaultStringEmptyValue (fullNameFormatter(null,element.firstName, element.lastName));
        this.backUpCoach$ = this.getBackUpOfUser(element.userId);
      }
    });
  }

  private getRecoveryInformation() {
    if (!isNullOrUndefined(this.totalDebt) && this.totalDebt.length !== 0) {
      this.nicheId = this.infoCustomer.nicheIdentifier.replace(/\s/g, '').trim();
      const debt = this.totalDebt.find(elt => elt.nicheIdentifier === this.nicheId);
      this.detteTotalTTC = debt ? this.debtRecouverementService.calculateRemaining(debt) : 0;
      this.detteTotal = this.debtRecouverementService.calculateTotlaOfRemaining(this.totalDebt);
      this.nichesWithRemainingGreatThanZero = this.debtRecouverementService.getNichesWithRemainingGreatThanZero(this.totalDebt);
      if(!isNullOrUndefined(this.nichesWithRemainingGreatThanZero) && this.nichesWithRemainingGreatThanZero.length > 0){
        this.personService.getEntrepriseRecoveryDate(this.nichesWithRemainingGreatThanZero).subscribe(
          (data) => this.entrepriseRecoveryDate = data
        );
      }
    } else {
      this.errorRecovery = true;
    }
  }

  getBackUpOfUser(idUser: number): Observable<AbsenceLight> {
    return this.userService.getUserBackup(idUser);
  }
}
