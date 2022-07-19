import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

import { ConfirmationDialogService } from '../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { environment } from '../../../environments/environment';
import { WelcomeMailVO } from '../models';
import { HttpBaseService } from './http-base.service';

@Injectable({
  providedIn: 'root'
})
export class WelcomeMailService extends HttpBaseService<WelcomeMailVO> {

  constructor(httpClient: HttpClient, private readonly _snackBar: MatSnackBar, private readonly confirmationDialogService: ConfirmationDialogService) {
    super(httpClient, 'welcome-mail');
  }

  saveWelcomeMail(welcomeMail: Partial<WelcomeMailVO>): Observable<WelcomeMailVO> {
    return this.httpClient.post<WelcomeMailVO>(`${environment.baseUrl}/${this.endpoint}/save` , welcomeMail);
  }

  getWelcomeMail(idRequest: string): Observable<WelcomeMailVO> {
    return this.httpClient.get<WelcomeMailVO>(`${environment.baseUrl}/${this.endpoint}/${idRequest}`);
  }

  generateWelcomeMail(withLogo: boolean , welcomeMail: WelcomeMailVO): Observable<any> {
    const downloadURL = `${environment.baseUrl}/${this.endpoint}/generate?withLogo=${withLogo}`;
    const httpOptions = {
      observe: 'response' as const,
      responseType  : 'arraybuffer' as 'json',
    };
    return this.httpClient.post(downloadURL, welcomeMail, httpOptions);
  }

  openSnackBar(text: string): void {
    this._snackBar.open(
      text, undefined, 
      { duration: 3000, panelClass: ['center-snackbar', 'snack-bar-container'] });
  }

  openErrorPopup(errorText: string): void {
    this.confirmationDialogService.confirm('', errorText, 'Ok', null, 'lg', false);
  }

}
