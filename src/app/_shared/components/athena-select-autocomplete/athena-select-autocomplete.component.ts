import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-athena-select-autocomplete',
  templateUrl: './athena-select-autocomplete.component.html',
  styleUrls: ['./athena-select-autocomplete.component.scss']
})
export class AthenaSelectAutocompleteComponent implements OnInit {

 optionControl = new FormControl();
  options: string[] = ['Un', 'Deux', 'Trois'];
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.optionControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}


