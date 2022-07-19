import { ReferenceDataVO } from './../../../../_core/models/reference-data-vo';
import { ReferenceDataTypeService } from '../../../../../app/_core/services';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PersonVO } from '../../../../_core/models/person-vo';
import { DatePipe } from '@angular/common';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { BaseForm } from '../../../../_shared/components';
@Component({
  selector: 'app-profil-modification',
  templateUrl: './profil-modification.component.html',
  styleUrls: ['./profil-modification.component.scss']
})
export class ProfilModificationComponent extends BaseForm implements OnInit {

  @Output() updateProfil = new EventEmitter<boolean>(null);
  @Input() person: PersonVO;
  @Input() photo: string;
  isRequestView = false;
  files: File[] = [];
  fileInvalid = false;
  isNotValid = false;
  form: FormGroup;
  filteredOptions: Observable<Array<any>>;
  filteredNationalities: Observable<Array<any>>;
  filteredLanguages: Observable<Array<any>>;
  filteredActivitySectors: Observable<Array<any>>;
  socialTitles: any[];
  customerName: string;
  civility: string;
  internalName: string;
  useName: string;
  prenom: string;
  nationality: string;
  nationalities: ReferenceDataVO[];
  birthdate: string;
  languages: ReferenceDataVO[];
  language: string;
  activitySectors: ReferenceDataVO[];
  activitySector: string;
  domains: ReferenceDataVO[];
  domain: string;
  complementActivity: string;
  companyType: string;
  companyName: string
  types: ReferenceDataVO[];
  portrait: string;
  socialTitle: any;
  chosenSocialTitle: any;
  chosenNationality: any;
  chosenLanguage: any;
  chosenSector: any;
  @Output() changeForm = new EventEmitter<PersonVO>();

  @Output() changeDirtyProfilForm = new EventEmitter<boolean>();

  @Input()
  isSelected = false;

  constructor(private readonly  referenceDataTypeService: ReferenceDataTypeService,
    private readonly _formBuilder: FormBuilder,private readonly datePipe: DatePipe
    ){
      super();
    }

  
  buildProfilFrom(): any {
    return this._formBuilder.group({
      refSocialTitle: this._formBuilder.control(this.person.refSocialTitle),
      title: this._formBuilder.control(this.person.title),
      lastName:this._formBuilder.control(this.person.lastName),
      firstName:this._formBuilder.control(this.person.firstName),
      crmName:this._formBuilder.control(this.person.crmName),
      nickname:this._formBuilder.control(this.person.nickname),
      refNationality: this._formBuilder.control(this.person.refNationality),
      birthdate: this._formBuilder.control(new Date(this.person.birthdate ? this.person.birthdate: '')),
      refFavoriteLanguage: this._formBuilder.control(this.person.refFavoriteLanguage),
      refSocioEconomicGroup: this._formBuilder.control(this.person.refSocioEconomicGroup),
      refJob: this._formBuilder.control(this.person.refJob),
      jobTitle: this._formBuilder.control(this.person.jobTitle),
      refCompanyType: this._formBuilder.control(this.person.refCompanyType),
      companyName: this._formBuilder.control(this.person.companyName),
      portraitByCoach: this._formBuilder.control(this.person.portraitByCoach)
    });
  }
  ngOnInit(): void {
    this.form = this.buildProfilFrom();
    this.onChangeForm();
    this.getSocialTitles();
    this.getNationalities();
    this.getLanguages();
    this.getActivitySectors();
    this.getDomains();
    this.getCompanyTypes();
  }
  initRefCompanyType() {
    if(!this.person.refCompanyType){
      this.form.get('refCompanyType').setValue(null);
    }else{
      this.types.forEach(
        (type)=>{
          if(type.label === this.person.refCompanyType.label){
            this.form.get('refCompanyType').setValue(type);
          }
        }
      );
    }

  }
  onChangeForm() {
    if(!isNullOrUndefined(this.form)){
      this.form.valueChanges.subscribe( () => {
        this.changeDirtyProfilForm.emit(this.form.dirty);
        this.changeForm.emit(this.form.value);
      });
    }
  }
  getCompanyTypes() {
    this.getReferenceDataByType('COMPANY_TYPE')
        .subscribe(
        (data)=>{
          this.types = data;
          this.initRefCompanyType();
      }
    );
  }
  getDomains() {
    this.getReferenceDataByType('CUSTOMER_JOB').subscribe(data => this.domains = data);
  }
 
  getActivitySectors() {
    this.getReferenceDataByType('SOCIO_ECONOMIC_GROUP')
        .subscribe(
        (data)=>{
          this.activitySectors = data;
          this.onFilteredActivitySectors();
      }
    );
  }
  onFilteredActivitySectors() {
    this.filteredActivitySectors = this.form.get('refSocioEconomicGroup').valueChanges
    .pipe(
      startWith(''),
      map(name => name ? this._filterActivitySectors(name) : this.activitySectors.slice())
    );
  }
  _filterActivitySectors(name: any): any {
    name = name && name.label ? name.label:name
    const filterValue = name.toLowerCase();
    return this.activitySectors.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }
  getLanguages() {
    this.getReferenceDataByType('LANGUAGE')
        .subscribe(
        (data)=>{
          this.languages = data;
          this.onFilteredLanguages();
      }
    );
  }
  onFilteredLanguages() {
    this.filteredLanguages = this.form.get('refFavoriteLanguage').valueChanges
    .pipe(
      startWith(''),
      map(name => name ? this._filterLanguages(name) : this.languages.slice())
    );
  }
  _filterLanguages(name: any): any {
    name = name && name.label ? name.label:name
    const filterValue = name.toLowerCase();
    return this.languages.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }
  getNationalities() {
    this.getReferenceDataByType('COUNTRY')
      .subscribe(
        (data)=>{
          this.nationalities = data;
          this.onFilteredNationalities();
        }
      );
  }
  onFilteredNationalities() {
    this.filteredNationalities = this.form.get('refNationality').valueChanges
    .pipe(
      startWith(''),
      map(name => name ? this._filterNationalities(name) : this.nationalities.slice())
    );
  }
  getSocialTitles() {
    this.getReferenceDataByType('SOCIALTITLE')
        .subscribe(
        (data)=>{
          this.socialTitles = data;
          this.onFilterSocialTitles();
        }
      );
  }
  getReferenceDataByType(type){
   return this.referenceDataTypeService.getReferenceDatasByTypeAndNiche(type, 1);
  }

  onFilterSocialTitles() {
    this.filteredOptions = this.form.get('refSocialTitle').valueChanges
    .pipe(
      startWith(''),
      map(name => name ? this._filterSocialTitles(name) : this.socialTitles.slice())
    );
  }

  displayFn(user: any): string {
    return user && user.name ? user.name : '';
  }

  _filterSocialTitles(name: any): any[] {
    name = name && name.label ? name.label:name
    const filterValue = name.toLowerCase();
    return this.socialTitles.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }

  _filterNationalities(name: any): any {
    name = name && name.label ? name.label:name
    const filterValue = name.toLowerCase();
    return this.nationalities.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }

  onSelectFile(event: any): void {
    this.files = [];
    this.files.push(...event.addedFiles);
    this.person.photo.id = 0;
    this.person.photo.file = this.files[0];
    this.person.photo.isRemove = false;
    this.fileInvalid = false;
  }
  onRemoveFile(event: any): void {
    this.files.splice(this.files.indexOf(event), 1);
    this.fileInvalid = true;
    this.person.photo.isRemove = true;
  }

  loadImageProfil(): string {
    return 'assets/images/customer-dashboard/profile-avatar.png';
  }
  
  onUpdateProfil(): void {
    this.updateProfil.emit(false);
  }

  onSelectBirthDate(event){
  }

  annuler(): void {
    
  }

  
  onChoseSocialTitle(socialTitle){
    this.chosenSocialTitle = socialTitle;
    console.log(socialTitle);
  }
  onChoseNationality(nationality){
    this.chosenNationality = nationality;
    console.log(nationality);
  }

  onChoseLanguage(language){
    this.chosenLanguage = language;
    console.log(language);
  }

  onChoseActivitySector(sector){
    this.chosenSector = sector;
    console.log(sector);
  }

  onChoseDomain(domain){
    this.form.get('refJob').setValue(domain);
  }

  onChoseCompanyType(label){
    const clone = this.types.slice();
    return clone.filter(type=> type.label === label)[0];
  }

  display(object){
    return object ? object.label:'';
  }

  isValidBy(val: string): boolean {
    return (this.form.controls[val].touched || this.isSelected) && 
    (this.form.get(val).value == null || 
    this.form.get(val).value === undefined || 
    this.form.get(val).value === '')
  }
}
