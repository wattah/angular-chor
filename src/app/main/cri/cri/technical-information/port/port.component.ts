import { InterventionAutreStNas } from './../../../../../_core/models/cri/intervention-autre-st-nas';
import { InterventionNas } from './../../../../../_core/models/cri/intervention_nas';
import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-port',
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss']
})
export class PortComponent implements OnInit , OnChanges  {
  @Input() interventionNas: InterventionNas;
  @Output() onAddAutreStation = new EventEmitter<true>();
  @Output() onRemoveOtherStation = new EventEmitter<number>();
  @ViewChild('automcomplete' , {static: false}) autocomplete;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  stationCtrl = new FormControl();
  filteredStations: Observable<string[]>;
  AUDIO_STATION = 'Audio Station';
  FILE_STATION = 'File Station';
  SURVEILLANCE_STATION = 'Surveillance Station';
  VIDEO_STATION = 'Vidéo Station';
  CLOUD_STATION = 'Cloud Station';
  stations: string[] = [];
  allStations: string[] = 
  [this.AUDIO_STATION, this.FILE_STATION, this.SURVEILLANCE_STATION, this.VIDEO_STATION,this.CLOUD_STATION];
  form: FormGroup;
  interventionAutreStNas: InterventionAutreStNas[];
  @ViewChild('stationInput', { static: false }) stationInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @Input() allowedToModifyTechnicalInformationTab;
 
  constructor(private readonly formBuilder: FormBuilder,
    private readonly notificationService: NotificationService) { 
    this.filteredStations = this.stationCtrl.valueChanges.pipe(
      startWith(''),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allStations.slice()));
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['interventionNas'] && this.interventionNas){
      this.form = this.buildForm();
      this.interventionAutreStNas = this.interventionNas.interventionAutreStNas;
      this.stations = [];
        this.setStations();
      
    }
    this.setRestrictions();
  }
  
  ngOnInit() {
    this.interventionAutreStNas = this.interventionNas.interventionAutreStNas;
    this.observePort();
    this.setRestrictions();
  }

  setRestrictions(){
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.form.disable();
    }else{
      this.form.enable();
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim() && this.allStations.includes(value)) {
      this.stations.push(value.trim());
      this.displayFieldByStationName();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.stationCtrl.setValue(null);
    setTimeout(
      ()=> {
        this.autocomplete.openPanel() 
      });
  }

  remove(fruit: string): void {
    const index = this.stations.indexOf(fruit);

    if (index >= 0) {
      this.stations.splice(index, 1);
      this.displayFieldByStationName();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const station = event.option.viewValue;
    if(!this.stations.includes(station)){
      this.stations.push(event.option.viewValue);
    }
    this.stationInput.nativeElement.value = '';
    this.stationCtrl.setValue(null);
    this.displayFieldByStationName();
    setTimeout(
      ()=> {
        this.autocomplete.openPanel() 
      })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allStations.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      portAudio: this.formBuilder.control(this.interventionNas.portAudio),
	    portFile: this.formBuilder.control(this.interventionNas.portFile),
	    portSurveillance: this.formBuilder.control(this.interventionNas.portSurveillance),
	    portVideo: this.formBuilder.control(this.interventionNas.portVideo),
	    portCloud: this.formBuilder.control(this.interventionNas.portCloud),
    });
  }

  displayFieldByStationName() {
    this.interventionNas.isAudioSt = this.stations.includes(this.AUDIO_STATION);
    this.interventionNas.isFileSt = this.stations.includes(this.FILE_STATION);
    this.interventionNas.isSurveillanceSt = this.stations.includes(this.SURVEILLANCE_STATION);
    this.interventionNas.isVideoSt = this.stations.includes(this.VIDEO_STATION);
    this.interventionNas.isCloudSt = this.stations.includes(this.CLOUD_STATION);
  }

  setStations() {
    this.pushInStations(this.interventionNas.isAudioSt , this.AUDIO_STATION);
    this.pushInStations(this.interventionNas.isFileSt , this.FILE_STATION);
    this.pushInStations(this.interventionNas.isSurveillanceSt , this.SURVEILLANCE_STATION);
    this.pushInStations(this.interventionNas.isVideoSt , this.VIDEO_STATION);
    this.pushInStations(this.interventionNas.isCloudSt , this.CLOUD_STATION);
  }
  pushInStations(isExist: boolean, station: string) {
    if(isExist){
      this.stations.push(station);
    }
  }

  addAutreStation(event){
    event.preventDefault();
    this.onAddAutreStation.emit(true);
  }

  onRemoveOtherStationEvent(index){
    this.onRemoveOtherStation.emit(index);
  }
  
  observePort(){
    this.form.valueChanges.subscribe(
      (value)=> {
        if(this.form.dirty){
          console.log('observePort');
          this.notificationService.setIsFromCriAndCriChange(true);
        }
      }
    );
  }

}
