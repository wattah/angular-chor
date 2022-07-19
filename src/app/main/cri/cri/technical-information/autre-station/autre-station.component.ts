import { FormGroup, FormBuilder } from '@angular/forms';
import { InterventionAutreStNas } from './../../../../../_core/models/cri/intervention-autre-st-nas';
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-autre-station',
  templateUrl: './autre-station.component.html',
  styleUrls: ['./autre-station.component.scss']
})
export class AutreStationComponent implements OnInit , OnChanges {

  @Input() index: number;
  @Input() intervention: InterventionAutreStNas;
  @Input() allowedToModifyTechnicalInformationTab;
  @Output() onRemoveOtherStation = new EventEmitter<number>();
  form: FormGroup;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly notificationService: NotificationService)  { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['intervention'] && this.intervention){
      this.form = this.buildForm();
    }
    this.setRestrictions();
  }

  ngOnInit() {
    this.observeOtherStation();
    this.setRestrictions();
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      autreStation: this.formBuilder.control(this.intervention.autreStation),
      autrePort: this.formBuilder.control(this.intervention.autrePort)
    });
  }

  setRestrictions(){
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.form.disable();
    }else{
      this.form.enable();
    }
  }

  removeOtherStation(){
    this.onRemoveOtherStation.emit(this.index - 1)
  }
  
  observeOtherStation(){
    this.form.valueChanges.subscribe(
      (value)=> {
        if(this.form.dirty){
          console.log('observeOtherStation');
          this.notificationService.setIsFromCriAndCriChange(true);
        }
      
      }
    );
  }

}
