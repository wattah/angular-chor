import { Directive, ElementRef, HostListener } from '@angular/core';


@Directive({
  selector: 'input[numberOnly]'
})
export class NumberInputDirective {

  constructor(private readonly _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initialValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
    if ( initialValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
