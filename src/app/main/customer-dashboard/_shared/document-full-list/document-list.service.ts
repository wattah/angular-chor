import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { DocumentVO } from '../../../../_core/models/documentVO';
import { DocumentService } from '../../../../_core/services/documents-service';
import { getDefaultStringEmptyValue, isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { ConfirmationDialogService } from '../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { DOCUMENTS_EXTENSIONS } from '../../../../_core/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class DocumentListService {

  constructor( private readonly _snackBar: MatSnackBar, private readonly router: Router, 
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly documentService: DocumentService) {}

  downloadDocument(row: DocumentVO): void {
    this.documentService.downloadFile(row.fileName, row.customerNicheIdentifer).subscribe(
        (data) => {
          const type = data.headers.get('Content-Type');
          const file = new Blob([data.body], { type });     
          if ( type !== 'application/octet-stream') {
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          } else {
            const element = document.createElement('a');
            element.target = '_blank';
            element.href = URL.createObjectURL(file);
            element.download = row.fileName;
            document.body.appendChild(element);
            element.click();
          }
        }, 
        (_error) => {
          this.confirmationDialogService.confirm('', 'Erreur Technique : Le document que vous souhaitez télécharger est introuvable.', 'Ok', null, 'lg', false);
        }
      );   
  }

  goToRequestDetail(requestId: number, customerId: string, typeCustomer: string ): void {
    if (!isNullOrUndefined(requestId)) {
      this.router.navigate(
        [ '/customer-dashboard', customerId, 'detail', 'request', requestId ],
        {
          queryParams: { typeCustomer },
          queryParamsHandling: 'merge' 
        }
      );
    }
  }

  showPopUpDeleteDocument(doc: DocumentVO, successCallBack: Function): void {
    const btnOkText = 'Oui, je le supprime';
    const btnCancelText = 'Non, je souhaite le garder';
    let comment = 'Etes-vous sûr de vouloir supprimer le document  « ';
    comment += (!isNullOrUndefined(doc.titreDocument)) ? doc.titreDocument : getDefaultStringEmptyValue(doc.title);
    comment += ' » ?';
    this.confirmationDialogService.confirm('', comment, btnOkText, btnCancelText, 'sm')
    .then(
      (confirmed) => {
        if (confirmed) {
          this.deleteDocument(doc.id, () => successCallBack());
        }
      }              
    );
  }

  deleteDocument(id: number, successCallBack: Function): void {
    this.documentService.deleteDocument(id).subscribe(
      _data => {
        this.openSnackBar('Le document a bien été supprimé');
        successCallBack(); 
      },
      _error => this.confirmationDialogService
        .confirm('', 'Erreur Technique : La suppression n\'est pas éffectuée. Veuillez réessayer réessayer ultérieurement', 'Ok', null, 'lg', false)
    );
  }

  changeProtailVisibility(doc: DocumentVO, successCallBack: Function): void {
    this.documentService.changeVisibilityPortail(doc).subscribe(_data => {
      this.openSnackBar('La modification visibilité portail a bien été prise en compte');
      successCallBack(); 
    });
  }

  getImageByFormat(ext: string): string {
    return ( DOCUMENTS_EXTENSIONS[ext] ) ? DOCUMENTS_EXTENSIONS[ext] : DOCUMENTS_EXTENSIONS['default'];
  }

  openSnackBar(text: string): void {
    this._snackBar.open(
      text, undefined, 
      { duration: 3000, panelClass: ['center-snackbar', 'snack-bar-container'] });
  }

}
