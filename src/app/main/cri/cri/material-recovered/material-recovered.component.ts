import { InterventionHardwareVO } from './../../../../_core/models/models.d';
import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ReferenceDataVO } from 'src/app/_core/models';
import { ReferenceDataTypeService } from 'src/app/_core/services';
import { isNullOrUndefined } from 'src/app/_core/utils/string-utils';

@Component({
  selector: 'app-material-recovered',
  templateUrl: './material-recovered.component.html',
  styleUrls: ['./material-recovered.component.scss']
})


export class MaterialRecoveredComponent implements OnInit {
 
  form: FormGroup;
  type = new FormControl();
  serialNumber = new FormControl();
  quantity = new FormControl();
  description = new FormControl();
  rowData : InterventionHardwareVO[] = [];
  listOfRecoveredMaterial : InterventionHardwareVO[] = [];
  columnDefs: any[];
  params: { force: boolean; suppressFlash: boolean; };
  getRowHeight;
  iconeDelHtml: any = `<span class="icon del"></span>`; 
  interventionHardware: ReferenceDataVO[];
  disabelAdd  = true;
  disabelQuantity : any = false;
  showArrayOfRecoveredMaterial = false;

   /*-------- Auto-completion filters------*/
  filteredType: Observable<any[]>;

   /*--------Form validation------------*/
  isTypeValid = true;
  
  @Input() interventionReport;
  @Output() isFromCriAndCriChangeOut = new EventEmitter<boolean>();
  @Input() allowedToModifyTechnicalInformationTab;

  constructor(
    private readonly referenceDataTypeService: ReferenceDataTypeService,
    private readonly route: ActivatedRoute ,
    private readonly formBuilder: FormBuilder
    ) { 
      
    }

  ngOnInit() {
    this.setColumnDef();
    this.route.data.subscribe(resolversData => {
      this.interventionHardware =  resolversData['interventionHardwareReferenceData'];
    });
    
    /*------------------Filtre sur liste des types ---------------------------*/
    this.filteredType = this.type.valueChanges
   .pipe(
     startWith(''),
     map(option => option ? this._filterType(option) : this.interventionHardware.slice())
   );

   this.isTypeValid = false;
   this.form = this.buildForm();
   this.setRestrictions();
   this.checkInterventionReportHardware();
   this.isFromCriAndCriChangeOut.emit(false);
   this.calculateRowHeigh();
  }
  
  ngOnChanges(change: SimpleChanges){
    if(this.form){
      this.setRestrictions();
    }
    if(!isNullOrUndefined(change['interventionReport']) && 
        !change['interventionReport'].firstChange && this.interventionReport){
          this.buildForm();
          this.type.setValue(null);
          this.description.setValue('');
          this.serialNumber.setValue('');
          this.quantity.setValue(1);
        this.checkInterventionReportHardware();
    }
  }

  setRestrictions() {
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.form.disable();  
    }
    else{
      this.form.enable();
    }
  }

  checkInterventionReportHardware(){
    this.rowData = [];
    this.showArrayOfRecoveredMaterial = false;
    if(this.interventionReport.interventionHardware && this.interventionReport.interventionHardware.length>0){
      this.loadExistingHardware();
    }else{
     this.interventionReport.interventionHardware = [];
    }
  }

  loadExistingHardware(){
    this.rowData = [];
    this.interventionReport.interventionHardware.forEach(hardware => {
      this.rowData.push(hardware);
    });
    if(this.rowData.length > 0){
      this.showArrayOfRecoveredMaterial = true;
    }
    this.params = {
      force: true,
      suppressFlash: true,
    };
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      type: this.formBuilder.control(null),
      description: this.formBuilder.control(''),
      serialNumber: this.formBuilder.control(null),
      quantity: this.formBuilder.control(null),
    });
  }

  setColumnDef(){
    this.columnDefs = [
      {
          headerName: 'TYPE',
          field: 'refInterventionHardware.label',
          minWidth: 110,
      },
      {
        headerName: 'QTÉ',
        field: 'quantity',
        minWidth: 100,
      },
      {
      headerName: 'N° DE SERIE',
      field: 'serialNumber',
      minWidth: 150,
      },
      {
        headerName: 'DESCRIPTION',
        field: 'comment',
        minWidth: 410,
        wrapText: true,
      },
      {
        headerName: '',
        headerTooltip: '',
        field: 'delete',
        cellRenderer: (params) => {
            return this.iconeDelHtml;
        },
        minWidth: 44,
        headerClass: 'yess',
        cellClass: 'yess',
        sortable: false
      },
    ];
  }

  private _filterType(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.interventionHardware.filter(type => type.label !== undefined)
    .filter(type => type.label.toLowerCase().indexOf(filterValue) === 0);
  }
  
  checkIfValidToAdd(){
    if (isNullOrUndefined(this.type.value) || this.type.value === '') {
      this.disabelAdd = true;
    }else{
      if(this.type.value === 'Autre' ){
        if(isNullOrUndefined(this.description.value) || this.description.value===''){
          this.disabelAdd = true;
        }else{
          this.disabelAdd = false;
        }
      }else{
        this.disabelAdd = false;
      }
    }
  }

  getSelectedType(): any {
    this.quantity.setValue(1);
    this.checkIfValidToAdd();
  }
  
  descriptionChanged(){
    this.checkIfValidToAdd();
  }

  serialNumberChanged(){
    if( this.serialNumber.value !==''){
      this.quantity.setValue(1);
      this.disabelQuantity = true;
    }else{
      this.disabelQuantity = false;
    }
  }
 
  addMaterial(){
    this.isFromCriAndCriChangeOut.emit(true);
    let selectedType;
    selectedType = this.interventionHardware.filter(
      (type) => type.label === this.type.value
    )[0];

    const materialRecupere : any = {};
    materialRecupere.refInterventionHardware = selectedType;
    materialRecupere.quantity = this.getValue(this.quantity.value) === '-' ? 1 : this.getCorrectQuantity(this.quantity.value);
    materialRecupere.serialNumber = this.getValue(this.serialNumber.value);
    materialRecupere.comment = this.getValue(this.description.value);
    materialRecupere.interventionReportId = 0;
    if(!isNullOrUndefined(this.interventionReport.id)){
      materialRecupere.interventionReportId = this.interventionReport.id;
    }
    if(!this.checkIfMaterialExists(materialRecupere)){
      this.interventionReport.interventionHardware.push(materialRecupere);
      this.rowData = [];
      this.interventionReport.interventionHardware.forEach(recoveredMaterial =>{
        this.rowData.push(recoveredMaterial);
      });
      if(this.rowData.length > 0){
        this.showArrayOfRecoveredMaterial = true;
      }
      this.params = {
        force: true,
        suppressFlash: true,
      };
      this.quantity.setValue(1);
    }
  }

  getValue(value){
    if(isNullOrUndefined(value) || value === ''){
      return '-';
    }else{
      return value;
    }
  }
  
  getCorrectQuantity(quantity){
    if(quantity < 1 ){
      this.quantity.setValue(1);
      return 1;
    }
    if(quantity > 99){
      return 99;
    }
    return quantity;
  }

  checkIfMaterialExists(material){
    const index = this.listOfRecoveredMaterial.findIndex(m => m.refInterventionHardware === material.refInterventionHardware 
      && m.serialNumber === material.serialNumber && m.comment === material.comment);
    if(index === -1){
      return false;
    }else{
      return true;
    } 
  }

  
  clickCell(params: any): void {
    if (params.column.colId === 'delete'  && this.allowedToModifyTechnicalInformationTab){
      this.rowData.splice(params.rowIndex,1);
      this.interventionReport.interventionHardware.splice(params.rowIndex,1);
      this.rowData =  this.rowData.slice();
      this.params = {
        force: true,
        suppressFlash: true,
      };
      if(this.rowData.length === 0){
        this.showArrayOfRecoveredMaterial = false;
      }
    }
  }
  calculateRowHeigh(): void {
    this.getRowHeight = (params) => {
        if (params.node) {
            const offset = 20;
            const lignes = params.data.comment.split(/\r\n|\r|\n/);
            let allDetailRowHeight = lignes.length;
            lignes.forEach((ligne: string) => {
                const snb = ligne.length / 60;
                if (snb > 1) {
                    allDetailRowHeight += snb - 1;
                }
            });
            return allDetailRowHeight * 20 + offset;
        }
    };

  }
}
