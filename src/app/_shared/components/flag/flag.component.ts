import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-flag',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.scss']
})
export class FlagComponent {

  @Input() country = 'fr';

  get getFlagClass(): string {
    return (this.country === 'fr') ? 'flag-fr' : 'flag-gb';
  }

}
