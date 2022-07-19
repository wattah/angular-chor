import { isNullOrUndefined } from '../../../../../_core/utils/string-utils';
import { CalculeCartPricesService } from './../../../../../_core/services/calcule-cart-prices.service';
import { FormStoreManagementService } from './../from-store-management.service';
import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";

import { ICellEditorAngularComp } from '@ag-grid-community/angular';


@Component({
    selector: 'numeric-cell',
    template: `<input #input (keydown)="onKeyDown($event)" [(ngModel)]="value" style="width: 100%">`
})
export class NumericEditor implements ICellEditorAngularComp, AfterViewInit {
    private params: any;
    public value: number;
    private cancelBeforeStart = false;
    cartItems: any;
    cart: any;

    constructor(private readonly formStoreManagementService: FormStoreManagementService,        private readonly calculeCartPricesService: CalculeCartPricesService){

    }

    // @ViewChild('input', {read: ViewContainerRef}) public input;

    @ViewChild('input', { read: ViewContainerRef, static: false }) public input;

    agInit(params: any): void {
        this.params = params;
        this.value = this.params.value;
        // only start edit if key pressed is a number, not a letter
        this.cancelBeforeStart = params.charPress && ('1234567890'.indexOf(params.charPress) < 0)  ;
        this.cartItems = this.formStoreManagementService.cartItems.slice();
        this.cart = this.formStoreManagementService.cart;
    }

    getValue(): any {
        return this.value;
    }

    isCancelBeforeStart(): boolean {
        return this.cancelBeforeStart;
    }

    // will reject the number if it greater than 1,000,000
    // not very practical, but demonstrates the method.
    isCancelAfterEnd(): boolean {
        return this.value > 1000000;
    }

    onKeyDown(event): void {
        if (!this.isKeyPressedNumeric(event) && (event.preventDefault) ) {
            event.preventDefault()
        }
    }
    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        window.setTimeout(() => {
            this.input.element.nativeElement.focus();
        })
    }

    private getCharCodeFromEvent(event): any {
        event = event || window.event;
        return (typeof event.which == "undefined") ? event.keyCode : event.which;
    }

    private isCharNumeric(charStr): boolean {
        return !!/\d/.test(charStr) || charStr === 'Backspace' || charStr === 'Enter'  || charStr === '.' ;
    }



    private isKeyPressedNumeric(event): boolean {
        const charCode = this.getCharCodeFromEvent(event);
        const charStr = event.key ? event.key : String.fromCharCode(charCode);
        if(event.key && event.key === 'Enter'){
            this.updateBasket();
        }
        return this.isCharNumeric(charStr);
    }
    updateBasket() {
     if(this.value && this.value >= 0 && this.value !== this.params.value){
        let uniqueId = this.params.data.id
        if(isNullOrUndefined(uniqueId)){
            uniqueId = this.params.data.uniqueId
        }
        switch(this.params.colDef.field){
            case 'acquisitionPriceReal':
                this.updateAcq(uniqueId);
            break;
            case 'unitPriceHt':
                this.updateUnitPriceHt(uniqueId);
            break;
            case 'quantity':
                this.updateQuantity(uniqueId);
            break;
            case 'discount':
                this.updateDiscount(uniqueId);
            break;
         }
     }
    }
    updateDiscount(cartItemIndex: any) {
        this.cartItems.forEach(
            (item)=> {
                if(item.id && item.id === cartItemIndex){
                    item.discount = this.value;
                }else{
                    if(item.uniqueId && item.uniqueId === cartItemIndex){
                        item.discount = this.value; 
                    }
                }
            }
        );
        this.calculatePrices();
    }
    updateQuantity(cartItemIndex: any) {
        this.cartItems.forEach(
                (item)=> {
                    if(item.id && item.id === cartItemIndex){
                        item.quantity = this.value;
                    }else{
                        if(item.uniqueId && item.uniqueId === cartItemIndex){
                            item.quantity = this.value;
                        }
                    }
                }
            );
            this.calculatePrices();
        
    }
    updateUnitPriceHt(cartItemIndex) {
        this.cartItems.forEach(
            (item)=> {
                if(item.id && item.id === cartItemIndex){
                    item.unitPriceHt = this.value;
                }else{
                    if(item.uniqueId && item.uniqueId === cartItemIndex){
                        item.unitPriceHt = this.value;
                    }
                }
            }
        );
        this.calculatePrices();
    }
    updateAcq(cartItemIndex) {
        this.cartItems.forEach(
            (item)=> {
                if(item.id && item.id === cartItemIndex){
                    item.acquisitionPriceReal = this.value;
                }else{
                    if(item.uniqueId && item.uniqueId === cartItemIndex){
                        item.acquisitionPriceReal = this.value;
                    }
                }
            }
        );
        this.calculatePrices();
    }

    private calculatePrices() {
        this.cart.request.cartItems = this.cartItems;
        this.formStoreManagementService.onChangeCartCalule(
            this.calculeCartPricesService.recalculatePrices(this.cart)
        );
    }
}
