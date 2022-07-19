import { Injectable } from '@angular/core';
import { CENTER_SNACKBAR, CONTAINER_SNACKBAR} from '../../_core/constants/shared-popup-constant';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class SharedPopupService {

constructor(private readonly _snackBar: MatSnackBar) { }

openSnackBar(valueText: string): void {
this._snackBar.open(
  valueText, undefined, 
  { duration: 3000, panelClass: [CENTER_SNACKBAR, CONTAINER_SNACKBAR] });
}
}



