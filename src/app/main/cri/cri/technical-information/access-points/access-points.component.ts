import { FormsService } from './../forms.service';
import { isNullOrUndefined, generateRandomString } from './../../../../../_core/utils/string-utils';
import { InterventionWifiLocationVO } from './../../../../../_core/models/cri/intervention-wifi-location-vo';
import { InterventionWifiAccessPointVO } from './../../../../../_core/models/cri/intervention-wifi-access-point-vo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-access-points',
  templateUrl: './access-points.component.html',
  styleUrls: ['./access-points.component.scss']
})
export class AccessPointsComponent implements OnInit, OnChanges {
  @Input() interventionWifiAccessPoint: InterventionWifiAccessPointVO;
  @Input() index;
  @Input() locationWifiTypes;
  @Input() wifiConnectionTypes;
  @Input() isManadatoryFields;
  @Input() interventionWifiAccessPointsLength;
	  @Input() locationTypes;
  @Input() allowedToModifyTechnicalInformationTab;
  @Output() onAddLocation = new EventEmitter<number>();
  @Output() onRemoveAccessPoint = new EventEmitter<number>();
  @Output() onRemoveLocation = new EventEmitter<{accessPointId: number , locationId:number}>();
  form: FormGroup;
  interventionWifiLocations: InterventionWifiLocationVO[];
  isControlerInputRandomName: string;
  isNotControlerInputRandomName: string;
  showControler: boolean;
  isVisiblePrecision: boolean;

  modelBorneInvalid = false;
  refControlerLocationTypeInvalid = false;
  identifiantInvalid = false;
  ipAdresseInvalid = false;
  passwordControllerInvalid = false;
  isRequired = false;
  @Input() tabchangedOrSave;
  @Input() isVisibleWifiBlock;



//====================================================================================
  constructor(private readonly formBuilder: FormBuilder,
              private readonly notificationService: NotificationService,
              private readonly formsService: FormsService) { }

//================================================================================
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['interventionWifiAccessPoint'] && this.interventionWifiAccessPoint){
      this.form = this.buildForm();
      this.formsService.accessPointsForms.push(this.form);
      this.validateAccessPtModelBorne(this.form);
    }
    if(changes['isManadatoryFields'] && this.isManadatoryFields){
      if(this.form){
        this.initValidators();
        this.isRequired = true;
        this.formsService.setRestrictionOnFormFields(this.form);
      }
    }
    if(changes['isManadatoryFields'] && !this.isManadatoryFields){
      if(this.form){
        this.initValidators();
        this.isRequired = false;
        this.formsService.clearRestrictionOnFormFields(this.form);
      }
    
    }
    if(changes['tabchangedOrSave']){
      if(this.isVisibleWifiBlock && this.form){
        this.initValidators();
        this.validateAccessPt(this.form);
      } 
    }
    this.setRestrictions();
  }
  
  ngOnInit() {
    this.isControlerInputRandomName = generateRandomString(5);
    this.isNotControlerInputRandomName = generateRandomString(5);
    this.interventionWifiLocations = this.interventionWifiAccessPoint.interventionWifiLocation;
    this.showControler = this.interventionWifiAccessPoint.isControler;
    if(this.showControler){
      this.addControls();
      this.setLocationType();
      this.initPrecision();
      this.setValidation();
    }
    this.setControler();
    this.observeIsControler();
    this.observeAccessPoint();
    this.setRestrictions();
  }

  setRestrictions(){
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.form.disable();
    }else{
      this.form.enable();
    }
  }
  
  buildForm(): FormGroup {
    return this.formBuilder.group({
      modelBorne: this.formBuilder.control(this.interventionWifiAccessPoint.modelBorne),
      ssid: this.formBuilder.control(this.interventionWifiAccessPoint.ssid),
      password: this.formBuilder.control(this.interventionWifiAccessPoint.password),
      isControler: this.formBuilder.control(this.interventionWifiAccessPoint.isControler),
    });
  }
  addLocation(event){
    event.preventDefault();
    this.onAddLocation.emit(this.index -1);
    this.interventionWifiLocations = this.interventionWifiAccessPoint.interventionWifiLocation;
  }
  onRemoveLocationEvent(index){
    const ids = {accessPointId: this.index-1 , locationId:index}
    this.onRemoveLocation.emit(ids);
  }
  setControler() {
    if(isNullOrUndefined(this.interventionWifiAccessPoint.isControler)){
      this.form.get('isControler').setValue(false);
    }
  }
  removeAccessPoint(){
    this.onRemoveAccessPoint.emit(this.index-1);
  }

  observeIsControler() {
    this.form.get('isControler').valueChanges.subscribe(
      (isControler)=> {
        this.interventionWifiAccessPoint.isControler = isControler
        this.showControler = isControler;
        if(isControler && !this.form.get('refControlerLocationType')){
          this.addControls();
          this.setLocationType();
          this.observeLocationType();
          this.initPrecision();
          this.setValidation();
        }
      }
    );
  }

  observeAccessPoint(){
    this.form.valueChanges.subscribe(
      (value)=> {
        if(this.form.dirty){
          this.notificationService.setIsFromCriAndCriChange(true);
        }
      
      }
    );
  }

  addControls() {
    if(this.isManadatoryFields && this.isVisibleWifiBlock){
      this.form.addControl('refControlerLocationType' , this.formBuilder.control(this.interventionWifiAccessPoint.refControlerLocationType,[Validators.required]));
      this.form.addControl('identifiant' , this.formBuilder.control(this.interventionWifiAccessPoint.identifiant,[Validators.required]));
      this.form.addControl('ipAdresse' , this.formBuilder.control(this.interventionWifiAccessPoint.ipAdresse,[Validators.required]));
      this.form.addControl('passwordController' , this.formBuilder.control(this.interventionWifiAccessPoint.passwordController,[Validators.required]));
    }
    else{
      this.form.addControl('refControlerLocationType' , this.formBuilder.control(this.interventionWifiAccessPoint.refControlerLocationType));
      this.form.addControl('identifiant' , this.formBuilder.control(this.interventionWifiAccessPoint.identifiant));
      this.form.addControl('ipAdresse' , this.formBuilder.control(this.interventionWifiAccessPoint.ipAdresse));
      this.form.addControl('passwordController' , this.formBuilder.control(this.interventionWifiAccessPoint.passwordController));
    }
  }

  setLocationType() {
    this.formsService.setValueInFormControl(
      this.interventionWifiAccessPoint.refControlerLocationType,
      'refControlerLocationType',
      this.locationTypes,
      this.form
    );
    this.observeLocationType();
  }
  observeLocationType() {
    this.form.get('refControlerLocationType').valueChanges.subscribe(
      (location)=> {
        this.interventionWifiAccessPoint.refControlerLocationType = location;
        this.isVisiblePrecision = location ? location.label.indexOf('Autre') !== -1 : false;
        if(this.isVisiblePrecision){
          this.form.addControl('autreEmplacement' , this.formBuilder.control(this.interventionWifiAccessPoint.autreEmplacement));
        }
      }
    );
  }
  initPrecision() {
    const ref = this.interventionWifiAccessPoint.refControlerLocationType;
    if(ref && ref.label.indexOf('Autre') !== -1){
      this.form.addControl('autreEmplacement' , this.formBuilder.control(this.interventionWifiAccessPoint.autreEmplacement));
      this.isVisiblePrecision = true;
    }
  }

  
validateAccessPtModelBorne(formsAccPt){ 
  
    const controls = formsAccPt.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        if(name === 'modelBorne'){
          this.modelBorneInvalid = true;}
}} 
   
}
//==============================validation ======================================
  validateAccessPt(form){ 
    const controls = form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
          switch (name) {
            case 'refControlerLocationType':
            this.refControlerLocationTypeInvalid = true;
            break;
            case 'modelBorne':
            this.modelBorneInvalid = true;
            break;
            case 'identifiant':
            this.identifiantInvalid = true;
            break;
            case 'ipAdresse':
            this.ipAdresseInvalid = true;
            break;
            case 'passwordController':
            this.passwordControllerInvalid = true;
            break;
            default:
            console.log('valide acc pt');
            break;}}
        }
     
  }
  
  initValidators(){
    this.modelBorneInvalid = false;
    this.refControlerLocationTypeInvalid = false;
    this.identifiantInvalid = false;
    this.ipAdresseInvalid = false;
    this.passwordControllerInvalid = false;
  }


  setValidation(){
    this.initValidators();
    if(this.isManadatoryFields){
      if(this.isVisibleWifiBlock){
        this.validateAccessPt(this.form);
      }
    }
  }
}
