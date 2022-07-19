import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';



import { MailInteractionVo } from '../models/mailInteractionVo';
import { InteractionService } from '../services/interaction.service';
import { isNullOrUndefined } from '../utils/string-utils';



@ Injectable({
  providedIn: 'root'
})
export class InteractionDetailMailResolver implements Resolve< Observable< MailInteractionVo>> {
  interactionId: string;
  constructor(private interactionService: InteractionService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable< MailInteractionVo> {
    this .interactionId = route.paramMap.get('interactionId');
    
    if (isNullOrUndefined(this .interactionId)) {
      this .interactionId = route.parent.paramMap.get('interactionId');
    }
    return this .interactionService.getInteractionMailDetail(Number(this .interactionId))
    .pipe(catchError(() => of(null)));
    

  }


}