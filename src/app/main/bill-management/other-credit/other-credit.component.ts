import { PenicheLineDetailsVO } from './../../../_core/models/peniche-line-details-vo';
import { isNullOrUndefined } from './../../../_core/utils/string-utils';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-other-credit',
  templateUrl: './other-credit.component.html',
  styleUrls: ['./other-credit.component.scss']
})
export class OtherCreditComponent implements OnInit {

  @Input() formNumber = 1;
  @Input() lineDetails : PenicheLineDetailsVO;
  @Input() linesDetailsLength : any;
  @Output() onRemoveLineDetailsItem = new EventEmitter<number>();
  @Output() onAmountHTChange = new EventEmitter();
  @Input() isDetailsLinesValid;
  @Input() IndexesOfLineDetailsInvalid;
  
  
  lineDetailsform: FormGroup;
  amountTTC : number = 0;
  labelInvalid = false;
  categoryInvalid = false;
  amountHTInvalid = false;
  tvaInvalid = false;

  constructor(private readonly _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.lineDetailsform = new   FormGroup({});
    this.lineDetailsform =  this.buildForm();
    this.lineDetails.lineCategory = null;
    this.lineDetails.tvaRate = 20;
  }

  ngOnChanges(change: SimpleChanges){
    if(change['IndexesOfLineDetailsInvalid'] && !this.isDetailsLinesValid ){
      this.initValidators();
      this.validateLineDetail();
    }
  }

  buildForm(): any {
    return this._formBuilder.group({
      label : this._formBuilder.control(this.lineDetails.lineLabel, Validators.required),
      category : this._formBuilder.control(this.lineDetails.lineCategory, Validators.required),
      amountHT : this._formBuilder.control(this.lineDetails.amount, Validators.required),
      tva : this._formBuilder.control(this.lineDetails.tvaRate, Validators.required),
    }); 
  }

  calculateAmountTTC(){
    const amountHT = this.lineDetailsform.get("amountHT").value;
    const tva = this.lineDetailsform.get("tva").value;
    if(!isNullOrUndefined(amountHT) && !isNullOrUndefined(tva)){
      this.amountTTC = amountHT + (amountHT * tva)/100;
    }else{
      this.amountTTC = 0;
    }
    this.onAmountHTChange.emit();
  }

  initValidators(){
    this.labelInvalid = false;
    this.categoryInvalid = false;
    this.amountHTInvalid = false;
    this.tvaInvalid = false;
  }

  validateLineDetail(){ 
    const invalid = [];
    if(!isNullOrUndefined(this.lineDetailsform)){
      const controls = this.lineDetailsform.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
            switch (name) {
              case 'label':
                this.labelInvalid = true;
              break;
              case 'category':
                this.categoryInvalid = true;
              break;
              case 'amountHT':
                this.amountHTInvalid = true;
              break;
              case 'tva':
                this.tvaInvalid = true;
              break;
              default:
               break;
            }
          }
      }
    }
  }

  removeOtherCredit(){
    this.onRemoveLineDetailsItem.emit(this.formNumber-1);
    this.calculateAmountTTC();
  }

  filterInput(event:any): boolean{
    // allow only number, "," and "."
    if( event.which === 46 || event.which === 44 || (event.which >= 48 && event.which <= 57) ){
      return true;
    } else {
      return false ;
    }
  }
}
