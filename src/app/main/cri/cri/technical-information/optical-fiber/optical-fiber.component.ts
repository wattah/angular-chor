import { FormsService } from './../forms.service';
import { ReferenceDataVO } from './../../../../../_core/models/reference-data-vo';
import { FibreOptiqueVO } from './../../../../../_core/models/cri/fibre-optique-vo';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-optical-fiber',
  templateUrl: './optical-fiber.component.html',
  styleUrls: ['./optical-fiber.component.scss']
})
export class OpticalFiberComponent implements OnInit , OnChanges {
  @Input() index = 1;
  @Input() emplacementPtos: ReferenceDataVO[];
  @Input() emplacementOnts: ReferenceDataVO[];
  @Input() emplacementLiveBoxs: ReferenceDataVO[];
  @Input() ingenieries: ReferenceDataVO[];
  @Input() opticalFiber: FibreOptiqueVO;
  @Input() isManadatoryFields;
  @Input() fibreOptiquesLength;
  @Input() allowedToModifyTechnicalInformationTab;
  @Input() tabchangedOrSave;
  @Input() isVisibleOpticalBlock;
  @Output() onRemoveOpticalFiberItem = new EventEmitter<number>();
  form: FormGroup;
  isVisiblePrecisionEmplacementPto;
  isVisiblePrecisionEmplacementOnt: boolean;
  isVisiblePrecisionEmplacementLivebox: boolean;
  //
  aidInvalid = false;
  ndFictifInvalid = false;
  ndVoipInvalid = false;
  identConnexionInvalid = false;
  mdpConnexionInvalid = false;
  emplacementPtoInvalid = false;
  emplacementOntInvalid = false;
  emplacementLiveboxInvalid = false;
  numeroPtoInvalid = false;
  slidInvalid  = false;
  isRequired = false;
  constructor(private readonly formBuilder: FormBuilder, private readonly formsService: FormsService,
    readonly notificationService: NotificationService) { }

  ngOnChanges(change: SimpleChanges){
    if(change['opticalFiber'] && this.opticalFiber){
      this.form = this.buildForm();
      this.formsService.opticalFiberForms.push(this.form);
    }
    if(change['emplacementPtos'] && this.emplacementPtos){
      this.selectEmplacementPto();
    }
    if(change['emplacementOnts'] && this.emplacementOnts){
      this.selectEmplacementOnt();
    }
    if(change['emplacementLiveBoxs'] && this.emplacementLiveBoxs){
      this.selectEmplacementLiveBox();
    }
    if(change['ingenieries'] && this.ingenieries){
      this.selectIngenierie();
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
      if(this.isVisibleOpticalBlock){
        this.initValidators();
        this.validateFibreOptique(this.form);
      } 
    }
    this.setRestrictions();
  }
  
  
  ngOnInit() {
    this.observeEmplacementPto();
    this.observeEmplacementOnt();
    this.observeEmplacementLivebox();
    this.observeIngenierie();
    this.observeFiberOptique();
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
      aid: this.formBuilder.control(this.opticalFiber.aid),
      ndFictif: this.formBuilder.control(this.opticalFiber.ndFictif),
      ndVoip: this.formBuilder.control(this.opticalFiber.ndVoip),
      identConnexion: this.formBuilder.control(this.opticalFiber.identConnexion),
      mdpConnexion: this.formBuilder.control(this.opticalFiber.mdpConnexion),
      slid: this.formBuilder.control(this.opticalFiber.slid),
      emplacementPto: this.formBuilder.control(this.opticalFiber.emplacementPto),
      emplacementOnt: this.formBuilder.control(this.opticalFiber.emplacementOnt),
      mesurePto: this.formBuilder.control(this.opticalFiber.mesurePto),
      autreEmplacementPto: this.formBuilder.control(this.opticalFiber.autreEmplacementPto),
      autreEmplacementOnt: this.formBuilder.control(this.opticalFiber.autreEmplacementOnt),
      emplacementLivebox: this.formBuilder.control(this.opticalFiber.emplacementLivebox),
      autreEmplacementLivebox: this.formBuilder.control(this.opticalFiber.autreEmplacementLivebox),
      isCheckedOffrePro: this.formBuilder.control(this.opticalFiber.isCheckedOffrePro),
      numeroPto: this.formBuilder.control(this.opticalFiber.numeroPto),
      comment: this.formBuilder.control(this.opticalFiber.comment),
      operateurImmeuble:this.formBuilder.control(this.opticalFiber.operateurImmeuble),
      nomSite:this.formBuilder.control(this.opticalFiber.nomSite),
      ingenierie:this.formBuilder.control(this.opticalFiber.ingenierie)
  });
  }
  selectEmplacementPto() {
    this.formsService.setValueInFormControl(
      this.opticalFiber.emplacementPto,
      'emplacementPto',
      this.emplacementPtos,
      this.form
    );
    this.observeEmplacementPto();
  }

  selectEmplacementOnt() {
    this.formsService.setValueInFormControl(
      this.opticalFiber.emplacementOnt,
      'emplacementOnt',
      this.emplacementOnts,
      this.form
    );
    this.observeEmplacementOnt();
  }
  selectEmplacementLiveBox() {
    this.formsService.setValueInFormControl(
      this.opticalFiber.emplacementLivebox,
      'emplacementLivebox',
      this.emplacementLiveBoxs,
      this.form
    );
    this.observeEmplacementLivebox();
  }
  selectIngenierie() {
    this.formsService.setValueInFormControl(
      this.opticalFiber.ingenierie,
      'ingenierie',
      this.ingenieries,
      this.form
    );
  }
  removeOpticalFiber(){
    this.onRemoveOpticalFiberItem.emit(this.index-1);
  }

  observeEmplacementPto() {
    this.form.get('emplacementPto').valueChanges.subscribe(
      (emplacement)=> {
        if(emplacement && emplacement.label){
          this.opticalFiber.emplacementPto = emplacement;
          this.isVisiblePrecisionEmplacementPto = emplacement.label.indexOf('Autre') !== -1;
        }
      }
    );
  }

  observeEmplacementOnt() {
    this.form.get('emplacementOnt').valueChanges.subscribe(
      (emplacement)=> {
        this.opticalFiber.emplacementOnt = emplacement;
        if(emplacement && emplacement.label){
          this.opticalFiber.emplacementOnt = emplacement;
          this.isVisiblePrecisionEmplacementOnt = emplacement.label.indexOf('Autre') !== -1;
        }
      }
    );
  }

  observeEmplacementLivebox() {
    this.form.get('emplacementLivebox').valueChanges.subscribe(
      (emplacement)=> {
        if(emplacement && emplacement.label){
          this.opticalFiber.emplacementLivebox = emplacement;
          this.isVisiblePrecisionEmplacementLivebox = emplacement.label.indexOf('Autre') !== -1;
        }
      }
    );
  }

  observeIngenierie() {
    this.form.get('ingenierie').valueChanges.subscribe(
      (ingenierie)=> {
        if(ingenierie && ingenierie.label){
          this.opticalFiber.ingenierie = ingenierie;
        }
      }
    );
  }
  observeFiberOptique(){
    this.form.valueChanges.subscribe(
      (value)=> {
        if(this.form.dirty){
          console.log('fiber optique change');
          this.notificationService.setIsFromCriAndCriChange(true);
        }
      
      }
    );
  }

  //==============================validation ======================================
  validateFibreOptique(form){ 
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'aid':
            this.aidInvalid = true;
          break;
          case 'ndFictif':
            this.ndFictifInvalid = true;
          break;
          case 'ndVoip':
            this.ndVoipInvalid = true;
          break;
          case 'identConnexion':
            this.identConnexionInvalid = true;
          break; 
          case 'mdpConnexion':
          this.mdpConnexionInvalid = true;
          break;
          case 'emplacementPto':
          this.emplacementPtoInvalid = true;
          break;
          case 'emplacementOnt':
          this.emplacementOntInvalid = true;
          break;
          case 'emplacementLivebox':
          this.emplacementLiveboxInvalid = true;
          break;
          case 'numeroPto':
            this.numeroPtoInvalid = true;
          break;
          case 'slid':
            this.slidInvalid = true;
          break
          default:
          console.log('valide fibre');
           break;}}
      }  
}

initValidators(){
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
}
