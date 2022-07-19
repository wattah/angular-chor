import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerVO } from '../../../../_core/models/customer-vo';
import { PersonVO } from '../../../../_core/models/person-vo';
import { HomologationVO } from '../../../../_core/models/homologation';
import { AcquisitionCanalLight } from '../../../../_core/models/acquisition-canal-light';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { ReferenceDataTypeService, UserService } from '../../../../_core/services';
import { UserVo } from '../../../../_core/models/user-vo';
import { CONSTANTS } from '../../../../_core/constants/constants';
import { firstNameFormatter } from '../../../../_core/utils/formatter-utils';

@Component({
  selector: 'app-sale-approval-consultation',
  templateUrl: './sale-approval-consultation.component.html',
  styleUrls: ['./sale-approval-consultation.component.scss']
})
export class SaleApprovalConsultationComponent implements OnInit {

  @Input() person: PersonVO;

  @Input() customer: CustomerVO;

  @Input() homologation: HomologationVO;

  userCooptatorId: number;
  

  @Output() updateSaleApproval = new EventEmitter<boolean>(null);

  typeAgence: string;
  typeAgenceEntrprise: string;
  vendeurAgence: string;
  prenomApporteur: string;
  typeApporteur: string;
  userCooptant: string;
  respAgence: string;
  nameVendeur: string;
  typePrecision: string;
  decision: string;
  typeParrain: string;

  typeAgenceSec: string;
  typeAgenceEntrpriseSec: string;
  vendeurAgenceSec: string;
  prenomApporteurSec: string;
  typeApporteurSec: string;
  userCooptantSec: string;
  respAgenceSec: string;
  nameVendeurSec: string;
  typePrecisionSec: string;
  decisionSec: string;
  typeParrainSec: string;

  canalAgence = false;
  canalAgenceEntreprise = false;
  canalApparteur = false;
  canalCooptation = false;
  canalEvent = false;
  canalParainage = false;


  canalAgenceSec = false;
  canalAgenceEntrepriseSec = false;
  canalApparteurSec = false;
  canalCooptationSec = false;
  canalEventSec = false;
  canalParainageSec = false;

  constructor(readonly  referenceDataTypeService: ReferenceDataTypeService, 
    readonly userService: UserService) { }

  ngOnInit() {
    this.initNameVendeur();
    this.initDecision();
    if(!isNullOrUndefined(this.customer.acquisitionCanals) && this.customer.acquisitionCanals.length > 0) {
      if(!isNullOrUndefined(this.getChoisedAcquisitionsCanals(0).canalKey)) {
       this.initDefaultAffichage(this.getChoisedAcquisitionsCanals(0).canalKey);
       this.initFirstCanal();
      }
      
      if(!isNullOrUndefined(this.getChoisedAcquisitionsCanals(1).canalKey)) {
         this.initDefaultAffichageCanalSec(this.getChoisedAcquisitionsCanals(1).canalKey);
         this.initSecondeCanal();
      }
    }
    
  }

  initDecision(): void {
    if(isNullOrUndefined(this.customer.selectionCommitteeDecision)) {
      this.decision = '-';
    } else if(this.customer.selectionCommitteeDecision === true) {
      this.decision = 'Validé';
    } else {
      this.decision = 'Refusé'; 
    }
  }

  initFirstCanal(): void {
    if(this.canalAgence) {
      this.getTypeAgence(0);
      this.getResAgence(0);
      this.getVendeurAgence(0);
    }

    if(this.canalAgenceEntreprise) {
       this.getTypeAgenceEntr(0);
    }

    if(this.canalApparteur) {
       this.getTypeAporteur(0);
     }
   
   if(this.canalEvent) { 
     this.getTypePrecision(0);
    }

    if(this.canalCooptation) {
      this.getUserCooptant(0);
    }

    if(this.canalParainage) {
      this.getTypePerrain(0);
    }
  } 

  initSecondeCanal(): void {
    if(this.canalAgenceSec) {
      this.getTypeAgence(1);
      this.getResAgence(1);
      this.getVendeurAgence(1);
    }

    if(this.canalAgenceEntrepriseSec) {
       this.getTypeAgenceEntr(1);
    }

    if(this.canalApparteurSec) {
       this.getTypeAporteur(1);
     }
   
   if(this.canalEventSec) { 
     this.getTypePrecision(1);
    }

    if(this.canalCooptationSec) {
      this.getUserCooptant(1);
    }

    if(this.canalParainageSec) {
      this.getTypePerrain(1);
    }
  } 

  initCanal(): void {
    this.canalAgence = false;
    this.canalAgenceEntreprise = false;
    this.canalApparteur = false;
    this.canalCooptation = false;
    this.canalEvent = false;
    this.canalParainage = false;
  }

  initDefaultAffichage(key: string) {
  if(!isNullOrUndefined(key)){
    switch (key) {
      case 'ref_contact_canal_10':
        this.canalAgence = true;
        break;
      case 'ref_contact_canal_store_company_04112011':
        this.canalAgenceEntreprise = true;
        break;
      case 'ref_contact_canal_40':
        this.canalApparteur = true;
        break;
      case 'ref_contact_canal_coop_coach_04112011':
        this.canalCooptation = true; 
        break;
        case 'ref_contact_canal_coop_vente_04112011':
          this.canalCooptation = true;
          break;
      case 'ref_contact_canal_96':
        this.canalEvent = true;
        break;
      case 'ref_contact_canal_120':
        this.canalParainage = true;
        break;
      default:
        break;
    }
   }
  }

  initDefaultAffichageCanalSec(key: string) {
    if(!isNullOrUndefined(key)){
      switch (key) {
        case 'ref_contact_canal_10':
          this.canalAgenceSec = true;
          break;
        case 'ref_contact_canal_store_company_04112011':
          this.canalAgenceEntrepriseSec = true;
          break;
        case 'ref_contact_canal_40':
          this.canalApparteurSec = true;
          break;
        case 'ref_contact_canal_coop_coach_04112011':
          this.canalCooptationSec = true; 
          break;
          case 'ref_contact_canal_coop_vente_04112011':
            this.canalCooptationSec = true;
            break;
        case 'ref_contact_canal_96':
          this.canalEventSec = true;
          break;
        case 'ref_contact_canal_120':
          this.canalParainageSec = true;
          break;
        default:
          break;
      }
     }
    }

  initNameVendeur(): void {
    if(!isNullOrUndefined(this.customer.referents) && this.customer.referents.length !== 0) {
      for (const ven of this.customer.referents) {
        this.checkeNameVente(ven);
      }
    }
  }

  checkeNameVente(ven): void {
    if(ven.roleId === CONSTANTS.ROLE_VENTE) {
      if (!ven.firstName && !ven.lastName) {
        this.nameVendeur = '';
      } else { 
        this.nameVendeur = `${ven.lastName ?  firstNameFormatter(ven.lastName) : '-'}  ` + 
              `${ven.firstName ? firstNameFormatter(ven.firstName) : '-'}  `;
      }
    }
  }

   

  getVendeurAgence(idCanal): void {
    let user: UserVo = {} as UserVo;
    this.userService.getUserVoById(this.getChoisedAcquisitionsCanals(idCanal).userId).subscribe( data => {
     user = data;
     if(idCanal === 0) {
      this.vendeurAgence = `${(user.lastName) ? user.lastName.toUpperCase() : ''} ${   firstNameFormatter(user.firstName)}`;
     }
     if(idCanal === 1)  {
      this.vendeurAgenceSec = `${(user.lastName) ? user.lastName.toUpperCase() : ''} ${   firstNameFormatter(user.firstName)}`;
     }
    });
  }

  getResAgence(idCanal): void {
    let user: UserVo = {} as UserVo;
    this.userService.getUserVoById(this.getChoisedAcquisitionsCanals(idCanal).otherUserId).subscribe( data => {
     user = data;
     if(idCanal === 0) {
      this.respAgence = `${(user.lastName) ? user.lastName.toUpperCase() : ''} ${   firstNameFormatter(user.firstName)}`;
     }
     if(idCanal === 1) {
      this.respAgenceSec = `${(user.lastName) ? user.lastName.toUpperCase() : ''} ${   firstNameFormatter(user.firstName)}`;
     }
     
    });
  }

  getUserCooptant(idCanal): void {
    this.userService.getUserVoById(this.getChoisedAcquisitionsCanals(idCanal).userId).subscribe( data => {
     if(idCanal === 0) {
      this.userCooptant = `${(data.lastName) ? data.lastName.toUpperCase() : ''} ${   firstNameFormatter(data.firstName)}`;
     }
     if(idCanal === 1) {
      this.userCooptantSec = `${(data.lastName) ? data.lastName.toUpperCase() : ''} ${   firstNameFormatter(data.firstName)}`;
     }
    });
  }

  getTypeAgence(idCanal) {
    this.getReferenceDataByKey(this.getChoisedAcquisitionsCanals(idCanal).typeKey)
        .subscribe(
        (data)=>{
          if(idCanal === 0) {
            this.typeAgence = data.label;
          }
          if(idCanal === 1) {
            this.typeAgenceSec = data.label;
          }
          
      }
    );
  }

  getTypeAporteur(idCanal) {
    this.getReferenceDataByKey(this.getChoisedAcquisitionsCanals(idCanal).typeKey)
        .subscribe(
        (data)=>{
          if(idCanal === 0) {
            this.typeApporteur = data.label;
          }
          if(idCanal === 1) {
            this.typeApporteurSec = data.label;
          }

      }
    );
  }

  getTypeAgenceEntr(idCanal) {
    this.getReferenceDataByKey(this.getChoisedAcquisitionsCanals(idCanal).typeKey)
        .subscribe(
        (data)=>{
          if(idCanal === 0) {
            this.typeAgenceEntrprise = data.label;
          }
          if(idCanal === 1) {
            this.typeAgenceEntrpriseSec = data.label;
          }
          
      }
    );
  }

  getTypePerrain(idCanal) {
    this.getReferenceDataByKey(this.getChoisedAcquisitionsCanals(idCanal).typeKey)
        .subscribe(
        (data)=>{
          if(idCanal === 0) {
            this.typeParrain = data.label;
          }
          if(idCanal === 1) {
            this.typeParrainSec = data.label;
          }
         
      }
    );
  }

  getTypePrecision(idCanal) {
    this.getReferenceDataByKey(this.getChoisedAcquisitionsCanals(idCanal).typeKey)
        .subscribe(
        (data)=>{
          if(idCanal === 0) {
            this.typePrecision = data.label;
          }
          if(idCanal === 1) {
            this.typePrecisionSec = data.label;
          }
      }
    );
  }

  getReferenceDataByKey(type) {
    return this.referenceDataTypeService.getRefDataByKey(type);
   }


  onUpdateSaleApproval(): void {
    this.updateSaleApproval.emit(false);
  }


 getChoisedAcquisitionsCanals(number: number):AcquisitionCanalLight{
    if(!isNullOrUndefined(this.customer.acquisitionCanals) && 
    this.customer.acquisitionCanals.length > number && 
    !isNullOrUndefined(this.customer.acquisitionCanals[number]) &&
    typeof this.customer.acquisitionCanals[number] === 'object' ){
       return this.customer.acquisitionCanals[number];
    }
    return null;
  }

  getNotHomologationReason(): string {
    let str = '';
    if(!isNullOrUndefined(this.customer) && !isNullOrUndefined(this.customer.notHomologatedReasons) && this.customer.notHomologatedReasons.length !== 0) {
      for (const ref of this.customer.notHomologatedReasons) {
        if(!isNullOrUndefined(ref.parent)) {
          str += ` ${ref.parent.label} > ${ref.label} `;
        } else {
          str += ` ${ref.label} `;
        }
        
        if (this.customer.notHomologatedReasons.length -1 !== this.customer.notHomologatedReasons.indexOf(ref)) {
           str +='/';
        }
      }
    } else {
      str = '-';
    }
    return str;
  }
}
