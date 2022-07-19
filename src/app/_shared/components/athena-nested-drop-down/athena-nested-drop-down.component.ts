import { Component, Input, Output, EventEmitter, ViewEncapsulation, SimpleChanges, OnChanges } from '@angular/core';

import { isNullOrUndefined } from '../../../_core/utils/string-utils';

interface ItemDropDown {
  label: string;
  children: Partial<ItemDropDown>[];
} 

@Component({
  selector: 'app-athena-nested-drop-down',
  templateUrl: './athena-nested-drop-down.component.html',
  styleUrls: ['./athena-nested-drop-down.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AthenaNestedDropDownComponent implements OnChanges {
  
  // list must have label and children 
  @Input() list: Partial<ItemDropDown>[] ;

  @Input() hasError: boolean; 

  @Output() selectionChange: any = new EventEmitter<Object>();

  parentNode: ItemDropDown = { label: '--', children: [] };

  @Input() selectedValue = { label : '--' };
 
  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes ['list'] && !isNullOrUndefined(this.list)) {
      this.parentNode = { label: '--', children : this.list }
    }
  }

  onSelectedValue(value: any ): void {
    this.selectedValue = value;
    this.selectionChange.emit(this.selectedValue);
  }
}
