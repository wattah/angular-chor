import { FormsService } from './../forms.service';
import { InterventionWifiAccessPointVO } from './../../../../../_core/models/cri/intervention-wifi-access-point-vo';
import { InterventionWifi } from './../../../../../_core/models/cri/intervention-wifi';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-wifi',
  templateUrl: './wifi.component.html',
  styleUrls: ['./wifi.component.scss']
})
export class WifiComponent implements OnInit , OnChanges {
  @Input() interventionWifi: InterventionWifi;
  @Input() locationWifiTypes;
  @Input() wifiConnectionTypes;
  @Input() isManadatoryFields;
  @Input() locationTypes;
  @Input() allowedToModifyTechnicalInformationTab;
  @Output() onAddLocation = new EventEmitter<number>();
  @Output() onAddPointAccess = new EventEmitter<boolean>();
  @Output() onRemoveAccessPoint = new EventEmitter<number>();
  @Output() onRemoveLocation = new EventEmitter<{accessPointId: number , locationId:number}>();
  form: FormGroup
  interventionWifiAccessPoints: InterventionWifiAccessPointVO[];
  showSSIDAndPasswordFields: any;
  @Input() tabchangedOrSave;
  @Input() isVisibleWifiBlock;

  ssidLiveboxInvalid = false;
  passwordLiveboxInvalid = false;
  isRequired = false;
  constructor(private readonly formBuilder: FormBuilder, private readonly formsService: FormsService,
    readonly notificationService: NotificationService) { }

  ngOnChanges(change: SimpleChanges){
    if(change['interventionWifi'] && this.interventionWifi){
      this.interventionWifiAccessPoints = this.interventionWifi.interventionWifiAccessPoint;
      this.form = this.buildForm();
      this.observeIsLivebox();
      this.formsService.wifiForms.push(this.form);
    }
    if(change['isManadatoryFields'] && this.isManadatoryFields){
      this.initValidators();
      this.isRequired = true;
      this.formsService.setRestrictionOnFormFields(this.form);
    }
    if(change['isManadatoryFields'] && !this.isManadatoryFields){
      this.initValidators();
      this.isRequired = false;
      this.formsService.clearRestrictionOnFormFields(this.form);
    }
    if(change['tabchangedOrSave']){
      console.log('isVisibleWifiBlock ',this.isVisibleWifiBlock)
      if(this.isVisibleWifiBlock){
        this.initValidators();
        this.validateWifi(this.form);
      } 
    }
    this.setRestrictions();
  }

  ngOnInit() {
    this.interventionWifiAccessPoints = this.interventionWifi.interventionWifiAccessPoint;
    this.showSSIDAndPasswordFields = this.interventionWifi.isLivebox;
    if(this.showSSIDAndPasswordFields){
      this.addControls();
    }
    this.observeIsLivebox();
    this.observeWifi();
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
      isLivebox: this.formBuilder.control(this.interventionWifi.isLivebox),
      isNotLivebox: this.formBuilder.control(!this.interventionWifi.isLivebox),
      comment: this.formBuilder.control(this.interventionWifi.comment),
    });
  }
  onAddLocationEvent(event){
    this.onAddLocation.emit(event);
  }
  onRemoveLocationEvent(ids){
    this.onRemoveLocation.emit(ids);
  }

  addPointAccess(event){
    event.preventDefault();
    this.onAddPointAccess.emit(true);
    this.interventionWifiAccessPoints = this.interventionWifi.interventionWifiAccessPoint;
  }

  onRemoveAccessPointEvent(id){
    this.onRemoveAccessPoint.emit(id);
  }

  observeIsLivebox() {
    this.form.get('isLivebox').valueChanges.subscribe(
      (isLivebox)=>{
        this.interventionWifi.isLivebox = isLivebox;
        this.showSSIDAndPasswordFields = isLivebox;
        if(isLivebox && !this.form.get('ssidLivebox')){
          this.addControls();
          if(this.isManadatoryFields){
            this.formsService.setRestrictionOnFormByField(this.form,'ssidLivebox');
            this.formsService.setRestrictionOnFormByField(this.form,'passwordLivebox');
            this.validateWifi(this.form);
          }
        }
        else{
          if(this.form.get('ssidLivebox') && !this.isManadatoryFields){
            this.initValidators();
            this.formsService.clearRestrictionOnFormByField(this.form,'ssidLivebox');
            this.formsService.clearRestrictionOnFormByField(this.form,'passwordLivebox');
          }
        }
      }
    );
  }
  observeWifi(){
    this.form.valueChanges.subscribe(
      (value)=> {
        if(this.form.dirty){
          console.log('wifi change');
          this.notificationService.setIsFromCriAndCriChange(true);
        }
      
      }
    );
  }

  addControls() {
    this.form.addControl('ssidLivebox' , this.formBuilder.control(this.interventionWifi.ssidLivebox));
    this.form.addControl('passwordLivebox' , this.formBuilder.control(this.interventionWifi.passwordLivebox));
  }


//==============================validation ======================================
  validateWifi(form){ 
    const controls = form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
          switch (name) {
            case 'ssidLivebox':
            this.ssidLiveboxInvalid = true;
            break;
            case 'passwordLivebox':
            this.passwordLiveboxInvalid = true;
            break;
            default:
            console.log('valide wifi');
            break;}}
        }
     
  }
  
  initValidators(){
    this.ssidLiveboxInvalid = false;
    this.passwordLiveboxInvalid = false;
  }
}
