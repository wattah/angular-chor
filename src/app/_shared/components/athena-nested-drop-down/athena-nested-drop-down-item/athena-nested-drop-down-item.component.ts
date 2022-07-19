import { Component, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-athena-nested-drop-down-item',
  templateUrl: './athena-nested-drop-down-item.component.html',
  styleUrls: ['./athena-nested-drop-down-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AthenaNestedDropDownItemComponent {

  @Input() items: any[];

  @ViewChild('childMenu', { static: true }) childMenu;
 
  @Output() selectedValue = new EventEmitter<Object>();

  setSelectedValue(value: any): void {
    this.selectedValue.emit(value);
  }
}
