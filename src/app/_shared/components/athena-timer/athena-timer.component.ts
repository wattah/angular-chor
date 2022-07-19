import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgxTimepickerFieldComponent } from 'ngx-material-timepicker';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';

@Component({
  selector: 'app-athena-timer',
  templateUrl: './athena-timer.component.html',
  styleUrls: ['./athena-timer.component.scss'], 
  encapsulation: ViewEncapsulation.None
})
export class AthenaTimerComponent implements OnInit, OnChanges {


  @Input() defaultHour: number;
  @Input() defaultMinute: number;

  time: string;

  @Output() selectTime: EventEmitter<string> = new EventEmitter<string>();

  @Input() minHour = 0;
  @Output() minHourChange = new EventEmitter();

  minTime;

  @Input() minMinute = 0;
  @Output() minMinuteChange = new EventEmitter();

  @Input() maxHour = 23;
  maxMinute= 59;
  maxTime;
    
  @Input() disabled = false;

  @ViewChild('timePicker', {static: false}) timePicker: NgxTimepickerFieldComponent; 


  ngOnChanges(changes: SimpleChanges): void {
    if ( changes['minHour'] || changes['minMinute']) {
      this.minTime = this.formatTime(this.minHour, this.minMinute);
      this.time = this.formatTime(this.minHour, this.minMinute); 
      this.onSelectTime();
    }

    if(changes['maxHour']){
      this.maxMinute = 0;
      this.maxTime = this.formatTime(this.maxHour, this.maxMinute);
    } 

    if ( changes['disabled'] ) {
      if (!isNullOrUndefined(this.timePicker)) {
        this.timePicker.setDisabledState(this.disabled);
      }
    }

    if(changes['defaultHour'] || changes['defaultMinute']){
      this.time = this.formatTime(this.defaultHour, this.defaultMinute);
      this.onSelectTime();
      if (!isNullOrUndefined(this.timePicker)) {
        this.timePicker.onTimeSet(this.time);
      }
    } 
  }


  ngOnInit(): void {
    this.time = this.formatTime(this.defaultHour, this.defaultMinute);
    this.onSelectTime();
  }

  formatTime(defaultHour: number, defaultMinute: number): string {
    let time = '';
    if (isNullOrUndefined(defaultHour) && isNullOrUndefined(defaultMinute)) {
      time = ''; 
    } else {
      time += (isNullOrUndefined(defaultHour)) ? '00':String(defaultHour).padStart(2, '0'); 
      time += ':';
      time += (isNullOrUndefined(defaultMinute)) ? '00':String(defaultMinute).padStart(2, '0');
    }
    return time;
  }

  hourSelect( time: string ):void {
    const splitedTime = time.split(':');
    const [hour, minute] = splitedTime.map( e => parseInt(e, 10));
   
    if (hour < this.minHour || (hour === this.minHour && minute < this.minMinute)) {
      this.time = `${this.minHour}:${this.minMinute}`;
      this.timePicker.onTimeSet(this.time);
    }

    if (hour > this.maxHour || (hour === this.maxHour && minute > this.maxMinute)) {
      this.time = `${this.maxHour}:${this.maxMinute}`;
      this.timePicker.onTimeSet(this.time);
    }
    this.time = time;
    this.onSelectTime();
  }

  onSelectTime(): void {
    this.selectTime.emit(this.time.replace(':', ' : '));
  }
  
}
