import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-info-bull',
  templateUrl: './info-bull.component.html',
  styleUrls: ['./info-bull.component.scss']
})
export class InfoBullComponent {

  @Input() iconName="help-grey";

  @Input()
  state: boolean;

  @Input()
  title: string;

  @Output()
  closeEvent = new EventEmitter<boolean>();  

  showBullBody(): void {
    this.state = true;
  }

  hideBullBody(): void {
    this.state = false;
    this.closeEvent.emit(this.state);
  }
}
