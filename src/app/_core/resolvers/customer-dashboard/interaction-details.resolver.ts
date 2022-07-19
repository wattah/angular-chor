import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { isNullOrUndefined } from '../../utils/string-utils';
import { InteractionService } from '../../services/interaction.service';
import { InteractionLight } from '../../models/interaction-vo';


@ Injectable({
  providedIn: 'root'
})
export class InteractionDetailsResolver implements Resolve< Observable< InteractionLight>> {
  interactionId: string;
  constructor(private interactionService: InteractionService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable< InteractionLight> {
    this .interactionId = route.paramMap.get('interactionId');
    
    if (isNullOrUndefined(this .interactionId)) {
      this .interactionId = route.parent.paramMap.get('interactionId');
    }
   
    return this .interactionService.getInteractionDetails(Number(this .interactionId))
    .pipe(catchError(() => of(null)));

  }


}