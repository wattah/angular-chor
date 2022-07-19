import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-athena-check-uncheck-option',
  templateUrl: './athena-check-uncheck-option.component.html',
  styleUrls: ['./athena-check-uncheck-option.component.scss']
})
export class AthenaCheckUncheckOptionComponent implements OnInit {
  selectedOption: any[];
  valuesOption = [
    { id: 1, viewValue: "Option1" },
    { id: 2, viewValue: "Option2" },
    { id: 3, viewValue: "Option3" },
    { id: 4, viewValue: "Option4" },
  ]
  updateString: string;

  selectOption() {
    this.selectedOption = this.valuesOption
  }
  deselectOption() {
    this.selectedOption = [];
  }
  updateOption() {
    this.updateString = this.selectedOption.map(element => element.viewValue).join(", ");
    return this.updateString;
  }
  ngOnInit() {
    this.selectedOption = this.valuesOption;
  }




}
