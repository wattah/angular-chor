import { Component} from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-athena-datepicker',
  templateUrl: './athena-datepicker.component.html',
  styleUrls: ['./athena-datepicker.component.scss'],
})
export class AthenaDatepickerComponent {
  date = new FormControl(new Date());

}

