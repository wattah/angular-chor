import { Directive, ElementRef, HostListener } from '@angular/core';


@Directive({
  selector: 'input[characterOnly]'
})
export class CharacterInputDirective {

  constructor(private readonly _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initialValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initialValue.replace(/[^a-zA-Z]/, '');
    if ( initialValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
