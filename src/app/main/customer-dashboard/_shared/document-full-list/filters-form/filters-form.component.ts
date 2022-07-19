import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ActivatedRoute } from '@angular/router';

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';

import { DocumentSearchCriteria } from '../../../../../_core/models/document-search-criteria';
import { TypeDocument } from '../../../../../_core/models/Type-Document';
import { isNullOrUndefined } from '../../../../../_core/utils/string-utils';
import { DocumentsTitleService } from '../../../../../_core/services';
import { getCustomerIdFromURL } from '../../../customer-dashboard-utils';
import { BaseForm } from '../../../../../_shared/components';

@Component({
  selector: 'app-filters-form',
  templateUrl: './filters-form.component.html',
  styleUrls: ['./filters-form.component.scss']
})
export class FiltersFormComponent extends BaseForm implements OnInit {

    /**********************************************
    *  FORM SECTION START                        *
    * ********************************************/
  typeControl = new FormControl();
  @Input()types = [];
  filteredType: Observable<TypeDocument[]>;
  
  showRequestsDoc: boolean;
  
  startDate = new FormControl();
  endDate = new FormControl();
  minDate: Date;
  customerId;
  
  separatorKeysCodes: number[] = [ENTER, COMMA];
  titleControl = new FormControl();
  filteredTitles$: Observable<string[]> = null;
  selectedTitles: string[] = [];
  @ViewChild('titleInput', { static: false }) titleInput: ElementRef<HTMLInputElement>;
  
  _documentSearchCriteria: DocumentSearchCriteria;

  @Output() changeFilters = new EventEmitter<Partial<DocumentSearchCriteria>>();

  
  listOfSuggestions: string[] = [];
    /**********************************************
    *  FORM SECTION END                        *
    * ********************************************/
  
  constructor(private readonly titleService: DocumentsTitleService,
    private readonly route: ActivatedRoute) {
     super();
  }
  
  get documentSearchCriteria(): DocumentSearchCriteria {
    return this._documentSearchCriteria;
  }
  set documentSearchCriteria(dsc: DocumentSearchCriteria) {
    this._documentSearchCriteria = { ...dsc };
    this.changeFilters.emit(this.documentSearchCriteria);
  }

  ngOnInit(): void {
    this.customerId = getCustomerIdFromURL(this.route);
    this.getTitles();
    this.getTypes(this.types);
    this.initDates();
  }
  //////////////////////////////// DATE //////////////////////////////////

  initDates(): void {
    this.startDate.setValue(null);
    this.endDate.setValue(null);
    this.documentSearchCriteria = { 
      ...this.documentSearchCriteria, 
      startDate: this.startDate.value,
      endDate: this.endDate.value
    };
  }

  onSelectStartDate(_event: any): void {
    const currenteDate = new Date();
    const currentHour = currenteDate.getHours();
    const currentMinute = currenteDate.getMinutes();
    const currentSecond = currenteDate.getSeconds();
    const dateDebut = new Date(this.startDate.value.setHours(currentHour, currentMinute, currentSecond));
    if (this.endDate !== null && this.endDate.value !== null && this.endDate.value.getTime() < this.startDate.value.getTime()) {
      const dateFin = new Date( new Date(dateDebut).setDate(dateDebut.getDate() + 1));
      this.endDate.setValue(dateFin);
    } 
    this.minDate = new Date(dateDebut);
    this.startDate.setValue(dateDebut);
    this.documentSearchCriteria = { 
      ...this.documentSearchCriteria, 
      startDate: this.startDate.value,
      endDate: this.endDate.value
    };
  }

  onSelectEndDate(_event: any): void {
    const dateFin = new Date(this.endDate.value);
    dateFin.setHours(dateFin.getHours() + 1);
    this.documentSearchCriteria = { 
      ...this.documentSearchCriteria, 
      endDate: dateFin
    };
  }
  
  //////////////////////////////// SHOW REQUESTS //////////////////////////////////

  onChangeShowRequest(): void {
    this.documentSearchCriteria = {
      ...this.documentSearchCriteria,
      showRequestsDoc: !this.documentSearchCriteria.showRequestsDoc
    };
  }
  
  //////////////////////////////// TYPES //////////////////////////////////

  getTypes(types: any): void {
    const STRING = 'string';
    this.types = types;
    this.typeControl.setValue( { id: 16, documentTypeName: 'Tous' } );
    this.filteredType = this.typeControl.valueChanges
          .pipe(
            startWith(''),
            map(value => (isNullOrUndefined(value) || typeof value === STRING) ? value : value.documentTypeName),
            map(name => !isNullOrUndefined(name) ? this._filterTypes(name) : this.types.slice())
          );

    this.typeControl.valueChanges.subscribe(data => {
      if (!isNullOrUndefined(data) && !isNullOrUndefined(data.id)) {
        this.documentSearchCriteria = { ...this.documentSearchCriteria, typeDocId: (data.id !== 16) ? data.id : null };
      } else {
        this.documentSearchCriteria = { ...this.documentSearchCriteria, typeDocId: null };
      }
    });
  }

  displayType(type: TypeDocument): string {
    if ( isNullOrUndefined(type)) {
      return '';
    }
    if (type.id === 16) {
      return 'Tous';
    }
    return type ? type.documentTypeName : '';
  }

  _filterTypes(value: string): TypeDocument[] {
    return this.types.filter(option => option.documentTypeName.toLowerCase().indexOf(value) === 0);
  }
  _filterTitle(value: string): string[]{
    const filterValue = value.toLowerCase();
    return this.listOfSuggestions.filter(title => title.toLowerCase().indexOf(filterValue) === 0);
  }

  getTitles(): void {
    this.titleService.getSuggestionsOfTitles(this.customerId).subscribe(data => {
      if (data !== null) {
        this.listOfSuggestions = data.filter(el => {
          return el !== null;
        });
      }
    });
    this.filteredTitles$ = this.titleControl.valueChanges
    .pipe(
      startWith(''),
      debounceTime(200),
        map(title => title ? this._filterTitle(title) : null)
      );
  }

    ////////////////////////////  TITLES  //////////////////////////
  
  remove(title: string): void {
    const titles = this.documentSearchCriteria.titles.filter( t => title.toUpperCase().localeCompare(t.toUpperCase()) !== 0);
    this.selectedTitles = titles;
    this.documentSearchCriteria = { ...this.documentSearchCriteria, titles };
  }
  
  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedTitles.push(event.option.value);
    if ( isNullOrUndefined(this.documentSearchCriteria.titles)) {
      this.documentSearchCriteria.titles = [];
    }
    this.documentSearchCriteria = { ...this.documentSearchCriteria, titles: this.selectedTitles };
    this.titleInput.nativeElement.value = '';
    this.titleControl.setValue(null);
  }
  
}
