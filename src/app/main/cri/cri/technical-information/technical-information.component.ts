import { InterventionBackupNas } from './../../../../_core/models/cri/intervention-bckup-nas';
import { InterventionComptesUsersNas } from './../../../../_core/models/cri/intervention-comptes-users-nas';
import { InterventionAutreStNas } from './../../../../_core/models/cri/intervention-autre-st-nas';
import { InterventionNas } from './../../../../_core/models/cri/intervention_nas';
import { InterventionLandLine } from './../../../../_core/models/cri/intervention-landline';
import { InterventionFemtocell } from './../../../../_core/models/cri/intervention-femtocell';
import { InterventionTv } from './../../../../_core/models/cri/intervention-tv';
import { ReferenceDataVO } from './../../../../_core/models/reference-data-vo';
import { InterventionWifiAccessPointVO } from './../../../../_core/models/cri/intervention-wifi-access-point-vo';
import { InterventionWifiLocationVO } from './../../../../_core/models/cri/intervention-wifi-location-vo';
import { InterventionAdsl } from './../../../../_core/models/cri/intervention-adsl';
import { FormsService } from './forms.service';
import { FibreOptiqueVO } from './../../../../_core/models/cri/fibre-optique-vo';
import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormControl, ControlContainer, FormGroupDirective, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserVo }  from '../../../../_core/models/user-vo';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { InterventionSonosDetail } from '../../../../_core/models/cri/intervention-sonos-detail';
import { InterventionWifi } from '../../../../_core/models/cri/intervention-wifi';
import { InterventionDetailVO } from '../../../../_core/models/cri/intervention-detail-vo';
import { InterventionMobile } from '../../../../_core/models/cri/intervention-mobile';
import { InterventionSonos } from '../../../../_core/models/cri/intervention-sonos'
import { GassiMockLoginService } from '../../../../_core/services/gassi-mock-login.service';


export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-technical-information',
  templateUrl: './technical-information.component.html',
  styleUrls: ['./technical-information.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class TechnicalInformationComponent implements OnInit , OnChanges {

   myControladd = new FormControl();
   @Input() modaliteRef;
   @Input() techniciens;
   listCurrentTechnicien: UserVo[] = [];
   listCurrentOtherUsers: UserVo[] = [];
   listCurrentIntervenant: string[] = [];
   filteredtechnicien: Observable<UserVo[]>;
   filteredOtherUsers: Observable<UserVo[]>;
   @Input() othersUsers;
  // champs domaine intervetion
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true
  separatorKeysCodesTechnicien: number[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() interventionReport;
  @Input() emplacementPtos;
  @Input() emplacementOnts;
  @Input() emplacementLiveBoxs;
  @Input() ingenieries;
  @Input() locationTypes;
  @Input() soundTypes;
  @Input() soundConnectionTypes;
  @Input() locationWifiTypes;
  @Input() wifiConnectionTypes;
  @Input() domains: ReferenceDataVO[];
  @Input() interventionType: string;
  @Input() impactParkItemLines;
  @Input() decodeurModelTypes;
  @Input() connectionTypes;
  @Input() allowedToModifyTechnicalInformationTab;
  idModalite : number;
  @Input() tabchangedOrSave: boolean;
  onCheckSecondDay: boolean;
  @Output() isFromCriAndCriChangeOut = new EventEmitter<boolean>();
  
  /*------------------combo chips techniciens---------------------------*/
 
  @ViewChild('inputTechnicien', { static: false }) inputTechnicien: ElementRef<HTMLInputElement>;
  @ViewChild('chipTechnicienList', { static: false }) chipCreateurList;
  @ViewChild('autoTechnicien', { static: false }) matAutoTechniciencomplete: MatAutocomplete;
  techControl = new FormControl();
  @ViewChild('automcompleteTechnicien' , {static: false}) autocompleteTechnicien;
  @ViewChild('automcompleteOther' , {static: false}) automcompleteOther;
  

    /*------------------combo chips other users---------------------------*/
 
    @ViewChild('inputOther', { static: false }) inputOther: ElementRef<HTMLInputElement>;
    @ViewChild('chipOtherList', { static: false }) chipOtherList;
    @ViewChild('autoOther', { static: false }) matAutoOthercomplete: MatAutocomplete;
    otherControl = new FormControl();


    /*------------------combo chips intervenet---------------------------*/
 
    @ViewChild('inputOther', { static: false }) inputinterv: ElementRef<HTMLInputElement>;
    @ViewChild('chipIntervList', { static: false }) chipIntervList;
    @ViewChild('autoInterv', { static: false }) matAutoIntervcomplete: MatAutocomplete;
    intervControl = new FormControl();
	opticalFiberCounters = [1];
  fibreOptiques: Array<FibreOptiqueVO>;
  interventionsAdsl: Array<InterventionAdsl>;
  interventionDetail : Array<InterventionDetailVO>;
  interventionMobile: any;
  interventionSonos: any;
  interventionWifi: InterventionWifi;
	  interventionTvs: InterventionTv[];
  interventionFemtocells: InterventionFemtocell[];
  interventionLandLines: InterventionLandLine[];
  interventionNas: InterventionNas;
  isVisibleOpticalBlock: boolean;
  isManadatoryFields;
  isVisibleAdslBlock: any;
  isVisibleMobileBlock: any;
  isVisibleSoundBlock: any;
  isVisibleWifiBlock: any;
  isVisibleDecodorBlock: any;
  isVisibleFemtocellBlock: any;
  isVisibleLandLineBlock: any;
  isVisibleMultiMediaBlock: any;
  isVisibleNASBlock: any;
  technicalInformationForm: FormGroup;
  showSecondDayIntervention = false;
  multimediaInfo = '';
  enCreation : boolean;
//========================================Constructeur================================
    constructor( private readonly route: ActivatedRoute,
      private readonly _formBuilder: FormBuilder,
      public parentCriForm: FormGroupDirective ,
      private readonly mockLoginService: GassiMockLoginService,
      private readonly formsService: FormsService) { 
      this.technicalInformationForm  = new   FormGroup({});

    }
//=======================================ng on changes ================================       
       ngOnChanges(change: SimpleChanges){
        if(change['domains'] && this.domains){
          console.log('in ' , this.domains)
          this.isVisibleOpticalBlock = this.isVisibleBlock('Fibre Optique');
          this.isVisibleAdslBlock = this.isVisibleBlock('ADSL/VDSL');
          this.isVisibleMobileBlock = this.isVisibleBlock('Mobile');
          this.isVisibleSoundBlock = this.isVisibleBlock('Sonos');
          this.isVisibleWifiBlock = this.isVisibleBlock('Wi-Fi');
          this.isVisibleDecodorBlock = this.isVisibleBlock('Décodeur');
          this.isVisibleFemtocellBlock = this.isVisibleBlock('FEMTOCELL');
          this.isVisibleLandLineBlock = this.isVisibleBlock('Ligne Fixe');
          this.isVisibleMultiMediaBlock = this.isVisibleBlock('Matériel Multimédia');
          this.isVisibleNASBlock = this.isVisibleBlock('NAS');
        }
        if(change['interventionType'] && this.interventionType){
          this.isManadatoryFields = this.interventionType.indexOf('Production') !== -1;
          if(this.isManadatoryFields){
            this.formsService.setRestrictionOnFormFields(this.technicalInformationForm.get('technicalInformationForm'))
          }
          else{this.formsService.clearRestrictionOnFormFields(this.technicalInformationForm.get('technicalInformationForm'))}
        }
        if(!isNullOrUndefined(change['interventionReport']) && 
        !change['interventionReport'].firstChange && this.interventionReport){
          const modalite = (this.interventionReport.interventionDetail &&  this.interventionReport.interventionDetail[0] &&
          this.interventionReport.interventionDetail[0].modalities[0] )?
           this.interventionReport.interventionDetail[0].modalities[0] : this.modaliteRef[0];
          this.technicalInformationForm.get('refmodalite').setValue(modalite.key);
          this.initBlocSencondDay();
          this.initDataOnUpdate();
          this.initListIntervenant();
        }
        if(this.technicalInformationForm && this.technicalInformationForm.get('technicalInformationForm')){
          this.setRestrictions();
        }
      }
//===================================================================================
initBlocSencondDay(){
  this.showSecondDayIntervention =  this.interventionReport.isOnTwoDays ? this.interventionReport.isOnTwoDays : false;
  this.technicalInformationForm.get('interventionSurDeuxJrs').setValue(this.interventionReport.isOnTwoDays);
}
//==================================On init =========================================
    ngOnInit() {
	      const modalite = this.interventionReport && this.interventionReport.id && this.interventionReport.interventionDetail &&
       this.interventionReport.interventionDetail[0].modalities
      ? this.interventionReport.interventionDetail[0].modalities[0] : this.modaliteRef[0];
      this.technicalInformationForm = this.parentCriForm.form;
      this.technicalInformationForm.addControl('technicalInformationForm', new FormGroup({
		        opticalFiberForms: this._formBuilder.control(this.formsService.opticalFiberForms),
        adslVdslForms  :   this._formBuilder.control(this.formsService.adslVdslForms),
        landLineForms  :   this._formBuilder.control(this.formsService.landLineForms),
        mobileForm     :   this._formBuilder.control(this.formsService.formMobile),
        decodeurForms  :   this._formBuilder.control(this.formsService.decodeurForms),
        femetocellForms :   this._formBuilder.control(this.formsService.femetocellForms),
        nasForms  :   this._formBuilder.control(this.formsService.nasForms),
        usersNas :   this._formBuilder.control(this.formsService.usersNas),
        globalSoundForms : this._formBuilder.control(this.formsService.globalSoundForms),
        soundForms :  this._formBuilder.control(this.formsService.soundForms),
        multimediaInfoForm :  this._formBuilder.control(this.formsService.multimediaInfoForm), 
        wifiForms :  this._formBuilder.control(this.formsService.wifiForms),
        accessPointsForms :  this._formBuilder.control(this.formsService.accessPointsForms),
        locationForms :  this._formBuilder.control(this.formsService.locationForms),  
      }));
      this.technicalInformationForm.addControl('interventionSurDeuxJrs',this._formBuilder.control(null));
     this.technicalInformationForm.addControl('refmodalite', this._formBuilder.control(modalite.key,[Validators.required]));
     this.enCreation = isNullOrUndefined(this.interventionReport.id);
      if(!this.enCreation){
        this.initDataOnUpdate()
      }
      else{
        this.initDataOnCreate();
      }

    const modalities = [];
    modalities.push(modalite)
    this.interventionReport.interventionDetail[0].modalities = modalities;
    this.showSecondDayIntervention = this.enCreation && this.interventionReport.isOnTwoDays ? this.interventionReport.isOnTwoDays : false;
    this.constructAdvancedLists();
    this.initListIntervenant();
    this.initBlocSencondDay();
    this.isFromCriAndCriChangeOut.emit(false);
    this.setRestrictions();
  }
  //===================================================================================
  setIdInterventionObjectUpdate():any{
    const intervention = {} as any;
    intervention.interventionDetailId = this.interventionReport.interventionDetail[0].id ;
    return intervention;
  }

   //===================================================================================
   setIdInterventionObjectCreate():any{
    const intervention = {} as any;
    intervention.interventionDetailId = 0 ;
    return intervention;
  }
  //===================================================================================
  initFibreOptiqueOnUpdate(){
    if(this.interventionReport.interventionDetail[0].fibreOptique){
      this.fibreOptiques =  this.interventionReport.interventionDetail[0].fibreOptique;
      this.interventionDetail[0].fibreOptique = this.fibreOptiques;
    }
    else{
      this.fibreOptiques = [{} as FibreOptiqueVO];
       this.fibreOptiques[0].interventionDetailId = this.interventionReport.interventionDetail[0].id;
    }
    this.interventionDetail[0].fibreOptique = this.fibreOptiques;
  }
  //===================================================================================
  initWifiOnUpdate(){
    if(this.interventionReport.interventionDetail[0].interventionWifi){
      this.interventionWifi = this.interventionReport.interventionDetail[0].interventionWifi;
      if(this.interventionReport.interventionDetail[0].interventionWifi.interventionWifiAccessPoint === null){
        this.interventionWifi.interventionWifiAccessPoint = [{} as InterventionWifiAccessPointVO];
        this.interventionWifi.interventionWifiAccessPoint[0].interventionWifiLocation = [this.setIdInterventionObjectCreate() as InterventionWifiLocationVO];
      }
      else{
        if(isNullOrUndefined(this.interventionReport.interventionDetail[0].interventionWifi.interventionWifiAccessPoint[0].interventionWifiLocation)){
          this.interventionWifi.interventionWifiAccessPoint[0].interventionWifiLocation = [this.setIdInterventionObjectCreate() as InterventionWifiLocationVO];
        }
      }
      console.log('interv wifi ', this.interventionWifi);
     }
     else{
      this.interventionWifi = this.setIdInterventionObjectUpdate();
      this.interventionWifi.interventionWifiAccessPoint = [{} as InterventionWifiAccessPointVO];
      this.interventionWifi.interventionWifiAccessPoint[0].interventionWifiLocation = [this.setIdInterventionObjectCreate() as InterventionWifiLocationVO];
     }
     this.interventionDetail[0].interventionWifi = this.interventionWifi;
  }
  //==================================INIT NAS==================================
  initNasOnUpdate(){
    if(this.interventionReport.interventionDetail[0].interventionNas){
      this.interventionNas = this.interventionReport.interventionDetail[0].interventionNas;
    }
    else{
      this.interventionNas = this.setIdInterventionObjectUpdate();
    }
    this.interventionNas.interventionComptesUsersNas = this.interventionNas.interventionComptesUsersNas ? 
    this.interventionNas.interventionComptesUsersNas:[{} as InterventionComptesUsersNas];
    this.interventionNas.interventionBackupNas = this.interventionNas.interventionBackupNas ? 
    this.interventionNas.interventionBackupNas:[{} as InterventionBackupNas];
    this.interventionDetail[0].interventionNas = this.interventionNas;
    if(isNullOrUndefined(this.interventionNas.interventionAutreStNas)){
      this.interventionNas.interventionAutreStNas = [];
    }
  }
//===================================================================================
  initDataOnUpdate(){
    if(this.isExisteCRI()){
      this.initForUpdatingCRI();
    }else{
      this.initDataOnCreate();
    }
  }

  private isExisteCRI() {
    return this.interventionReport &&
            this.interventionReport.interventionDetail &&
            this.interventionReport.interventionDetail[0];
  }

  private initForUpdatingCRI() {
    this.initInterventionDetail();
    this.initFibreOptiqueOnUpdate();
    this.initWifiOnUpdate();
    this.initInterventionsAdsl();
    this.initInterventionMobile();
    this.initInterventionSonos();
    this.initInterventionTvs();
    this.initInterventionFemtocells();
    this.initInterventionLandLines();
    this.initMultimediaInfo();
    this.initNasOnUpdate();
  }

  private initMultimediaInfo() {
    this.multimediaInfo = this.interventionReport.interventionDetail && this.interventionReport.interventionDetail[0].multimediaInfo ?
      this.interventionReport.interventionDetail[0].multimediaInfo : '';
  }

  private initInterventionLandLines() {
    this.interventionLandLines = this.interventionReport.interventionDetail[0].interventionLandLine ?
      this.addInitObjectToList(this.interventionReport.interventionDetail[0].interventionLandLine) : [this.setIdInterventionObjectUpdate()];
  }

  private initInterventionFemtocells() {
    this.interventionFemtocells = this.interventionReport.interventionDetail[0].interventionFemtocell ?
      this.addInitObjectToList(this.interventionReport.interventionDetail[0].interventionFemtocell)
      : [this.setIdInterventionObjectUpdate()];
  }

  private initInterventionTvs() {
    this.interventionTvs = this.interventionReport.interventionDetail[0].interventionTv ?
      this.addInitObjectToList(this.interventionReport.interventionDetail[0].interventionTv) : [this.setIdInterventionObjectUpdate()];
  }

  private initInterventionSonos() {
    this.interventionSonos = this.interventionReport.interventionDetail[0].interventionSonos ?
      this.interventionReport.interventionDetail[0].interventionSonos : this.setIdInterventionObjectUpdate();
    this.interventionSonos.interventionSonosDetail = this.interventionSonos.interventionSonosDetail ?
      this.interventionSonos.interventionSonosDetail : [this.setIdInterventionObjectUpdate()];
    this.interventionDetail[0].interventionSonos = this.interventionSonos;
  }

  private initInterventionMobile() {
    this.interventionMobile = this.interventionReport.interventionDetail[0].interventionMobile ?
      this.interventionReport.interventionDetail[0].interventionMobile : this.setIdInterventionObjectUpdate();
    this.interventionDetail[0].interventionMobile = this.interventionMobile;
  }

  private initInterventionsAdsl() {
    this.interventionsAdsl = this.interventionReport.interventionDetail[0].interventionAdsl ? this.interventionReport.interventionDetail[0].interventionAdsl
      : [this.setIdInterventionObjectUpdate()];
      this.interventionDetail[0].interventionAdsl = this.interventionsAdsl;
  }

  private initInterventionDetail() {
    this.interventionDetail = this.interventionReport.interventionDetail;
  }

  /**
   * @author fsmail
   * cette fonction était ajouté pour le but d'initier
   * les listes des domaines d'interv et le mapper
   * dans l'objet Intervention Detail à la création d'un CRI 
   */
  initDataOnCreate(){
    this.fibreOptiques = [this.setIdInterventionObjectCreate() as FibreOptiqueVO];
    this.interventionsAdsl = [this.setIdInterventionObjectCreate() as InterventionAdsl];
    this.interventionWifi = this.setIdInterventionObjectCreate() as InterventionWifi;
    this.interventionWifi.interventionWifiAccessPoint = [{} as InterventionWifiAccessPointVO];
    this.interventionWifi.interventionWifiAccessPoint[0].interventionWifiLocation = [this.setIdInterventionObjectCreate() as InterventionWifiLocationVO];
    this.interventionSonos = this.setIdInterventionObjectCreate() as InterventionSonos;
    this.interventionSonos.interventionSonosDetail = [{} as InterventionSonosDetail];
    this.interventionMobile = this.setIdInterventionObjectCreate() as InterventionMobile;
    this.interventionDetail = [{} as InterventionDetailVO] ;
    this.interventionDetail[0] = {} as InterventionDetailVO;
    this.interventionTvs = [this.setIdInterventionObjectCreate() as InterventionTv];
    this.interventionFemtocells = [this.setIdInterventionObjectCreate() as InterventionFemtocell];
    this.interventionLandLines = [this.setIdInterventionObjectCreate() as InterventionLandLine]
    this.multimediaInfo = '';
    this.interventionNas = this.setIdInterventionObjectCreate() as InterventionNas;
    this.interventionNas.interventionAutreStNas = [];
    this.interventionNas.interventionComptesUsersNas = [{} as InterventionComptesUsersNas];
    this.interventionNas.interventionBackupNas = [{} as InterventionBackupNas];
    this.interventionDetail[0].fibreOptique = this.fibreOptiques;
    this.interventionDetail[0].interventionWifi = this.interventionWifi;
    this.interventionDetail[0].interventionMobile = this.interventionMobile;
    this.interventionDetail[0].interventionSonos = this.interventionSonos;
    this.interventionDetail[0].interventionAdsl = this.interventionsAdsl;
    this.interventionReport.interventionDetail =  this.interventionDetail;
    this.interventionReport.interventionDetail[0].modalities = [];
    this.interventionReport.interventionDetail[0].interventionTv = this.interventionTvs;
    this.interventionReport.interventionDetail[0].interventionFemtocell = this.interventionFemtocells;
    this.interventionReport.interventionDetail[0].interventionLandLine = this.interventionLandLines;
    this.interventionReport.interventionDetail[0].multimediaInfo = this.multimediaInfo
    this.interventionReport.interventionDetail[0].interventionAdsl = this.interventionsAdsl;
    this.interventionReport.interventionDetail[0].interventionNas = this.interventionNas;
    this.interventionDetail[0].interventionNas = this.interventionNas;
    this.interventionReport.technicians = [];
    this.interventionReport.interventionHardware = [];
  }

	 setRestrictions() {
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.technicalInformationForm.get('technicalInformationForm').disable();  
    }
    else{
      this.technicalInformationForm.get('technicalInformationForm').enable();
    }
  }

//====================================================================
  constructAdvancedLists(){
    /*------------------Filtre Technicien---------------------------*/
    this.filteredtechnicien = this.techControl.valueChanges
      .pipe(
        startWith(''),
        map(tech => tech ? this._filterTechnicien(tech) : this.techniciens.slice())
      );

       /*------------------Filtre Other Users Hors Technicien---------------------------*/
    this.filteredOtherUsers = this.otherControl.valueChanges
    .pipe(
      startWith(''),
      map(tech => tech ? this._filterOtherUsers(tech) : this.othersUsers.slice())
    );

    }
  /*------------------Actions de combo de technicien ---------------------------*/
  removeTech(i: UserVo): void {
    this.isFromCriAndCriChangeOut.emit(true);
    const index = this.listCurrentTechnicien.indexOf(i);
    if (index >= 0) {
      this.listCurrentTechnicien.splice(index, 1);
    }
    this.interventionReport.technicians = 
    JSON.parse(JSON.stringify(this.listCurrentTechnicien));
  }

   getConnectedUserForSetDefaultUser(){
    if(isNullOrUndefined(this.interventionReport.id)){
      this.mockLoginService.getCurrentConnectedUser().subscribe((user) => {
        if (user) {
          this.setDefaultUserOnCreateCri(user)
        }
      });
    }
   }
  setDefaultUserOnCreateCri(user){
      this.listCurrentTechnicien = [];
    this.listCurrentOtherUsers = [];
// si je suis en création
    // j'affiche le nom de l'utilisateur qui est
    // entrai de remplire CRI
    // Si il est connecté avec le Rôle technicien
    // Je l'ajoute à la liste des techniciens 
    // si non je l'ajoute à l'autre liste
          if(user.activeRole.roleName === 'TECHNICIEN' 
          || user.activeRole.roleName === 'RESP TECHNICIEN'){
            const userVoConst = this.techniciens.find(userVo => userVo.id === user.coachId);
            if(!isNullOrUndefined(userVoConst)){
             this.listCurrentTechnicien.push(userVoConst);
             this.interventionReport.technicians = [];
             this.interventionReport.technicians.push(userVoConst);
            }
          }
          else{
            const userVoConst = this.othersUsers.find(userVo => userVo.id === user.coachId);
            if(!isNullOrUndefined(userVoConst)){
              this.listCurrentOtherUsers.push(userVoConst);
              this.interventionReport.otherParticipent = [];
             this.interventionReport.otherParticipent.push(userVoConst);
            }
            else{
              const userVoISTech = this.techniciens.find(userVo => userVo.id === user.coachId);
              if(!isNullOrUndefined(userVoISTech)){
                this.listCurrentOtherUsers.push(userVoISTech);
                this.interventionReport.otherParticipent = [];
               this.interventionReport.otherParticipent.push(userVoISTech);
              }
            }
          }

  }
  initListIntervenant(){
    this.listCurrentTechnicien = [];
    this.listCurrentIntervenant = [];
    this.listCurrentOtherUsers = [];
    this.getConnectedUserForSetDefaultUser();
    if(isNullOrUndefined(this.interventionReport.technicians)){
      this.interventionReport.technicians = [];
    }
    else{
      this.interventionReport.technicians.forEach(tech => {
        const exist = this.listCurrentTechnicien.
        find( currentTech=> currentTech.id === tech.id);
        if(isNullOrUndefined(exist)){
          this.listCurrentTechnicien.push(Object.assign({}, tech));
        }  
      });
    }
    if(isNullOrUndefined(this.interventionReport.otherParticipent)){
      this.interventionReport.otherParticipent = [];
    }
    else{
      this.interventionReport.otherParticipent.forEach(otherUser => {
        const exist = this.listCurrentOtherUsers.
        find( currentOther=> currentOther.id === otherUser.id);
        if(isNullOrUndefined(exist)){
          this.listCurrentOtherUsers.push(Object.assign({}, otherUser));
        }  
      });
     
        
    }
    if(isNullOrUndefined(this.interventionReport.otherActors)){
      this.interventionReport.otherActors = [];
    }
    else{
        this.listCurrentIntervenant = this.interventionReport.otherActors;
    }
  
  }
//===============================================================================
  selectedTechnicien(event: MatAutocompleteSelectedEvent): void {
    this.isFromCriAndCriChangeOut.emit(true);
    if (!isNullOrUndefined(this.listCurrentTechnicien)) {
      const isExist = this.listCurrentTechnicien.find(option => option.id === event.option.value.id);
      if (isNullOrUndefined(isExist)) {
        this.listCurrentTechnicien.push(event.option.value);
        this.interventionReport.technicians.push(event.option.value);
      }
    }
    this.inputTechnicien.nativeElement.value = ''; 
    this.techControl.setValue(null);
    this.chipCreateurList.errorState = false;

    setTimeout(()=> {
      this.autocompleteTechnicien.openPanel()
    })
    
  }
   /*------------------Actions de combo de other user ---------------------------*/
   removeOtherUser(i: UserVo): void {
    this.isFromCriAndCriChangeOut.emit(true);
    const index = this.listCurrentOtherUsers.indexOf(i);
    if (index >= 0) {
      this.listCurrentOtherUsers.splice(index, 1);
    }
    this.interventionReport.otherParticipent = 
    JSON.parse(JSON.stringify(this.listCurrentOtherUsers));
  }

  selectedOtherUser(event: MatAutocompleteSelectedEvent): void {
    this.isFromCriAndCriChangeOut.emit(true);
    if (!isNullOrUndefined(this.listCurrentOtherUsers)) {
      const isExist = this.listCurrentOtherUsers.find(option => option.id === event.option.value.id);
      if (isNullOrUndefined(isExist)) {
        this.listCurrentOtherUsers.push(event.option.value);
        this.interventionReport.otherParticipent.push(event.option.value);
      }
    }
    this.inputOther.nativeElement.value = ''; 
    this.otherControl.setValue(null);
    this.chipOtherList.errorState = false;
    setTimeout(()=> {
      this.automcompleteOther.openPanel()
    })
  }
//==========================================================================================
  
 private _filterTechnicien(value: UserVo): UserVo[] {
    return this.techniciens.filter(tech => tech.lastName.toLowerCase().indexOf(value.toString().toLowerCase()) === 0);
  }
//==========================================================================================
  
  private _filterOtherUsers(value: UserVo): UserVo[] {
    return this.othersUsers.filter(user => user.lastName.toLowerCase().indexOf(value.toString().toLowerCase()) === 0);
  }
    
  
    addautre(event: MatChipInputEvent): void {
      this.isFromCriAndCriChangeOut.emit(true);
      const input = event.input;
      const value = event.value;
     const isExist = this.listCurrentIntervenant.find(option => option.toUpperCase() === value.toUpperCase() );
 
     if (!isExist && (value || '').trim()) {
        this.listCurrentIntervenant.push(value.trim());
        this.interventionReport.otherActors =  this.listCurrentIntervenant;
      }
      if (input) {
        input.value = '';
      }
    }
  
    removeautre(interv: string): void {
      this.isFromCriAndCriChangeOut.emit(true);
      const index = this.listCurrentIntervenant.indexOf(interv);
  
      if (index >= 0) {
        this.listCurrentIntervenant.splice(index, 1);
      }
      this.interventionReport.otherActors =  this.listCurrentIntervenant;
    }
    OncheckSeconDay(event:any){
      this.onCheckSecondDay = false;
      this.isFromCriAndCriChangeOut.emit(true);
      if(event.checked){
        this.onCheckSecondDay = true;
        this.showSecondDayIntervention = true;
        this.interventionReport.isOnTwoDays = true;
      }
      else{
        this.showSecondDayIntervention = false;
        this.interventionReport.isOnTwoDays = false;
      }
    }
   
/**
 * @author YFA
 * add optical fiber
 */
  addOpticalFiber(event){
    this.isFromCriAndCriChangeOut.emit(true);
    event.preventDefault();
    const opticalFiber = {} as FibreOptiqueVO;
    opticalFiber.interventionDetailId = 0;
    if(!this.enCreation && this.interventionReport.interventionDetail && 
      this.interventionReport.interventionDetail[0]){
      opticalFiber.interventionDetailId  = this.interventionReport.interventionDetail[0].id;
    }
    this.fibreOptiques.push(opticalFiber);
  }
  /**
   * @author YFA
   * @param index of optical fiber
   * catch remove optical fiber event from child
   */
  onRemoveOpticalFiberItemEvent(index){
    this.isFromCriAndCriChangeOut.emit(true);
    this.fibreOptiques.splice(index, 1);
  }
  /**
   * @author YFA
   * @param id of interventionAdsl
   * catch remove of intervention event from child
   */
  onRemoveIntervetionAdslEvent(index){
    this.isFromCriAndCriChangeOut.emit(true);
    this.interventionsAdsl.splice(index, 1);
  }
    
  /**
   * @author YFA
   * to add intervention in intervetionsAdsl array
   */
  addInterventionAdsl(event){
    this.isFromCriAndCriChangeOut.emit(true);
    event.preventDefault();
    const interventionAdsl = {} as InterventionAdsl;
    this.interventionsAdsl.push(interventionAdsl);
  }
  /**
   * @author YFA
   * @param index
   * catch remove of intervention sonos detail event from child
   */
  onRemoveSoundEvent(index){
    this.isFromCriAndCriChangeOut.emit(true);
    this.interventionSonos.interventionSonosDetail.splice(index, 1);
  }
  /**
   * @author YFA
   * @param $event 
   * add sound to soud list
   */
  onAddSoundEvent(event){
    this.isFromCriAndCriChangeOut.emit(true);
    const interventionSonosDetail = {} as InterventionSonosDetail;
    this.interventionSonos.interventionSonosDetail = this.interventionSonos.interventionSonosDetail ?
                                                   this.interventionSonos.interventionSonosDetail:[{}];
    this.interventionSonos.interventionSonosDetail.push(interventionSonosDetail);
  }
  /**
   * @author YFA
   * @param index represent index of accessPoint on the list
   * add location to locations list in interventionWifiAccessPoint
   */
  onAddLocationEvent(index){
    this.isFromCriAndCriChangeOut.emit(true);
    const location = {} as InterventionWifiLocationVO;
    const locationWifi = this.interventionWifi.interventionWifiAccessPoint[index].interventionWifiLocation;
    this.interventionWifi.interventionWifiAccessPoint[index].interventionWifiLocation = locationWifi ? locationWifi:[];
    this.interventionWifi.interventionWifiAccessPoint[index].interventionWifiLocation.push(location);
    this.interventionWifi.interventionWifiAccessPoint[index].interventionWifiLocation = this.interventionWifi.interventionWifiAccessPoint[index].interventionWifiLocation.slice();
 
  }
  /**
   * @author YFA
   * @param ids represent {pointAccessId and locationId}
   * remove location from locations list
   */
  onRemoveLocationEvent(ids){
    this.isFromCriAndCriChangeOut.emit(true);
    this.interventionWifi.interventionWifiAccessPoint[ids.accessPointId].interventionWifiLocation.splice(ids.locationId , 1);
  }
  /**
   * @author YFA
   * @param event
   * add accessPoint to interventionWifiAccessPointVO
   */
  onAddPointAccessEvent(event){
    this.isFromCriAndCriChangeOut.emit(true);
    const pointAccess = {} as InterventionWifiAccessPointVO;
    pointAccess.interventionWifiLocation =  [{} as InterventionWifiLocationVO];
    this.interventionWifi.interventionWifiAccessPoint = this.interventionWifi.interventionWifiAccessPoint ? this.interventionWifi.interventionWifiAccessPoint:[];
    this.interventionWifi.interventionWifiAccessPoint.push(pointAccess);
  }
  /**
   * @author
   * @param index
   *  remove accessPoint from interventionWifiAccessPointVO
   */
  onRemoveAccessPointEvent(index){
    this.isFromCriAndCriChangeOut.emit(true);
    this.interventionWifi.interventionWifiAccessPoint.splice(index, 1);
  }
  /**
   * @author YFA
   * @param domain
   * get active demains in information necessaire tab 
   */
  isVisibleBlock(domain): any {
    return this.domains.map(domain=> domain.label).includes(domain);
  }

  /**
   * @author YFA
   * @param inde of element on interventionTvs list 
   */
  onRemoveDecoderEvent(index){
    this.isFromCriAndCriChangeOut.emit(true);
    this.interventionTvs.splice(index, 1);
  }

  /**
   * @author YFA
   * @param event  
   */
  addDecodor(event){
    this.isFromCriAndCriChangeOut.emit(true);
    event.preventDefault();
    const interventionTv = {} as InterventionTv;
    interventionTv.interventionDetailId = 0;
    if(!this.enCreation && this.interventionReport.interventionDetail && 
      this.interventionReport.interventionDetail[0]){
        interventionTv.interventionDetailId  = this.interventionReport.interventionDetail[0].id;
    }
    this.interventionTvs.push(interventionTv);
  }

  /**
   * @author YFA
   * @param index of item to remove form interventionFemtocells list 
   */
  onRemoveFemtocellEvent(index){
    this.isFromCriAndCriChangeOut.emit(true);
    this.interventionFemtocells.splice(index, 1);
  }

  /**
   * @author YFA
   * @param event  
   */
  addFemtocell(event){
    this.isFromCriAndCriChangeOut.emit(true);
    event.preventDefault();
    const interventionFemtocell = {} as InterventionFemtocell;
    this.interventionFemtocells.push(interventionFemtocell);
  }
  /**
   * @author YFA
   * @param interventions 
   */
  addInitObjectToList(interventions: any[]) {
    const intervention = {} as any;
    intervention.interventionDetailId = this.interventionReport.interventionDetail[0].id ;
    if(interventions && interventions.length === 0){
      interventions.push(intervention);
    }
    return interventions;
  }

  /**
   * @author YFA
   * @param index 
   */
  onRemoveLandLineEvent(index){
    this.isFromCriAndCriChangeOut.emit(true);
    this.interventionLandLines.splice(index, 1);
  }

  /**
   * @author YFA
   * @param event 
   */
  addLandLine(event){
    this.isFromCriAndCriChangeOut.emit(true);
    event.preventDefault();
    const interventionLandLine = {} as InterventionLandLine;
    this.interventionLandLines.push(interventionLandLine);
  }

  /**
   * @author YFA
   * @param event
   */
  onAddAutreStationEvent(event){
    this.isFromCriAndCriChangeOut.emit(true);
    const intervention = {} as InterventionAutreStNas;
    const interventionAutreStNas = this.interventionNas.interventionAutreStNas;
    this.interventionNas.interventionAutreStNas = interventionAutreStNas ? interventionAutreStNas:[];
    this.interventionNas.interventionAutreStNas.push(intervention);
  }

  /**
   * @author YFA
   * @param index 
   */
  onRemoveOtherStationEvent(index){
    this.interventionNas.interventionAutreStNas.splice(index, 1);
  }

  /**
   * @author YFA
   * @param index 
   */
  onRemoveUserEvent(index){
    this.interventionNas.interventionComptesUsersNas.splice(index, 1);
  }

  /**
   * @author YFA
   * @param event 
   */
  onAddUserEvent(event){
    const user = {} as InterventionComptesUsersNas
    this.interventionNas.interventionComptesUsersNas.push(user);
  }

  /**
   * @author YFA
   * @param index
   */
  onRemoveBackupEvent(index){
    this.interventionNas.interventionBackupNas.splice(index, 1);
  }

  /**
   * @author YFA
   * @param event 
   */
  onAddBackupEvent(event){
    const backup = {} as InterventionBackupNas; 
    this.interventionNas.interventionBackupNas.push(backup);
  }

  onChangeModalite(event){
    const selectElementKey = event.target['options'][event.target['options'].selectedIndex].value;
    this.isFromCriAndCriChangeOut.emit(true);
    const modalite = this.modaliteRef.find((x) => x.key ===  selectElementKey);
    if(!isNullOrUndefined(this.interventionReport) 
    && !isNullOrUndefined(this.interventionReport.interventionDetail) &&  
    !isNullOrUndefined(this.interventionReport.interventionDetail[0])){ 
      this.interventionReport.interventionDetail[0].modalities = [];
      this.interventionReport.interventionDetail[0].modalities[0] = modalite;
    }
  
   
  }
}
