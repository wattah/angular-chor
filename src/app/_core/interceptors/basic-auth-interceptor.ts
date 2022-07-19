import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { STORED_ACTIVE_ROLE_NAME  , STORED_ACTIVE_ROLE_PERMISSIONS} from '../constants/constants';
import { ApplicationUserVO } from '../models/application-user';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  user: ApplicationUserVO;
  ftUid: string;
  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const url = request.url;
    if (url.indexOf('userconnectegassi') === -1) {
      const token = sessionStorage.getItem('token');
      const permissions = sessionStorage.getItem(STORED_ACTIVE_ROLE_PERMISSIONS);
      const roleName = sessionStorage.getItem(STORED_ACTIVE_ROLE_NAME);
      request = request.clone({
        setHeaders: {
          Authorization: token,
          Permissons: roleName !== 'ADMINISTRATEUR_SI' ? btoa(permissions):'',
          ActiveRole: roleName ,
          'Cache-Control':  'no-cache, no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });
      return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
        let message = '';
        if (!(error.error instanceof ErrorEvent) && ((error.status === 500 && error.error.message.indexOf('JWT validity cannot be asserted and should not be trusted') !== -1) || error.status === 401)) {
            // handle JWT validity error
            message = `Error: ${error.error.message}`;
            console.error(message);
            window.location.href = `${environment.accessNotAuthenticatedRedirectUrl}`;
            return throwError('no data , server troubles ');
        }
        console.error('An error was occured here **********************: ');
        return throwError(error);
    }));
    } else {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('An error was occured here : ', error);
          return throwError('the user must be connected to gassi ....');
        })
      );   
    }
  } 
}
