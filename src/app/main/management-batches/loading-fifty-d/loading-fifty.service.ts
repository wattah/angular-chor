import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { ICON_NOT_VALID, ICON_VALID, LE_FICHIER,
   MESSAGE_DEJA_EXISTANT_SUR_PENICHE, MESSAGE_EXCEL50D_CODE_ALREADY, MESSAGE_GENERIC_DEJA_EXISTANT,
   MESSAGE_GENERIC_EXCEL50D_CODE_ALREADY,
   MESSAGE_GENERIC_EXCEL50D_WITH_NICHE,
   SNACK_BAR_CONTAINER_CLASS_NAME, SNACK_BAR_CONTAINER_SUCCESS_CLASS_NAME,
   SNACK_BAR_ERROR_CLASS_NAME, SNACK_BAR_SUCCESS_CLASS_NAME } from '../../../_core/constants/bill-constant';

@Injectable()
export class LoadingFiftyService {

constructor(private readonly _snackBar: MatSnackBar) { }

getIconStatus(nbrError: number): string {
  if(!isNullOrUndefined(nbrError) && nbrError > 0 ) {
    return ICON_NOT_VALID
  }
  return ICON_VALID;
}

getMessageAlreadyExist(fileName: string, isGeneric: boolean): string {
  return `${LE_FICHIER} '${fileName}' ${isGeneric ? MESSAGE_GENERIC_DEJA_EXISTANT: MESSAGE_DEJA_EXISTANT_SUR_PENICHE}`
}

getMessageCheckCodeNiche(codeNiche: string, isGeneric: boolean): string {
  return `${MESSAGE_GENERIC_EXCEL50D_WITH_NICHE} '${codeNiche}' ${isGeneric ? MESSAGE_GENERIC_EXCEL50D_CODE_ALREADY : MESSAGE_EXCEL50D_CODE_ALREADY}`
}

openSnackBarSuccess( text: string ) {
  this._snackBar.open(text, undefined, {
    duration: 3000,
    panelClass: [SNACK_BAR_SUCCESS_CLASS_NAME , SNACK_BAR_CONTAINER_SUCCESS_CLASS_NAME]
  });
}

openSnackBarError( text: string ) {
  this._snackBar.open(text, undefined, {
    duration: 3000,
    panelClass: [SNACK_BAR_ERROR_CLASS_NAME , SNACK_BAR_CONTAINER_CLASS_NAME]
  });
}

}
