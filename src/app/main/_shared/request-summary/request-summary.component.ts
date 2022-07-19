import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { RequestAnswersVO } from '../../../_core/models/request-answers-vo';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { RequestAnswersService } from '../../../_core/services';

@Component({
  selector: 'app-request-summary',
  templateUrl: './request-summary.component.html',
  styleUrls: ['./request-summary.component.scss']
})
export class RequestSummaryComponent implements OnInit {

  @Input() detailRequest: RequestCustomerVO;
  @Input() requestAnswers: RequestAnswersVO[] =[];
  @Input() customerId: string;
  @Input() requestId: number;

  @Input() isFromCri = false;
  @Output() saveCri: EventEmitter<boolean> = new EventEmitter<boolean>();

 
  reponseRequest = '';
  constructor(private readonly confirmationDialogService: ConfirmationDialogService, private readonly router: Router,
    private readonly requestAnswersService: RequestAnswersService
    ) {}

  ngOnInit(): void {
    this.requestAnswersService.getRequestAnswers(this.requestId).subscribe( (data) => {
      this.requestAnswers = data;
      this.reponseRequest = this.requestAnswers.map(ans => ans[2]).join('\n');
      
    });
  }

  /**
   * @author fsmail
   * Cette methode est ajouté
   * pour conditionner le retour vers la demande
   * depuis un CRI
   */
  navigateRequest(){
    if(this.isFromCri){
         const title = 'Reour';
          const comment = 'Vous avez effectué des modifications. Voulez-vous les enregistrer ?';
          const btnOkText = 'Oui';
          const btnCancelText = 'Non';
          this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText, 'lg',true)
          .then((confirmed) => {
              if(confirmed) {
               this.saveCri.emit(true);
              }
              else{
                this.forwardToRequestDetail();
              }
           })
          .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));}
    else{
      this.forwardToRequestDetail();
    }
  }
  forwardToRequestDetail(){
    this.router.navigate(
      ['/customer-dashboard', this.customerId,'detail','request' , this.detailRequest.idRequest],
   {
      queryParamsHandling: 'merge'
    }
  );
  }


  formatAnwser(anwser: RequestAnswersVO): string{
    const value = anwser[2];
    return anwser[3] === 'string' ? `${anwser[4]} : ${value}`: value
  }
}
