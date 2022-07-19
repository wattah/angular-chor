import { Directive, ElementRef, HostListener } from '@angular/core';


@Directive({
  selector: 'input[numberPhoneInternationalOnly]'
})
export class NumberPhoneInternationalInputDirective {

  constructor(private readonly _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initialValue = this._el.nativeElement.value;
    const value = initialValue.match(/^(\+?[0-9]*)/g);
    if ( value !== this._el.nativeElement.value) {
      this._el.nativeElement.value = value;
      event.stopPropagation();
    }
  }

}
