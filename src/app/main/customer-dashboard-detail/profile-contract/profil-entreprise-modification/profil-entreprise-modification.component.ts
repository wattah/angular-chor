import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { PersonVO } from '../../../../_core/models/person-vo';

import { ReferenceDataVO } from '../../../../_core/models/reference-data-vo';
import { ReferenceDataService, ReferenceDataTypeService } from '../../../../_core/services';
import { BaseForm } from '../../../../_shared/components';
const TypeData = {
  CLIENT_OBS_TYPE: 'OBS_TYPE'
};

@Component({
  selector: 'app-profil-entreprise-modification',
  templateUrl: './profil-entreprise-modification.component.html',
  styleUrls: ['./profil-entreprise-modification.component.scss']
})
export class ProfilEntrepriseModificationComponent extends BaseForm implements OnInit {
  
  files: File[] = [];
  fileInvalid = false;
  @Input() person: PersonVO;
  activitySectors: ReferenceDataVO[];
  obsTypeList: ReferenceDataVO[];
  filteredActivitySectors: Observable<Array<any>>;
  form: FormGroup;
  chosenSector: any;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  @Output() updateProfilEntreprise = new EventEmitter<boolean>(null);
  @Output() changeForm = new EventEmitter<PersonVO>();
  @Output() changeDirtyProfilEntrepriseForm = new EventEmitter<boolean>();
  @Input() photo: string;
  @Input() isSelected = false;

  constructor(private readonly referenceDataService: ReferenceDataService, readonly  referenceDataTypeService: ReferenceDataTypeService,
    private readonly _formBuilder: FormBuilder, private readonly datePipe: DatePipe) {
      super();
     }



  buildProfilFrom(): any {
    this.form = this._formBuilder.group({
      refSocioEconomicGroup: this._formBuilder.control(this.person.refSocioEconomicGroup),
      companyName: this._formBuilder.control(this.person.companyName),
      crmName: this._formBuilder.control(this.person.crmName),
      obsType: this._formBuilder.control(this.person.obsType),
      obscomment: this._formBuilder.control(this.person.obscomment),
      siret: this._formBuilder.control(this.person.siret)
    });
  }

  ngOnInit(): any {
    this.buildProfilFrom();
    this.onChangeForm();
    this.getActivitySectors();
  }

  onChangeForm() {
    if (!isNullOrUndefined(this.form)) {
      this.form.valueChanges.subscribe( () => {
        this.changeDirtyProfilEntrepriseForm.emit(this.form.dirty);
        this.changeForm.emit(this.form.value);
      });
    }
  }

  loadImageProfil(): string {
    return 'assets/images/customer-dashboard/avatar-entreprise.svg';
  }

  getReferenceDataByType(type: any): any {
    return this.referenceDataTypeService.getReferenceDatasByTypeAndNiche(type, 1);
  }

  getActivitySectors(): void {
    this.getReferenceDataByType('SOCIO_ECONOMIC_GROUP')
        .subscribe(
        (data) => {
          this.activitySectors = data;
          this.onFilteredActivitySectors();
        }
    );
    this.referenceDataService.getReferencesData( TypeData.CLIENT_OBS_TYPE ).subscribe( data => {
      this.obsTypeList = data;
      this.obsTypeList.forEach(
        (type)=>{
          if(type.label === this.person.obsType.label){
            this.form.get('obsType').setValue(type);
          }
        }
      );
    });
  }

  onFilteredActivitySectors(): any {
    this.filteredActivitySectors = this.form.get('refSocioEconomicGroup').valueChanges
    .pipe(
      startWith(''),
      map(name => name ? this._filterActivitySectors(name) : this.activitySectors.slice())
    );
  }

  _filterActivitySectors(name: any): any {
    const filterValue = name.label.toLowerCase();
    return this.activitySectors.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }

  onSelectFile(event: any): void {
    this.files = [];
    this.files.push(...event.addedFiles);
    this.person.photo.id = 0;
    this.person.photo.file = this.files[0];
    this.person.photo.isRemove = false;
    this.fileInvalid = false;
    console.log(this.person.photo.id)
  }

  onRemoveFile(event: any): void {
    this.files.splice(this.files.indexOf(event), 1);
      this.person.photo.isRemove = true;
      this.fileInvalid = true;
    }

  display(object: ReferenceDataVO): string {
    return object ? object.label : '';
  }

  onUpdateProfilEntreprise(): void {
    this.updateProfilEntreprise.emit(false);
  }

  isFormValid(value: string): boolean {
    return (this.form.controls[value].touched || this.isSelected) &&
    (this.form.get(value).value === null ||
    this.form.get(value).value === undefined ||
    this.form.get(value).value === '');
  }

  isSirenValid(value: string): boolean {
    return (this.form.controls[value].touched || this.isSelected) && 
      (this.form.get(value).value !== null ||
       this.form.get(value).value !== undefined) &&
       this.form.get(value).value.length > 0 && this.form.get(value).value.length < 9;
  }
}
