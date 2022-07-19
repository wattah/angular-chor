import { Component } from '@angular/core';

@Component({
  selector: 'app-athena-checkbox-button',
  template: `
  <div class="form-check">
    <input  class="form-check-input athena" id="checkbox" type="checkbox">
    <label class="form-check-label athena" for="checkbox">
    </label>
  </div>
  `,
  styleUrls: ['./athena-checkbox-button.component.scss']
})
export class AthenaCheckboxButtonComponent {



}
