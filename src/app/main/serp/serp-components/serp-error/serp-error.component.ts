import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-serp-error',
  templateUrl: './serp-error.component.html',
  styleUrls: ['./serp-error.component.scss']
})
export class SerpErrorComponent {

  @Input()
  searchPattern = '';

}
