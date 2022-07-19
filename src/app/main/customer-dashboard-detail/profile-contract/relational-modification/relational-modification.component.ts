import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { ReferenceDataVO } from '../../../../_core/models';
import { ReferenceDataService } from '../../../../_core/services/reference-data.service';
import { ProfilContractService } from '../profil-contract.service';
import { PersonVO } from '../../../../_core/models/person-vo'; 
import { SEGMENT } from '../../../../_core/constants/constants';
import { BaseForm } from '../../../../_shared/components';

const segmentList = [SEGMENT.GRAND_VOYAGEUR, SEGMENT.SEDENTAIRE, SEGMENT.SEDENTAIRE_PRO, SEGMENT.COMEX_GROUPE,
  SEGMENT.PROVINCE, SEGMENT.INACCESSIBLE, SEGMENT.A_DEFINIR];

const TypeData = {
  CLIENT_OBS_TYPE: 'OBS_TYPE',
  CKABSENCE_RAISON: 'ABSENCE_RAISON',
  CK_GENERIC_NOTATION: 'GENERIC_NOTATION',
  LOCATION: 'LOCATION',
  CK_INACCESSIBILITY_REASON: 'INACCESSIBILITY_REASON',
  CK_CUSTOMER_KNOWLEDGE_POTENTIAL_COOPTATION: 'CUSTOMER_KNOWLEDGE_POTENTIAL_COOPTATION'
};

@Component({
  selector: 'app-relational-modification',
  templateUrl: './relational-modification.component.html',
  styleUrls: ['./relational-modification.component.scss']
})
export class RelationalModificationComponent extends BaseForm implements OnInit, OnChanges {

  @Input() person: PersonVO;

  initialState: PersonVO;

  // to prevent any mode (consulation / modification) in this component (modification)
  @Output() updateRelational = new EventEmitter<boolean>(null);

  // to prevent new data of  form 
  @Output() changeForm = new EventEmitter<PersonVO>();
  @Output() isChangeDirty = new EventEmitter<boolean>();

  refLocationList: ReferenceDataVO[];
  filterdRefLocationList: Observable<ReferenceDataVO[]>;
  obsTypeList: ReferenceDataVO[];
  absenceRaisonList: ReferenceDataVO[];
  refInaccessibilityReasonList: ReferenceDataVO[];
  levelInfluenceList: any[];
  refAccessibilityList: any[];
  refSegmentList: any[];
  refPotentialList: any[];
  refPotentialCooptationList: ReferenceDataVO[] = [];

  formRelational: FormGroup;

  showSensitiveMemberComent: boolean;

  showBehaviorWithParnasseComent: boolean;

  @Input() typeCustomer: string;

  constructor( private readonly fb: FormBuilder, private readonly referenceDataService: ReferenceDataService, 
    private readonly profilContractService: ProfilContractService) {
      super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onChangeForm();
  }

  ngOnInit(): void {
    
    this.buildForm();
    this.initAllComBoBox();
    this.initialState = { ...this.person };
    this.onChangeSensitiveMember();
    this.onChangeBehaviorWithParnasseComent();
    this.onChangeForm();
    this.showSensitiveMemberComent = Boolean(this.person.isSensitiveMember);
    this.showBehaviorWithParnasseComent = Boolean(this.person.isBehaviorWithParnasse);
  }

  initrefPotentialCooptationList(): void {
    this.referenceDataService.getReferencesData(TypeData.CK_CUSTOMER_KNOWLEDGE_POTENTIAL_COOPTATION).subscribe(data => {
      if (!isNullOrUndefined(data)) {
        for (const ref of data) {
          if (ref.ordinal === 1 || ref.ordinal === 2 || ref.ordinal === 6 || ref.ordinal === 12) {
            this.refPotentialCooptationList.push(ref);
          }
        }
        this.refPotentialCooptationList.sort( (p1, p2) => p1.ordinal - p2.ordinal);
        this.initializeComboboxCooptation(this.refPotentialCooptationList);
      }
    });
  }

  buildForm(): void {
    this.formRelational = this.fb.group({
      refLocation: this.fb.control(this.person.refLocation),
      obsType: this.fb.control(this.person.obsType),
      obscomment: this.fb.control(this.person.obscomment),
      isBusinessProvider: this.fb.control(Boolean(this.person.isBusinessProvider)),
      isPartnerProvideurContributor: this.fb.control(Boolean(this.person.isPartnerProvideurContributor)),
      isPresentToEvent: this.fb.control(Boolean(this.person.isPresentToEvent)),
      refEventAbsenceReason: this.fb.control(this.person.refEventAbsenceReason), 
      refInfluence: this.fb.control(this.person.refInfluence), 
      isSensitiveMember: this.fb.control(Boolean(this.person.isSensitiveMember)), 
      sensitiveMemberComent: this.fb.control(this.person.sensitiveMemberComent), 
      refAccessibility: this.fb.control(this.person.refAccessibility),
      refInaccessibilityReason: this.fb.control(this.refInaccessibilityReasonList),
      isBehaviorWithParnasse: this.fb.control(Boolean(this.person.isBehaviorWithParnasse)),
      behaviorWithParnasseComent: this.fb.control(this.person.behaviorWithParnasseComent),
      refPotentialTurnover: this.fb.control(this.person.refPotentialTurnover),
      refPotentialCooptation: this.fb.control(this.person.refPotentialCooptation),
      segment: this.fb.control(this.person.segment)
    });
  }

  initAllComBoBox(): void {

    this.referenceDataService.getReferencesData( TypeData.LOCATION ).subscribe( data => {
      this.refLocationList = data; 
      this.filterdRefLocationList = this.formRelational.get('refLocation').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.label),
        map(name => name ? this._filterRefLocationList(name) : this.refLocationList.slice())
      );
    });
  
    this.referenceDataService.getReferencesData( TypeData.CLIENT_OBS_TYPE ).subscribe( data => {
      this.obsTypeList = data;
      this.initializeCombobox(this.obsTypeList, 'obsType');
    });

    this.referenceDataService.getReferencesData( TypeData.CKABSENCE_RAISON ).subscribe( data => {
      this.absenceRaisonList = data;
      this.initializeCombobox(this.absenceRaisonList, 'refEventAbsenceReason');
    });
    
    this.referenceDataService.getReferencesData( TypeData.CK_INACCESSIBILITY_REASON ).subscribe( data => {
      this.refInaccessibilityReasonList = data;
      this.initializeCombobox(this.refInaccessibilityReasonList, 'refInaccessibilityReason');
    });

    this.referenceDataService.getReferencesData( TypeData.CK_GENERIC_NOTATION ).subscribe( data => {
      this.refAccessibilityList = this.formatLabelList(data, 'accessibility');
      this.initializeSegmentationCombobox(this.refAccessibilityList, 'refAccessibility');

      this.levelInfluenceList = this.formatLabelList(data, 'levelInfluence');
      this.initializeSegmentationCombobox(this.levelInfluenceList, 'refInfluence');

      // potential cA et potential cooptation ont la mm liste
      this.refPotentialList = this.formatLabelList(data, 'potentiel');
      this.initializeSegmentationCombobox(this.refPotentialList, 'refPotentialTurnover');
    });

    this.refSegmentList = segmentList;
    this.initializeSegmentationSegmentCombobox();

    this.initrefPotentialCooptationList();

  }

  formattedLabelPotentielCooptation(ordinal: number): string {      
    return this.profilContractService.formattedLabelPotentielCooptation(ordinal);
  }

  /**
   * permet de visualiser Inconnu en premier
   * puis formatter l'affichage des label exple au lieu de 0 -> Pas d'influence  (argument : type)
   * argument name permet de initailize la valeur par défaut
   **/
  formatLabelList(datas: ReferenceDataVO[], type: string): any[] {
    const last = datas[datas.length - 1];
    datas = [ last , ...datas ];
    datas.pop();
    return datas.map( value => {
      return { ...value, formattedLabel: this.profilContractService.formatLabel(value.key, type) };
    });
  }

  initializeCombobox(list: any[], name: string): void {
    if ( isNullOrUndefined(this.person[name]) ) {
      this.formRelational.get(name).setValue( null );
    } else {
      this.setValueInForm(list, name);
    } 
  }

  setValueInForm(list: any[], name: string): void {
    list.forEach( ref => {
      if ( this.person[name].id === ref.id) {
        this.formRelational.get(name).setValue( ref );
      }
    });
  }

  initializeSegmentationCombobox(list: any[], name: string): void {
    if ( isNullOrUndefined(this.person[name]) ) {
      this.formRelational.get(name).setValue( list[0] );
    } else {
      this.setValueInForm(list, name);
    }
  }

  initializeSegmentationSegmentCombobox(): void {
      segmentList.forEach( seg => {
        if ( this.person.segment === seg) {
          this.formRelational.get('segment').setValue( seg );
        }
      });
  }

  initializeComboboxCooptation(list: any[]): void {
    if ( isNullOrUndefined(this.person.refPotentialCooptation) ) {
      this.formRelational.get('refPotentialCooptation').setValue( null );
    } else {
      list.forEach( ref => {
        if ( this.formattedLabelPotentielCooptation(ref.ordinal) === this.formattedLabelPotentielCooptation(this.person.refPotentialCooptation.ordinal)) {
          this.formRelational.get('refPotentialCooptation').setValue( ref );
        }
      });
    }
    
  }

  _filterRefLocationList(value: string): ReferenceDataVO[] {
    return this.refLocationList.filter(option => option.label.toLowerCase().indexOf(value.toLowerCase()) === 0);
  }

  displayRefLocation(location: ReferenceDataVO): string {
    return isNullOrUndefined(location) ? '--' : location.label;
  }

  onUpdateRelational(): void {
    this.updateRelational.emit(true);
  }

  onChangeSensitiveMember(): void {
    this.formRelational.get('isSensitiveMember').valueChanges.subscribe( value => {
      console.log(value)
      if (value) {
        this.showSensitiveMemberComent = true;
      } else {
        this.showSensitiveMemberComent = false;
        this.formRelational.get('sensitiveMemberComent').setValue('');
      }
    });
  }

  onChangeBehaviorWithParnasseComent(): void {
    this.formRelational.get('isBehaviorWithParnasse').valueChanges.subscribe( value => {
      console.log('**************************', value);
      this.showBehaviorWithParnasseComent = value;
      if (!value) {
        this.showBehaviorWithParnasseComent = false;
        this.formRelational.get('behaviorWithParnasseComent').setValue('');
      }
    });
  }

  onChangeForm(): void {
    if(!isNullOrUndefined(this.formRelational)) {
      this.formRelational.valueChanges.subscribe( () => {
        this.isChangeDirty.emit(this.formRelational.dirty);
        
        this.changeForm.emit(this.formRelational.value);
      });
    }
  }
}
