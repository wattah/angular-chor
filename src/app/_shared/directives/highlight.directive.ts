import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

import { getHighLightText } from '../../_core/utils/formatter-utils';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements AfterViewInit {
  @Input() searchedWords: string;
  @Input() text: string;
  @Input() classToApply: string;

  constructor(private readonly el: ElementRef, private readonly renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', getHighLightText(this.text, this.searchedWords));
  }
}
