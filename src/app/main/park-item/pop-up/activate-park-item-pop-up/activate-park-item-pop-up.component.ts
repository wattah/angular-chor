import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParcLigneService } from '../../../../_core/services/parc-ligne.service';
import { Location } from '@angular/common';
import { ConfirmationDialogService } from '../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-activate-park-item-pop-up',
  templateUrl: './activate-park-item-pop-up.component.html',
  styleUrls: ['./activate-park-item-pop-up.component.scss']
})
export class ActivateParkItemPopUpComponent implements OnInit {

  @Input() idCustomerParkItem: number;
  messageError = "Erreur Serveur : Une erreur technique inattendue est surevenue.";
  transactionError = "Transaction rolled back because it has been marked as rollback-only";
  
  idCustomer: number;
  typeClient: string;


  constructor(readonly parcLigneService: ParcLigneService, 
    readonly  modalService: NgbModal, 
    readonly activeModal: NgbActiveModal,
    readonly location: Location,
    readonly confirmationDialogService: ConfirmationDialogService,
    readonly router: Router,
    readonly route: ActivatedRoute
    ) { 
    
      
  }

  ngOnInit() {
    this.route.root.firstChild.firstChild.paramMap.subscribe( (params: ParamMap) => {
      this.idCustomer = Number(params.get('customerId'));
    });
    this.route.paramMap.subscribe( (params: ParamMap) => {
      this.typeClient = this.route.snapshot.queryParamMap.get('typeCustomer');
    });
  }

  activeLine(){ 
    this.parcLigneService.suspendOrActiveLine(this.idCustomerParkItem,false).subscribe(
       data => {
        
          this.activeModal.close(true);
          this.openConfirmationDialogADV();
 
       },
       
       (error) => {
    
        this.activeModal.close(true);
        if (error.error.error !== '' && error.error.message !== this.transactionError) {
          this.openConfirmationDialoglg('Erreur Serveur : '+ error.error.message); 
       } else {
          this.openConfirmationDialoglg(this.messageError);
       }
       
      });
      
     }

    openConfirmationDialoglg(message: string): any {
       const title = 'Erreur';
       const btnOkText = 'OK';
       this.confirmationDialogService.confirm(title, message, btnOkText,null,'lg', false)
       .then((confirmed) => this.destroy())
       .catch(() => console.log('User dismissed )'));
     }

     openConfirmationDialogADV(): any {
      const title = 'ADV';
      const btnOkText = 'OK';
      const comment ='La ligne sera établie dès que possible dans ADV.' 
      +'Si vous voulez, vous pouvez le faire '
      + 'immédiatement en vous rendant sur ADV.'
      this.confirmationDialogService.confirm(title, comment, btnOkText,null,'sm', false)
      .then((confirmed) => this.destroy())
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
 

  destroy(){
      this.activeModal.close(true);
      this.back();
    } 
    back(){
      if (this.route.snapshot.queryParams['from'] === 'all') {
        this.router.navigate(['/customer-dashboard',  this.idCustomer , 'park-item', 'list-particular'],
        { queryParams: { typeCustomer: this.typeClient, from :  'all' }
        });
      } else if (this.route.snapshot.queryParams['from'] === 'dashboard') {
        this.router.navigate(['/customer-dashboard',
           'particular', this.idCustomer],
        { queryParams: { typeCustomer: this.typeClient ,from :  'dashboard'}
        });
      }

    }

  
}
