import { CommonService } from './../../cart/cart/common.service';
import { ReferenceDataVO } from './../../../_core/models/reference-data-vo';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { RequestAnswersVO } from '../../../_core/models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskVo } from '../../../_core/models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GassiMockLoginService, ReferenceDataService } from 'src/app/_core/services';
import { CRI_PERMISSIONS } from 'src/app/_core/constants/constants';
import { UserVo } from '../../../_core/models/user-vo';
import { InterventionReportService } from '../../../_core/services/intervention-report.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InterventionReportVO } from '../../../_core/models/cri/intervention-report-vo';
import { getDecryptedValue } from '../../../_core/utils/functions-utils';
import { FormStoreManagementService } from '../../cart/cart/tab-article/from-store-management.service';
import { DocumentService } from '../../../_core/services/documents-service';
import { DatePipe } from '@angular/common';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { NotificationService } from '../../../_core/services/notification.service';
import { ApplicationUserVO } from 'src/app/_core/models/application-user';
import { WorkflowService } from 'src/app/_core/services/workflow.service';
import { first } from 'rxjs/operators';
import { CUSTOMER_DASHBOARD } from '../../../_core/constants/bill-constant';
import { DestinataireVO } from '../../../_core/models/destinataireVO';

@Component({
  selector: 'app-cri-creation',
  templateUrl: './cri-creation.component.html',
  styleUrls: ['./cri-creation.component.scss']
})
export class CriCreationComponent implements OnInit, OnDestroy {
 
  formParentCRI: FormGroup;
  request: RequestCustomerVO;
  requestAnswers: RequestAnswersVO[];
  customerId: string;
  task: TaskVo;
  isFromCriAndCriChange = false;
  isCancel = false;
  idRequest: number;
  interventionReport : InterventionReportVO;
  interventionReportBackup : InterventionReportVO;
  emplacementPtos: any;
  emplacementOnts: ReferenceDataVO[];
  emplacementLiveBoxs: ReferenceDataVO[];
  ingenieries: ReferenceDataVO[];
  locationTypes: ReferenceDataVO[];
  soundTypes: ReferenceDataVO[];
  soundConnectionTypes: ReferenceDataVO[];
  locationWifiTypes: ReferenceDataVO[];
  wifiConnectionTypes: ReferenceDataVO[];
  domains: ReferenceDataVO[];
  interventionType: string;
  impactParkItemLines: any;
  modaliteRef : ReferenceDataVO[];
  techniciens : UserVo[] = [];
  othersUsers : UserVo[] = [];
  // partie des champs de validation
  startDateInvalide = false;
  endDateInvalide = false;
  dateDebutPseInvalid = false;
  dateFinPseInvalid = false;
  demandeurInvalid = false;
  contactFNameInvalid = false;
  cantactLNameInvalid = false;
  precisionDemandeurInvalid = false;
  adresseInvalid = false;
  parcTelInvalid = false;
  typeLogInvalid = false;
  precisionTypeLogInvalid = false;
  superfecieInvalid = false;
  typeAlarmeInvalid = false;
  typeInterventionInvalid = false;
  coachInvalid = false;
  doaminIntervInvalid = false;
  garantieInvalid = false;
  decriptionTraveauInvalid = false;
  formInvalid = false;
  inValidFiledsNumber = 0;
  hideTechnicalInforBadge = false;
  hideRequierdInfoBadge = false
  previsTabIndex = 0;
  currentTabIndex = 0;
  tabchangedOrSave = false;
  decodeurModelTypes: ReferenceDataVO[];
  connectionTypes: ReferenceDataVO[];
  idRequestsList: number[];
  saveClick = false;
  //FIBRE OPTIQUE VALIDATION FIELD
  aidInvalid = false;
  ndFictifInvalid = false;
  ndVoipInvalid = false;
  emplacementPtoInvalid = false;
  emplacementOntInvalid = false;
  emplacementLiveboxInvalid = false;
  numeroPtoInvalid = false;
  slidInvalid = false;
  ndSupportInvalid = false;
  //VALIDATION FIELD Land Line
  ndInvalid = false;
  dtiLocationInvalid = false;
  suplementInfoInvalid = false;
  //VALIDATION FIELD Mobile
   marqueInvalid = false;
   capaciteInvalid = false;
   couleurInvalid = false;
   origineInvalid = false;
   //Partagé
   emplacementInvalid = false;
   modeleInvalid = false;
   numImeiInvalid = false;
   identConnexionInvalid = false;
   mdpConnexionInvalid = false;
  //VALIDATION FIELD Decodeur
  refDecoderModelTypeInvalid = false;

  refConnectionTypeInvalid = false;
   //VALIDATION FIELD femtocell
  otherNumbersTitulaireInvalid = false;
  emplacementFemtocellInvalid = false;
   //Validation FIELD NAS
   ddnsInvalid = false;
   quickconnectInvalid = false;
   nbDiskInvalid = false;
   capaciteDiskInvalid = false;
   //USER NAS
   nomInvalid = false;
   loginInvalid = false;
   passwordInvalid = false;
   emailInvalid = false;
   typeUserInvalid = false;
   //Global sound
    //VALIDATION FIELD
  isTplinkInvalid = false;
  //sonos
  refSonosTypeInvalid = false;
  refSonosConnectionTypeInvalid = false
  multimediaInfoInvalid = false;
  //wifi
  ssidLiveboxInvalid = false;
  // technicien comment 
  technicianCommentInvalid = false;
  //ACCESS POINT
  modelBorneInvalid = false;
  ipAdresseInvalid = false;
  isFiberOptiqueValid = true ;
  isADSLValid = true ;
  isMobileValid = true ;
  isNasValid = true ;
  isUserNasValid = true;
  isSonosValid = true ;
  isSonosTypeValid = true;
  isWifiValid = true ;
  isAccessPointValid = true;
  isModelBorneValid = true;
  isLocationValid = true;
  isDecodeurValid = true ;
  isFemtoCellValid = true ;
  isLandLineValid = true ;
  isMultiMediaValid = true ;
  refModaliteInvalid = true;
  allowedToModifyTechnicalInformationTab;
  connectedUser : ApplicationUserVO = {} as ApplicationUserVO;
  workflowAllowedToCRI;
  allowedToCRI;
  subscirption;
  numberDoc = 0;
  destinataires: DestinataireVO[];
//==================================constructor=====================================
  constructor(private readonly route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly refrenceDataService: ReferenceDataService,
    private readonly interventionReportService : InterventionReportService,
    private readonly _snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly documentService: DocumentService,
    private readonly datePipe: DatePipe,
    private readonly notificationService: NotificationService,
    private readonly formStoreManagementService: FormStoreManagementService,
    private readonly mockLoginService: GassiMockLoginService,
    private readonly workflowService: WorkflowService,
    private readonly commonService: CommonService) { 

    this.formParentCRI = this.createFormGroup();
   this.subscirption = this.notificationService.isSaveCri$.pipe(first()).subscribe((data) => {
      if(data ){
        this.onSaveCri();
      }
    });
    
    this.notificationService.getIsFromCriAndCriChange().subscribe((data) => {
      if(data){
         this.isFromCriAndCriChange = true;
      }
    });
  }
  ngOnDestroy(): void {
    this.subscirption.unsubscribe();
  }

  ngOnInit() {
      this.route.data.subscribe(resolversData => {
      this.request = resolversData['detailRequest'];
      this.task = resolversData['currentTask'];
      this.requestAnswers = resolversData['requestAnswers'];
      this.interventionReport = resolversData['interventionReport'];
      this.interventionReportBackup = JSON.parse(JSON.stringify(this.interventionReport));
      this.impactParkItemLines = resolversData['impactParkItemLines'];
      this.modaliteRef = resolversData['modaliteReferenceData'];
      this.techniciens = resolversData['techniciens'];
      this.othersUsers = resolversData['othersUsers'];
      this.destinataires = resolversData['destinataires'];
     });
    this.route.parent.paramMap.subscribe(params => {
      this.customerId =params.get('customerId');
      if(this.interventionReport){
        this.interventionReport.customerId = getDecryptedValue(this.customerId);
      }
    });
    this.route.parent.queryParams.subscribe((params) => {
      this.idRequestsList = params['requestList'];
    });
    this.getEmplacementPTO();
    this.getEmplacementONT();
    this.getEmplacementLiveBox();
    this.getIngenierie();
    this.getLocationType();
    this.getSoundType();
    this.getSoundConnctionType();
    this.getLocationWifiType();
    this.getWifiConnectionType();
    this.getDecodeurModelTypes();
    this.getConnectionTypes();
    this.onChanges();
    this.checkPermissionToCRI();
  }

  checkPermissionToCRI(){
    this.mockLoginService.getCurrentConnectedUser().subscribe((user) => {
      if (user) {
        this.connectedUser = user;
        this.allowedToCRI = user.activeRole.permissions.includes(CRI_PERMISSIONS.ACCESS_TO_CRI);
        this.allowedToModifyTechnicalInformationTab = user.activeRole.permissions.includes(CRI_PERMISSIONS.MODIFY_CRI);
        this.checkWorkflowPermissionToCRIForCoachs();
        if(!this.allowedToCRI && !this.allowedToModifyTechnicalInformationTab){
          this.router.navigate(['/']);
        } 
      }
    });
  }


  checkWorkflowPermissionToCRIForCoachs(){
    if(this.connectedUser.activeRole.roleName === 'RESP COACH' || this.connectedUser.activeRole.roleName === 'COACH'){
      this.workflowService.checkIfWorkflowOfRequestAllowedToCRI(this.request.requestTypeId).subscribe(returnedData => {
        this.workflowAllowedToCRI = returnedData;
        if(!this.workflowAllowedToCRI){
          this.router.navigate(['/']);
        } 
      });
    }else{
      this.workflowAllowedToCRI = true;
    }
  }

  
  //=======================================================================
  onChanges(): void {
      this.formParentCRI.valueChanges.subscribe(val => {
        if(this.formParentCRI.dirty){
        this.isFromCriAndCriChange = true;
        this.notificationService.setIsFromCriAndCriChange(true);
        }
        });
    }
    
//=========================================================================
  getEmplacementPTO() {
    this.getReferenceDataByType('EMPLACEMENT_PTO_FIBRE_OPTIQUE')
        .subscribe((data)=>{
          this.emplacementPtos = data;
          console.log('emplacementPtos ' , this.emplacementPtos)
        });
  }
  getEmplacementONT() {
    this.getReferenceDataByType('EMPLACEMENT_ONT_FIBRE_OPTIQUE')
        .subscribe((data)=>{
          this.emplacementOnts = data;
        });
  }

  getEmplacementLiveBox() {
    this.getReferenceDataByType('EMPLACEMENT_LIVEBOX_FIBRE_OPTIQUE')
        .subscribe((data)=>{
          this.emplacementLiveBoxs = data;
        });
  }
  getIngenierie() {
    this.getReferenceDataByType('INGENIERIE_FIBRE_OPTIQUE')
        .subscribe((data)=>{
          this.ingenieries = data;
        });
  }

  getLocationType() {
    this.getReferenceDataByType('LOCATION_TYPE')
        .subscribe((data)=>{
          this.locationTypes = data;
        });
  }

  getSoundType() {
    this.getReferenceDataByType('SONOS_TYPE')
        .subscribe((data)=>{
          this.soundTypes = data;
        });
  }

  getSoundConnctionType() {
    this.getReferenceDataByType('SONOS_CONNECTION_TYPE')
        .subscribe((data)=>{
          this.soundConnectionTypes = data;
        });
  }
  getLocationWifiType() {
    this.getReferenceDataByType('WIFI_LOCATION_TYPE')
        .subscribe((data)=>{
          this.locationWifiTypes = data;
        });
  }
  
  getWifiConnectionType() {
    this.getReferenceDataByType('WIFI_CONNECTION_TYPE')
        .subscribe((data)=>{
          this.wifiConnectionTypes = data;
        });
  }

  getDecodeurModelTypes() {
    this.getReferenceDataByType('DECODER_MODEL_TYPE').subscribe(
      (data)=>{
        this.decodeurModelTypes = data;
      }
    );
  }

  getConnectionTypes() {
    this.getReferenceDataByType('CONNECTION_TYPE').subscribe(
      (data)=>{
        this.connectionTypes = data;
      }
    );
  }

  createFormGroup(): FormGroup {
    return this._formBuilder.group({});
}
getReferenceDataByType(type){
  return this.refrenceDataService.getListRefDataAndChildrenByTypeData(type);
 }

 onChangeDomainsEvent(domains){
  this.domains = domains;
 }

 onChangeInterventionTypeEvent(type){
  this.interventionType = type;
 }

//=============================================================================== 
 onSaveCri(){
  this.initValidators();
  if(!this.validate()){
 this.isFromCriAndCriChange = false;
  this.notificationService.setIsFromCriAndCriChange(false);
  this.saveCri().then(()=>{
    this.callabackSuccess(this.interventionReport.id);
    });
  }
}
//=============================================================================== 
saveCri(){
  return new Promise(resolve => {
    this.interventionReportService.saveInterventionReport(this.interventionReport).subscribe(
      (data) => {
        this.interventionReport.id = data.id;
        this.uploadDocsAfterSaveCri();
       resolve()  
      },
      (error) => {
        console.error('interventionReport save failed: ', error);
       
        },
    );
  });
 
}
//=======================upload Documents Cri=======================================
uploadDocsAfterSaveCri(){
  if(!isNullOrUndefined(this.formParentCRI.get('criForm'))
   && !isNullOrUndefined(this.formParentCRI.get('criForm').get('criDocuments'))
   && !isNullOrUndefined(this.formParentCRI.get('criForm').get('criDocuments').value) ){
    this.formParentCRI.get('criForm').get('criDocuments').value.forEach(criDoc => {
      this.uploadDocCri(criDoc);
    });
    if(this.formParentCRI.get('criForm').get('criDocuments').value.length === 0){
      this.backAfterSaveCRI();
    }
  
   }
  }

  getLengthNewDocs():number{
    let lengthNewDocs = 0;
    this.formParentCRI.get('criForm').get('criDocuments').value.forEach(criDoc => {
      if(isNullOrUndefined(criDoc.id)){
        ++lengthNewDocs
      }
    });
    return lengthNewDocs;
  }
//=======================upload Document Cri=======================================
uploadDocCri(criDoc){
  if(isNullOrUndefined(criDoc.id)){
    const dateCreation: string = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
    const documentTitleId = criDoc.documentTitleId
    const fileUploadVO    = criDoc.file;
    const typeDocument    = fileUploadVO.documentType;
    const titreDocument   = fileUploadVO.documentTitle;
    const documentTypeId  = fileUploadVO.documentTypeId;
    const file            = fileUploadVO.file;
    this.documentService.saveCriDocument(documentTitleId, typeDocument, titreDocument, documentTypeId,
      file ,dateCreation,  this.request.idRequest.toString(), this.interventionReport.id.toString()).
      subscribe(doc => {
        if (doc !== null) {
         ++this.numberDoc;
         if(this.numberDoc ===  this.getLengthNewDocs()){
           this.backAfterSaveCRI();
         }
        } 
      });
  }
  
}

//=============================================================================== 
callabackSuccess(interventionReportId){
  this.interventionReportService.generateFicheRecap(interventionReportId,this.interventionReport.taskId).subscribe(
    (data) => {
      if(data){
        const filePdf = this.commonService.blobToArrayBuffer(data.document);
        this.commonService.saveResponseFileAsPdf(data.name, filePdf);
        this.openSnackBar('Le CRI a bien été mis à jour');
       
      }
  
  }
  )
}
//=============================================================================== 
  blobToArrayBuffer(base64: any): any {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
//=============================================================================== 
  saveResponseFileAsPdf(reportName: any, byte: any): any {
    const blob = new Blob([byte], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    const fileName = reportName;
    window.open(link.href);
    link.download = fileName;
    link.click();
  }
  //=============================================================================== 
 /** SNACK BAR */
 openSnackBar(text: string): void {
  this._snackBar.open(
    text, undefined, 
    { duration: 3000, panelClass: ['center-snackbar', 'snack-bar-container'] });
}
  
//==============================================================================
selectInterventionReport(event){
  if(event){
    this.interventionReport = event;
  }
}
//=============================visible Domains================================
isVisibleBlock(domain): any {
  return this.domains.map(domain=> domain.label).includes(domain);
}
//==============================Validation Cri================================== 
validateFirstBlocks(){
  if(this.isVisibleBlock('Fibre Optique') && (this.interventionType.indexOf('Production') !== -1)){
    this.validateFibreOptique(this.formParentCRI.controls.technicalInformationForm.get('opticalFiberForms').value,true)
  }
  if(this.isVisibleBlock('ADSL/VDSL') && (this.interventionType.indexOf('Production') !== -1)){
    this.validateAdslVdsl(this.formParentCRI.controls.technicalInformationForm.get('adslVdslForms').value, true);
  }
  if(this.isVisibleBlock('Ligne Fixe') && (this.interventionType.indexOf('Production') !== -1)){
    this.validateLandLine(this.formParentCRI.controls.technicalInformationForm.get('landLineForms').value,true)
  }
  if(this.isVisibleBlock('Mobile') && (this.interventionType.indexOf('Production') !== -1)){
    this.validateMobile(this.formParentCRI.controls.technicalInformationForm.get('mobileForm').value,true)
  }
  if(this.isVisibleBlock('Décodeur') && (this.interventionType.indexOf('Production') !== -1)){
    this.validateDecoder(this.formParentCRI.controls.technicalInformationForm.get('decodeurForms').value,true)
  }
}
//************************************************************************************** */
validateSecondBlocks(){

  if(this.isVisibleBlock('FEMTOCELL') && (this.interventionType.indexOf('Production') !== -1)){
    this.validateFemTocell(this.formParentCRI.controls.technicalInformationForm.get('femetocellForms').value,true)
  }
  if(this.isVisibleBlock('NAS') && (this.interventionType.indexOf('Production') !== -1)){
    this.validateNas(this.formParentCRI.controls.technicalInformationForm.get('nasForms').value,true)
    this.validateUserNas(this.formParentCRI.controls.technicalInformationForm.get('usersNas').value,true)
  }
  if(this.isVisibleBlock('Sonos') && (this.interventionType.indexOf('Production') !== -1)){
    this.validateGlobalSound(this.formParentCRI.controls.technicalInformationForm.get('globalSoundForms').value,true)
    this.validateSound(this.formParentCRI.controls.technicalInformationForm.get('soundForms').value,true)
  }
  if(this.isVisibleBlock('Matériel Multimédia') && (this.interventionType.indexOf('Production') !== -1)){
    this.validateMultiMedia(this.formParentCRI.controls.technicalInformationForm.get('multimediaInfoForm').value,true)
  }
  if(this.isVisibleBlock('Wi-Fi')&& (this.interventionType.indexOf('Production') !== -1)){
   if(this.formParentCRI.controls.technicalInformationForm.get('wifiForms').value[0].get('isLivebox').value){
    this.validateWifi(this.formParentCRI.controls.technicalInformationForm.get('wifiForms').value,true)
    }
    this.validateAccessPtModelBorne(this.formParentCRI.controls.technicalInformationForm.get('accessPointsForms').value,true)
    this.validateAccessPt(this.formParentCRI.controls.technicalInformationForm.get('accessPointsForms').value,true)
    this.validateLocation(this.formParentCRI.controls.technicalInformationForm.get('locationForms').value,true)
  }
}
validate():boolean{
this.checkRequiredInformValidite();
this.checkTechnicalInforValidite();
this.validateIntervFirstDay(this.formParentCRI.controls.interventionFirstDay);
if(this.formParentCRI.controls.interventionSecondDay &&
  this.formParentCRI.controls.interventionSurDeuxJrs.value){
  this.validateSecondDayDates(this.formParentCRI.controls.interventionSecondDay);
}
this.validatePse(this.formParentCRI.controls.pseForm);
this.validateRquiredInformation(this.formParentCRI.controls.form);
this.validateTechnicianInformation(this.formParentCRI.controls.technicianInformation);
this.validateFirstBlocks();
this.validateSecondBlocks();
this.tabchangedOrSave = !this.tabchangedOrSave;
this.formInvalid = this.isFormInvalid();

return  this.formInvalid;
}

//==============================validateIntervFirstDay==========================
validateIntervFirstDay(form){ 
  const invalid = [];
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        switch (name) {
          case 'startTimeControl':
            this.startDateInvalide = true;
          break;
          case 'endTimeControl':
          this.endDateInvalide = true;
          break;
          default:
          console.log('valide');
           break;}}
      }
      this.inValidFiledsNumber = invalid.length;

}
//==============================interv 2 eme jour ======================================
validateSecondDayDates(form){ 
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'startTimeDay2Control':
            this.startDateInvalide = true;
          break;
          case 'endTimeDay2Control':
            this.endDateInvalide = true;
          break;
          default:
          console.log('valide Dates');
           break;}}
      }  
}
//==============================Validate PSE ======================================
validatePse(form){ 
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'pseStartControl':
            this.dateDebutPseInvalid = true;
          break;
          case 'pseEndControl':
            this.dateFinPseInvalid = true;
          break;
          default:
          console.log('valide pse dates');
           break;}}
      }  
}
//======================Tab Changed ========================================
tabChanged(tab) {
  this.tabchangedOrSave = !this.tabchangedOrSave;
  this.previsTabIndex = this.currentTabIndex;
  this.currentTabIndex = tab.index;
  this.checkTechnicalInforValidite();
  this.checkRequiredInformValidite();
}
//=========================== check informations tech validité =========================
checkFirstBlocsValidation(){
  if(this.isVisibleBlock('Fibre Optique') && (this.interventionType.indexOf('Production') !== -1) ){
    this.checkIsFiberOptiqueValid();
  }
  if(this.isVisibleBlock('ADSL/VDSL') && (this.interventionType.indexOf('Production') !== -1)){
    this.checkIsADSLValid();
  }
  if(this.isVisibleBlock('Ligne Fixe') && (this.interventionType.indexOf('Production') !== -1)){
    this.checkIsLandLineValid();
   }
  if(this.isVisibleBlock('Mobile') && (this.interventionType.indexOf('Production') !== -1)){
    this.checkIsMobileValid()
  }
  if(this.isVisibleBlock('Décodeur')&& (this.interventionType.indexOf('Production') !== -1)){
    this.checkIsDecodeurValid()
  }
}
checkBlocsValidation(){
  this.initBlocksValidation();
/*Valide Blocs */
this.checkFirstBlocsValidation();
if(this.isVisibleBlock('FEMTOCELL') && (this.interventionType.indexOf('Production') !== -1)){
  this.checkIsFemtoCellValid();
}
if(this.isVisibleBlock('NAS') && (this.interventionType.indexOf('Production') !== -1)){
  this.checkIsNasValid();
}
if(this.isVisibleBlock('Sonos') && (this.interventionType.indexOf('Production') !== -1)){
  this.checkIsSonosValid();
}
if(this.isVisibleBlock('Matériel Multimédia') && (this.interventionType.indexOf('Production') !== -1)){
  this.checkIsMultiMediaValid();
}
if(this.isVisibleBlock('Wi-Fi') && (this.interventionType.indexOf('Production') !== -1)){
  this.checkIsWifiValid();
}

}
//=========================================================
checkTechnicalInforValidite(){
const statusFirstDayForm = this.formParentCRI.controls.interventionFirstDay.status;
let statusSecondDayForm = 'VALID';
if(this.formParentCRI.controls.interventionSecondDay &&
  this.formParentCRI.controls.interventionSurDeuxJrs.value){
  statusSecondDayForm = this.formParentCRI.controls.interventionSecondDay.status;
}
const statusPseForm = this.formParentCRI.controls.pseForm.status;
this.checkBlocsValidation();
if(statusFirstDayForm === 'INVALID' || statusSecondDayForm === 'INVALID' 
     || statusPseForm === 'INVALID' ||  !this.isFiberOptiqueValid ||
      !this.isADSLValid||  !this.isMobileValid ||  
     !this.isDecodeurValid ||  !this.isFemtoCellValid || !this.isWifiValid ||  
      !this.isSonosValid || !this.isNasValid  || !this.isUserNasValid
      || !this.isLandLineValid  || !this.isSonosTypeValid || !this.isAccessPointValid
      || !this.isMultiMediaValid || !this.isLocationValid || !this.isModelBorneValid){
  this.hideTechnicalInforBadge = true;}
  else{this.hideTechnicalInforBadge = false;}
}

//========================================================================================
checkRequiredInformValidite(){
  const statusRequiredInfoForm = this.formParentCRI.controls.form.status;
    if(statusRequiredInfoForm === 'INVALID'){
    this.hideRequierdInfoBadge = true;}
    else{this.hideRequierdInfoBadge = false;}
  }
//======================================================================================
popupBackAnswer(event){
    if(event){
      this.onSaveCri();
    }
  }
//==============================Cri Changed from childs===========================
criChanged(value){
  if(value){
    this.isFromCriAndCriChange = true;
    this.notificationService.setIsFromCriAndCriChange(true);
    
  }
}
//==============================Retourne après enregistrement=====================
backAfterSaveCRI(){
   if(this.route.snapshot.queryParams['isFromDetailReq'] === 'true') {
      if(isNullOrUndefined(this.idRequestsList)){
        this.forwardToRequestDetailWithIds();
        }  
      else{this.forwardToRequestDetailWithoutIds();}
  // SI ON A ACCEDER AU CRI DEPUIS LES TACHES
    } else if (this.route.snapshot.queryParams['isFromDetailReq'] === 'false') {
      this.forwardToTaskDetail();
      }
 }
//============================TO TASK ==============================================
forwardToTaskDetail(){
  this.router.navigate(
    [CUSTOMER_DASHBOARD, this.customerId,'request', this.request.idRequest, 'task-details',this.task.id],
 {
    queryParamsHandling: 'merge'
  }
);
}
//=============================To Request Detail Without ids============================
forwardToRequestDetailWithoutIds(){
  this.router.navigate(
    [CUSTOMER_DASHBOARD, this.customerId,'detail','request',this.request.idRequest,],
    {
      queryParams: { requestList: this.idRequestsList, isDetailRecovery: false },
      queryParamsHandling: 'merge'
    });
}
//=============================To Request Detail With ids============================
forwardToRequestDetailWithIds(){
  this.router.navigate(
    [CUSTOMER_DASHBOARD, this.customerId,'detail','request',this.request.idRequest,],
    {
      queryParams: { isDetailRecovery: false },
      queryParamsHandling: 'merge'
    });
}
//=============================Cancel CRI =======================================
onCancelCri(){
  this.interventionReport = JSON.parse(JSON.stringify(this.interventionReportBackup));
  this.isFromCriAndCriChange = false;
  this.isCancel = !this.isCancel;
  this.openSnackBar('Les modifications ont été annulées');
}
//==============================Validation onglet infor necess  ================
validateRquiredInformation(form){ 
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'requestercontroller':
            this.demandeurInvalid = true;
          break;
          case 'typeLogmentcontroller':
          this.typeLogInvalid = true;
          break;
          case 'precision':
          this.precisionDemandeurInvalid = true;
          break;
          case 'firstNameController':
          this.contactFNameInvalid = true;
          break;
          case 'lastNameController':
          this.cantactLNameInvalid = true;
          break;
          case 'parcPhoneController':
          this.parcTelInvalid = true;
          break;
          case 'precisionControler':
          this.precisionTypeLogInvalid = true;
          break;
          case 'superficieController':
          this.superfecieInvalid = true;
          break;
          case 'garantieController':
          this.garantieInvalid = true;
          break;
          case 'myDomainsControl':
          this.doaminIntervInvalid = true;
          break;
          case 'coachPresenceControler':
          this.coachInvalid = true;
          break;
          case 'typeController':
          this.typeAlarmeInvalid = this.checkIfAlarmIsChecked();;
          break;
          case 'interventionTypesController':
          this.typeInterventionInvalid = true;
          break;
          case 'myControladd':
          this.adresseInvalid = true;
          break;
          case 'worKDescriptionController':
          this.decriptionTraveauInvalid = true;
          break;
          case 'technicianComment':
            this.technicianCommentInvalid = true;
            break;
          default:
          console.log('valide');
           break;}}
      }    
}

checkIfAlarmIsChecked(){
  return this.formParentCRI.controls.form.get('typeController').invalid;
}

//==============================Validation onglet Technicion Comment  ================
validateTechnicianInformation(form){ 
  if ( form.controls['technicianComment'].invalid) {
    this.technicianCommentInvalid = true;
  }
}
//===========================================
validateFibreOptique(formsFibre,isInSave){ 
  const invalid = [];
  formsFibre.forEach(fibreForm => {
    const controls = fibreForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'aid':
            this.aidInvalid = isInSave ? true : this.aidInvalid;
            invalid.push(name);
          break;
          case 'ndFictif':
            this.ndFictifInvalid = isInSave ? true : this.ndFictifInvalid;
            invalid.push(name);
          break;
          case 'ndVoip':
            this.ndVoipInvalid =  isInSave ? true : this.ndVoipInvalid ;
            invalid.push(name);
          break;
          case 'identConnexion':
            this.identConnexionInvalid =  isInSave ? true : this.identConnexionInvalid;
            invalid.push(name);
          break; 
          case 'mdpConnexion':
          this.mdpConnexionInvalid = isInSave ? true : this.mdpConnexionInvalid;
          invalid.push(name);
          break;
          case 'emplacementPto':
          this.emplacementPtoInvalid =  isInSave ? true :  this.emplacementPtoInvalid;
          invalid.push(name);
          break;
          case 'emplacementOnt':
          this.emplacementOntInvalid =  isInSave ? true : this.emplacementOntInvalid;
          invalid.push(name);
          break;
          case 'emplacementLivebox':
          this.emplacementLiveboxInvalid = isInSave ? true : this.emplacementLiveboxInvalid;
          invalid.push(name);
          break;
          case 'numeroPto':
            this.numeroPtoInvalid = isInSave ? true : this.numeroPtoInvalid;
            invalid.push(name);
          break;
          case 'slid':
            this.slidInvalid = isInSave ? true : this.slidInvalid;
            invalid.push(name);
          break;
          default:
          console.log('valide fibre');
           break;
          }}
      }
  });  

  if(invalid.length === 0){
     this.isFiberOptiqueValid = true;
  }
  else{
    this.isFiberOptiqueValid = false;
  }
}
//==================Validation ADSL/VDSL==================================
validateAdslVdsl(formsAdslVdsl, isInSave){ 
  const invalid = [];
  formsAdslVdsl.forEach(adsl => {
    const controls = adsl.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'aid':
            this.aidInvalid = isInSave ? true : this.aidInvalid ;
            invalid.push(name);
          break;
          case 'identifiantConnexion':
            this.identConnexionInvalid = isInSave ? true : this.identConnexionInvalid ;
            invalid.push(name);
          break;
          case 'ndVoip':
            this.ndSupportInvalid = isInSave ? true : this.ndSupportInvalid ;
            invalid.push(name);
          break; 
          case 'passwordConnexion':
          this.mdpConnexionInvalid = isInSave ? true : this.mdpConnexionInvalid ;
          invalid.push(name);
          break; 
          case 'refLocationType':
          this.emplacementLiveboxInvalid = isInSave ? true : this.emplacementLiveboxInvalid ;
          invalid.push(name);
          break;
          default:
          console.log('valide ADSL VDSL');
           break;}
      }}
    });

    if(invalid.length === 0){
      this.isADSLValid = true;
   }
   else{
     this.isADSLValid = false;
   }
  }
//============================Validation Ligne Fixe===============================
validateLandLine(formsLandLine, isInSave){ 
  const invalid = [];
  formsLandLine.forEach(formLandLine => {
    const controls = formLandLine.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'nd':
            this.ndInvalid = isInSave ? true : this.ndInvalid;
            invalid.push(name);
          break;
          case 'dtiLocation':
            this.dtiLocationInvalid = isInSave ? true :  this.dtiLocationInvalid;
            invalid.push(name);
          break;
          case 'suplementInfo':
            this.suplementInfoInvalid = isInSave ? true : this.suplementInfoInvalid;
            invalid.push(name);
          break;
   
          default:
          console.log('valide Ligne Fixe');
           break;}}
      } 
  }); 
  if(invalid.length === 0){
    this.isLandLineValid = true;
 }
 else{
   this.isLandLineValid = false;
 }
}
//==============================validation Mobile======================================
validateMobile(form, isInSave){ 
  const invalid = [];
  const controls = form[0].controls;
  let isAssurance = false;
  let isRenouvellement = false;
  let isSav = false;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'marque':
            this.marqueInvalid = isInSave ? true : this.marqueInvalid;
            invalid.push(name);
          break;
          case 'couleur':
            this.couleurInvalid = isInSave ? true : this.couleurInvalid;
            invalid.push(name);
          break;
          case 'numImei':
            this.numImeiInvalid = isInSave ? true : this.numImeiInvalid;
            invalid.push(name);
          break;
          case 'capacite':
            this.capaciteInvalid = isInSave ? true : this.capaciteInvalid;
            invalid.push(name);
          break;
          case 'modele':
            this.modeleInvalid = isInSave ? true : this.modeleInvalid ;
            invalid.push(name);
          break;
          case 'isAssurance':
            isAssurance = true;
          break;
          case 'isRenouvellement':
            isRenouvellement = true;
          break;
          case 'isSav':
            isSav = true;
          break;
          default:
          console.log('valide Mobile');
           break;}}
      }  
      if(isAssurance && isSav && isRenouvellement){
        this.origineInvalid  = isInSave ? true : this.origineInvalid;
            invalid.push(name);
      }
  if(invalid.length === 0){
    this.isMobileValid = true;
  }   
  else{
    this.isMobileValid = false;
  } 
}
//==============================validation Decodeur ======================================
validateDecoder(formsDecodeur, isInSave){ 
  const invalid = [];
  formsDecodeur.forEach(formDecodeur => {
    const controls = formDecodeur.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'refConnectionType':
            this.refConnectionTypeInvalid = isInSave ? true : this.refConnectionTypeInvalid;
            invalid.push(name);
          break;
          case 'refDecoderModelType':
            this.refDecoderModelTypeInvalid = isInSave ? true : this.refDecoderModelTypeInvalid;
            invalid.push(name);
          break;
          case 'refLocationType':
            this.emplacementInvalid = isInSave ? true : this.emplacementInvalid;
            invalid.push(name);
          break;
          default:
          console.log('valide decoder');
           break;}}
      }  
  });
  if(invalid.length === 0){
    this.isDecodeurValid = true;}
 else{ this.isDecodeurValid = false;}  
}
//==============================validation Femtocell======================================
validateFemTocell(formsFemtocell,isInSave){ 
  const invalid = [];
  formsFemtocell.forEach(formFemtocell => {
    const controls = formFemtocell.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
       
        switch (name) {
          case 'numImei':
            this.numImeiInvalid = isInSave ? true : this.numImeiInvalid;
            invalid.push(name);
          break;
          case 'otherNumbersTitulaire':
            this.otherNumbersTitulaireInvalid = isInSave ? true : this.otherNumbersTitulaireInvalid;
            invalid.push(name);
          break;
          case 'emplacementFemtocell':
            this.emplacementInvalid = isInSave ? true : this.emplacementInvalid;
            invalid.push(name);
          break;
          default:
          console.log('valide Femtocell');
           break;}}
      } 
  });  
  if(invalid.length === 0){
    this.isFemtoCellValid = true;}
 else{ this.isFemtoCellValid = false;} 
}
//==============================validation NAS ==========================================
validateNas(formsNas,isInSave){ 
  const invalid = [];
    formsNas.forEach(formNas => { 
    const controls = formNas.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
          switch (name) {
            case 'modele':
              this.modeleInvalid = isInSave ? true : this.modeleInvalid;
              invalid.push(name);
            break;
            case 'ddns':
              this.ddnsInvalid = isInSave ? true : this.ddnsInvalid;
              invalid.push(name);
            break;
            case 'quickconnect':
              this.quickconnectInvalid = isInSave ? true : this.quickconnectInvalid;
              invalid.push(name);
            break;
            case 'nbDisk':
              this.nbDiskInvalid = isInSave ? true : this.nbDiskInvalid;
              invalid.push(name);
            break; 
            case 'idSyno':
            this.identConnexionInvalid = isInSave ? true : this.identConnexionInvalid;
            invalid.push(name);
            break; 
            case 'capaciteDisk':
            this.capaciteDiskInvalid = isInSave ? true :  this.capaciteDiskInvalid;
            invalid.push(name);
            break;
            case 'mdpSyno':
            this.mdpConnexionInvalid = isInSave ? true : this.mdpConnexionInvalid;
            invalid.push(name);
            break;
            default:
            console.log('valide Nas');
             break;}}
        }
    });
    if(invalid.length === 0){
      this.isNasValid = true;}
   else{ this.isNasValid = false;}  
  }
//==============================validation User Nas ======================================
validateUserNas(formsUserNas,isInSave){ 
  const invalid = []
  formsUserNas.forEach(formUserNas => {
  const controls = formUserNas.controls; 
  let isUser = false;
  let isAdmin = false;
    for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
              case 'nom':
                this.nomInvalid = isInSave ? true : this.nomInvalid;
                invalid.push(name);
              break;
              case 'login':
                this.loginInvalid = isInSave ? true : this.loginInvalid;
                invalid.push(name);
              break;
              case 'password':
                this.passwordInvalid = isInSave ? true : this.passwordInvalid;
                invalid.push(name);
              break;
              case 'email':
                this.emailInvalid = isInSave ? true : this.emailInvalid;
                invalid.push(name);
              break;
              case 'isUser':
                isUser = true;
              break;
              case 'isAdmin':
                isAdmin = true;
              default: 
              console.log('valide user nas');
               break;}}
          } 
          if(isUser && isAdmin){
            this.typeUserInvalid = isInSave ? true : this.typeUserInvalid;
            invalid.push("typeUser");
          }
  });
  if(invalid.length === 0){
    this.isUserNasValid = true;}
 else{ this.isUserNasValid = false;} }   
//==============================validation Global Sound======================================
validateGlobalSound(formsSound,isInSave){ 
  const invalid = [];
  formsSound.forEach(formSound => {
  const controls = formSound.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'isTplink':
            this.isTplinkInvalid = isInSave ? true : this.isTplinkInvalid;
            invalid.push(name);
          break;
          case 'identifiantSonos':
          this.identConnexionInvalid = isInSave ? true : this.identConnexionInvalid;
          invalid.push(name);
          break; 
          case 'passwordSonos':
          this.mdpConnexionInvalid = isInSave ? true : this.mdpConnexionInvalid;
          invalid.push(name);
          break;
          case 'refTplinkLocationType':
          this.emplacementInvalid = isInSave ? true : this.emplacementInvalid;
          invalid.push(name);
          break;
          default:
          console.log('valide sound');
          break;}}
      } 
  });
  if(invalid.length === 0){
    this.isSonosValid = true;}
 else{ this.isSonosValid = false;} 
}
//==============================validation Sound ======================================
validateSound(formsSound,isInSave){ 
  const invalid = [];
  formsSound.forEach(formSound => {
    const controls = formSound.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'refSonosType':
            this.refSonosTypeInvalid = isInSave ? true : this.refSonosTypeInvalid;
            invalid.push(name);
          break;
          case 'refSonosConnectionType':
          this.refSonosConnectionTypeInvalid = isInSave ? true : this.refSonosConnectionTypeInvalid;
          invalid.push(name);
          break; 
          default:
          console.log('valide sound');
          break;}}
      }
  });
  if(invalid.length === 0){
    this.isSonosTypeValid = true;}
 else{ this.isSonosTypeValid = false;}  
}
//==============================validation multi ======================================
validateMultiMedia(form, isInSave){ 
  if((isNullOrUndefined(form[0].controls.multimediaInfo.value) 
  || form[0].controls.multimediaInfo.value === '') &&
  (this.interventionType.indexOf('Production') !== -1)){
    this.multimediaInfoInvalid = isInSave ? true : this.multimediaInfoInvalid;
    this.isMultiMediaValid = false;
  }
  else{
    this.isMultiMediaValid = true;
  }
} 
//==============================validation Wifi======================================
validateWifi(wififorms, isInSave){ 
  const invalid = [];
  const controls = wififorms[0].controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'ssidLivebox':
          this.ssidLiveboxInvalid = isInSave ? true : this.ssidLiveboxInvalid;
          invalid.push(name);
          break;
          case 'passwordLivebox':
          this.passwordInvalid = isInSave ? true : this.passwordInvalid;
          invalid.push(name);
          break;
          default:
          console.log('valide wifi');
          break;}}
      }
      if(invalid.length === 0){
        this.isWifiValid = true;}
     else{ this.isWifiValid = false;} 
}

//==============================validation ACC POINT ==============================
validateAccessPtModelBorne(formsAccPt,isInSave){ 
  formsAccPt.forEach(accpoint => {
    const controls = accpoint.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        if(name === 'modelBorne'){
          this.modelBorneInvalid = isInSave ? true : this.modelBorneInvalid;
          this.isModelBorneValid = false;
        
        }
}} 
 });    
}

validateAccessPt(formsAccPt,isInSave){ 
  const invalid = [];
  formsAccPt.forEach(accpoint => {
    if(accpoint.value.isControler){
      const controls = accpoint.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          switch (name) {
            case 'refControlerLocationType':
            this.emplacementInvalid = isInSave ? true : this.emplacementInvalid;
            invalid.push(name);
            break;
            case 'identifiant':
            this.identConnexionInvalid = isInSave ? true : this.identConnexionInvalid;
            invalid.push(name);
            break;
            case 'ipAdresse':
            this.ipAdresseInvalid = isInSave ? true : this.ipAdresseInvalid;
            invalid.push(name);
            break;
            case 'passwordController':
            this.passwordInvalid = isInSave ? true : this.passwordInvalid;
            invalid.push(name);
            break;
            default:
            console.log('valide acc pt');
            break;}}
        }
    }
 }); 
 if(invalid.length === 0){
  this.isAccessPointValid = true;}
else{ this.isAccessPointValid = false;}  
}
//==================================Validation Emplacement WIfi===========================
validateLocation(locationforms, isInSave){ 
  const invalid = [];
  locationforms.forEach(location => {
    const controls = location.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
          switch (name) {
            case 'refWifiLocationType':
              this.emplacementInvalid = isInSave ? true : this.emplacementInvalid;
              invalid.push(name);
            break;
            case 'refWifiConnectionType':
              this.refConnectionTypeInvalid = isInSave ? true : this.refConnectionTypeInvalid;
              invalid.push(name);
            break;
            default:
            console.log('valide Location');
             break;}}
        }
  });
  if(invalid.length === 0){
    this.isLocationValid = true;}
  else{ this.isLocationValid = false;}   
}
//==================================INIT VALIDATOR ACC PT ===============================
initValidatorsAccPt(){
  this.modelBorneInvalid = false;
  this.ipAdresseInvalid = false;
}
//===================================Init Validators =================================
initValidators(){
  this.startDateInvalide = false;
  this.endDateInvalide = false;
  this.dateDebutPseInvalid = false;
  this.dateFinPseInvalid = false;
  this.demandeurInvalid = false;
  this.contactFNameInvalid = false;
  this.cantactLNameInvalid = false;
  this.precisionDemandeurInvalid = false;
  this.adresseInvalid = false;
  this.parcTelInvalid = false;
  this.typeLogInvalid = false;
  this.precisionTypeLogInvalid = false;
  this.superfecieInvalid = false;
  this.typeAlarmeInvalid = false
  this.typeInterventionInvalid = false;
  this.coachInvalid = false;
  this.doaminIntervInvalid = false;
  this.garantieInvalid = false;
  this.formInvalid = false;
  this.emplacementInvalid = false;
  this.decriptionTraveauInvalid = false;
  this.initValidatorsFibreOptique();
  //
  this.ndInvalid = false;
  this.dtiLocationInvalid = false;
  this.suplementInfoInvalid = false;
  this. marqueInvalid = false;
  this. modeleInvalid = false;
  this.capaciteInvalid = false;
  this.couleurInvalid = false;
  this.numImeiInvalid = false;
  // Decodeur
  this.refDecoderModelTypeInvalid = false;
  this.refConnectionTypeInvalid = false;
  //Femtocell
  this.otherNumbersTitulaireInvalid = false;
  this.modeleInvalid = false;
  this.ddnsInvalid = false;
  this.quickconnectInvalid = false;
  this.nbDiskInvalid = false;
  this.capaciteDiskInvalid = false;
  // NAS USER
  this.nomInvalid = false;
  this.loginInvalid = false;
  this.passwordInvalid = false;
  this.emailInvalid = false;
  this.typeUserInvalid = false;
  //Global sound
  this.isTplinkInvalid = false;
  this.refSonosTypeInvalid = false;
  this.refSonosConnectionTypeInvalid = false;
  this.multimediaInfoInvalid = false;

  this.ssidLiveboxInvalid = false;
  this.ndSupportInvalid = false;
  this.initValidatorsAccPt();

  // technicien comment
  this.technicianCommentInvalid = false;
}
//================================================================================
 //FIBRE OPTIQUE VALIDATION FIELD
initValidatorsFibreOptique(){
 this.aidInvalid = false;
 this.ndFictifInvalid = false;
 this.ndVoipInvalid = false;
 this.identConnexionInvalid = false;
 this.mdpConnexionInvalid = false;
 this.emplacementPtoInvalid = false;
 this.emplacementOntInvalid = false;
 this.emplacementLiveboxInvalid = false;
 this.numeroPtoInvalid = false;
 this.slidInvalid = false;
}
//====================================================================================
isFormInvalid():boolean{
  const statusFirstDayForm = this.formParentCRI.controls.interventionFirstDay.status;
  let statusSecondDayForm = 'VALID';
  if(this.formParentCRI.controls.interventionSecondDay
    && this.formParentCRI.controls.interventionSurDeuxJrs.value){
    statusSecondDayForm = this.formParentCRI.controls.interventionSecondDay.status;
  }
  const statusPseForm = this.formParentCRI.controls.pseForm.status;
  if(statusFirstDayForm === 'INVALID' || statusSecondDayForm === 'INVALID' || statusPseForm === 'INVALID' ||
  this.isRequiredInformValide() || this.isFibreOptiqueValide() || this.isAdslValide() ||
     this.isNasValide() || this.isGlobalSoundValide() || this.isWifiValide() ||
     this.isFemtocellValide() || this.isDecodeurValide() || this.isLandLineValide()
     || this.isMobileValide() || this.multimediaInfoInvalid || this.technicianCommentInvalid){
       return true;
     }
  
    return false;
  }
// =================================================================================
isFibreOptiqueValide():boolean{
   if (this.aidInvalid || this.ndFictifInvalid || this.ndVoipInvalid ||
       this.identConnexionInvalid || this.mdpConnexionInvalid || this.emplacementPtoInvalid 
       || this.emplacementOntInvalid ||this.emplacementLiveboxInvalid || 
       this.numeroPtoInvalid || this.slidInvalid ){
          return true
        }
  return false;
}
// =================================================================================
isDecodeurValide():boolean{
  if(this.refDecoderModelTypeInvalid ||this.emplacementInvalid 
    || this.refConnectionTypeInvalid){
      return true
    }
 
  return false;
}
// =================================================================================
isNasValide():boolean{
  if(this.modeleInvalid || this.ddnsInvalid || this.quickconnectInvalid ||
     this.nbDiskInvalid || this.identConnexionInvalid || this.capaciteDiskInvalid ||
     this.mdpConnexionInvalid ||   this.nomInvalid || this.loginInvalid ||
     this.passwordInvalid || this.emailInvalid ){
     return true;}
  return false;
}
// =================================================================================
isFemtocellValide():boolean{
  if(  this.numImeiInvalid || this.otherNumbersTitulaireInvalid || 
    this.emplacementFemtocellInvalid){
      return true;
    }
  return false;
}
// =================================================================================
isAdslValide():boolean{
   if(this.aidInvalid || this.identConnexionInvalid || this.emplacementInvalid  
      || this.ndVoipInvalid || this.mdpConnexionInvalid){
         return true;}
  return false;
}
// =================================================================================
isGlobalSoundValide():boolean{
  if (this.isTplinkInvalid || this.identConnexionInvalid ||
      this.mdpConnexionInvalid || this.emplacementInvalid ||
      this.refSonosTypeInvalid || this.refSonosConnectionTypeInvalid ){
        return true;
      }

  return false;
}
// =================================================================================
isWifiValide():boolean{
  if(this.ssidLiveboxInvalid || this.mdpConnexionInvalid || this.modelBorneInvalid
      || this.emplacementInvalid || this.identConnexionInvalid ||
      this.ipAdresseInvalid || this.mdpConnexionInvalid || this.refConnectionTypeInvalid){
          return true;
        }

  return false;
}
// =================================================================================
isLandLineValide():boolean{
   if ( this.ndInvalid || this.dtiLocationInvalid || this.suplementInfoInvalid){
     return true;}
  return false;
}
// =================================================================================
isMobileValide():boolean{
  if(this.marqueInvalid ||this.modeleInvalid || this.capaciteInvalid 
      || this.couleurInvalid || this.numImeiInvalid){
        return true;
      }
  return false;
}
// =================================================================================
isRequiredInformValide(){
  //partie inforation necessaire
  return (this.demandeurInvalid || this.contactFNameInvalid ||
    this.cantactLNameInvalid || this.precisionDemandeurInvalid || this.adresseInvalid ||
    this.parcTelInvalid || this.typeLogInvalid || this.precisionTypeLogInvalid ||
    this.superfecieInvalid || this.typeAlarmeInvalid || this.typeInterventionInvalid || this.coachInvalid ||
    this.doaminIntervInvalid || this.garantieInvalid || this.decriptionTraveauInvalid);
}
//========================================================
checkIsFiberOptiqueValid(){
 this.validateFibreOptique(this.formParentCRI.controls.technicalInformationForm.get('opticalFiberForms').value,false)
}
//======================================================================================
checkIsADSLValid(){
  this.validateAdslVdsl(this.formParentCRI.controls.technicalInformationForm.get('adslVdslForms').value, false);
}
//======================================================================================
checkIsMobileValid(){
  this.validateMobile(this.formParentCRI.controls.technicalInformationForm.get('mobileForm').value,false)
}
//======================================================================================
checkIsDecodeurValid(){
  this.validateDecoder(this.formParentCRI.controls.technicalInformationForm.get('decodeurForms').value,false)
}
//======================================================================================
checkIsFemtoCellValid(){
  this.validateFemTocell(this.formParentCRI.controls.technicalInformationForm.get('femetocellForms').value,false)
}
//======================================================================================
checkIsLandLineValid(){
  this.validateLandLine(this.formParentCRI.controls.technicalInformationForm.get('landLineForms').value,false)
}
//======================================================================================
checkIsSonosValid(){
  this.validateGlobalSound(this.formParentCRI.controls.technicalInformationForm.get('globalSoundForms').value, false)
  this.validateSound(this.formParentCRI.controls.technicalInformationForm.get('soundForms').value, false)
}
//======================================================================================
checkIsNasValid(){
 this.validateNas(this.formParentCRI.controls.technicalInformationForm.get('nasForms').value,false)
 this.validateUserNas(this.formParentCRI.controls.technicalInformationForm.get('usersNas').value, false)
}
//======================================================================================
checkIsMultiMediaValid(){
 this.validateMultiMedia(this.formParentCRI.controls.technicalInformationForm.get('multimediaInfoForm').value,false);
}
//======================================================================================
checkIsWifiValid(){
  if(this.formParentCRI.controls.technicalInformationForm.get('wifiForms').value[0].get('isLivebox').value){
  this.validateWifi(this.formParentCRI.controls.technicalInformationForm.get('wifiForms').value, false)
  }
  this.validateAccessPtModelBorne(this.formParentCRI.controls.technicalInformationForm.get('accessPointsForms').value, false)
  this.validateAccessPt(this.formParentCRI.controls.technicalInformationForm.get('accessPointsForms').value,false)
  this.validateLocation(this.formParentCRI.controls.technicalInformationForm.get('locationForms').value, false)
}
//========================================================================================
initBlocksValidation(){
  this.isFiberOptiqueValid = true ;
  this.isADSLValid = true ;
  this.isMobileValid = true ;
  this.isNasValid = true ;
  this.isUserNasValid = true;
  this.isSonosValid = true ;
  this.isSonosTypeValid = true;
  this.isWifiValid = true ;
  this.isAccessPointValid = true;
  this.isModelBorneValid = true;
  this.isLocationValid = true;
  this.isDecodeurValid = true ;
  this.isFemtoCellValid = true ;
  this.isLandLineValid = true ;
  this.isMultiMediaValid = true ;
}

}