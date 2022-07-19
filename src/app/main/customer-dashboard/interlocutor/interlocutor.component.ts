import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';

import { ActivatedRoute, ParamMap } from '@angular/router';

import { CmUsageVO } from './../../../_core/models/cm-usage-vo';
import { InterlocutorVO } from '../../../_core/models/interlocutor-vo';
import { CM_TYPE_DATA, CONSTANTS, LANGUAGES, ROLE_INTERLOCUTOR, CUSTOMER_TYPE_LABEL } from '../../../_core/constants/constants';

import { PersonService, ContactMethodService } from '../../../_core/services';
import { of } from 'rxjs';

@Component({
  selector: 'app-interlocutor',
  templateUrl: './interlocutor.component.html',
  styleUrls: ['./interlocutor.component.scss']
})
export class InterlocutorComponent implements OnInit {

  ngbNavOutlet: boolean;

  isActive = true;
  showpopup: boolean;
  showusage = true;
  showinterlocuteur = false;


  usageClick() {
    this.showusage=true;
    this.showinterlocuteur=false;
    this.isActive= !this.isActive;
  }
  
  interClick() {
    this.showusage=false;
    this.showinterlocuteur=true;
    this.isActive= !this.isActive;
  }


  
  interlocutorList: InterlocutorVO[];
  usageList: CmUsageVO[];

  customerId;
  typeCustomer: string;

  cmTypeData = CM_TYPE_DATA;
  constants = CONSTANTS;
  

  showValideCm = true;

  innerHtmlEmail: string;
  innerHtmlMobile: string;
  inCompleteCall = true;
  constructor(private readonly route: ActivatedRoute,
              private readonly personService: PersonService,
              private readonly contactMethodService: ContactMethodService) {
              }

  

  ngOnInit(): void {
    this.route.paramMap.subscribe( (params: ParamMap) => {
      this.customerId = params.get('customerId');
      this.getInterlocutors();
      this.getUsagesByCustomerId();
    });
    this.route.queryParamMap.subscribe(params => {
      this.typeCustomer = params.get('typeCustomer');
    });
  }
  getInterlocutors() {
    this.inCompleteCall = true;
    this.personService.getPersonAndInterlocutorsByCustomerId(this.customerId)
                      .pipe(catchError(()=> of(null)))
                      .subscribe(
                        (interlocutors) => {
                          this.interlocutorList = interlocutors;
                        },
                        (error)=>{
                          this.inCompleteCall = false;
                        },
                        () => {
                          this.inCompleteCall = false;
                        }
                      );
  }
  
  getUsagesByCustomerId(): void {
    this.usageList = [];
    if (this.customerId) {
      this.inCompleteCall = true;
      this.contactMethodService.getUsagesByCustomerId(this.customerId)
      .subscribe(data => {
        this.usageList = data;
        if (CONSTANTS.TYPE_PARTICULAR === this.typeCustomer) {
          this.usageList.forEach(usage => {
            usage.interlocutor.roles.forEach(role => {
              if (role.key === ROLE_INTERLOCUTOR.ROLE_BENEFICIARE.key) {
                role.label = CUSTOMER_TYPE_LABEL.PARTICULAR;
              }
            });
          });
        }
        this.inCompleteCall = false;
      },
      (error) => {
        this.inCompleteCall = false;
        return of(null);
        });
    }
  }
 
  setFlag(favoriteLang: string): string {
    if (favoriteLang === LANGUAGES.ENG) {
      return 'icon en-flag';
    }
    return 'icon fr-flag';
  }

  validateContact(id: any) {
    this.personService.validerCm(id).subscribe(
      (data)=>{
        this.updateUsage(id);
      }
    );
  }
  updateUsage(id) {
    this.usageList.forEach(
      (usage)=>{
        if(usage.cmInterlocuteur && usage.cmInterlocuteur.id === id){
          usage.cmInterlocuteur.isExpired = false;
          usage.cmInterlocuteur.iconAlert = '';
        }
      }
    )
  }

  validateUsageAndInterlocutor(id , type) {
    this.validateInerlocutorContact(id , type); 
    this.updateUsage(id);
  }

  onValidateMobileContactEvent(id){
    this.validateUsageAndInterlocutor(id , 'phone-mobile');
  }

  onValidateEmailContactEvent(id){
    this.validateUsageAndInterlocutor(id , 'mail');
  }
  
  onValidateAddressContactEvent(id){
    this.validateUsageAndInterlocutor(id , '');
  }

  onValidatePhoneHomeContactEvent(id){
    this.validateUsageAndInterlocutor(id , 'phone-home');
  }

  onValidInterlocutorMobileContactEvent(id){
    this.validateUsageAndInterlocutor(id , 'phone-mobile');
  }

  onValidInterlocutorPhoneHomeContact(id){
    this.validateUsageAndInterlocutor(id , 'phone-home');
  }

  onValidInterlocutorEmailContact(id){
    this.validateUsageAndInterlocutor(id , 'mail');
  }

  onValidInterlocutorAddressContact(id){
    this.validateUsageAndInterlocutor(id , '');
  }

  validateInerlocutorContact(id , type){
    this.personService.validerCm(id).subscribe(
      (data)=>{
        this.updateUsage(id);
        this.interlocutorList.forEach(
          (interlocutor)=>{
            if(interlocutor){
              interlocutor.contactMethodsVO.forEach(
                (contactMethodVO)=> {
                  if(contactMethodVO && contactMethodVO.id === id){
                    contactMethodVO.isExpired = false;
                    contactMethodVO.iconAlert = `icon ${type} icon-check`;
                    setTimeout(
                      () => { 
                        contactMethodVO.iconAlert = `icon ${type}`;
                      }
                      , 2000);
                  }
              });
            }
        });
    });
  }
}
