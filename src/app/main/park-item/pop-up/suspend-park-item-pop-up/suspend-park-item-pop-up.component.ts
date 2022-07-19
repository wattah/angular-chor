import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ParcLigneService } from '../../../../_core/services/parc-ligne.service';
import { ConfirmationDialogService } from '../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
@Component({
  selector: 'app-suspend-park-item-pop-up',
  templateUrl: './suspend-park-item-pop-up.component.html',
  styleUrls: ['./suspend-park-item-pop-up.component.scss']
})
export class SuspendParkItemPopUpComponent implements OnInit {

  @Input() idCustomerParkItem: number;
  messageError = "Erreur Serveur : Une erreur technique inattendue est surevenue.";
  transactionError = "Transaction rolled back because it has been marked as rollback-only";
  

  idCustomer: string;
  typeClient: string;


  constructor(readonly parcLigneService: ParcLigneService, 
    readonly  modalService: NgbModal, 
    readonly activeModal: NgbActiveModal,
    readonly router: Router,
    readonly confirmationDialogService: ConfirmationDialogService,
    readonly location: Location,
    readonly route: ActivatedRoute
    ) { 
    
      
  }

  ngOnInit() {
    this.route.root.firstChild.firstChild.paramMap.subscribe( (params: ParamMap) => {
      this.idCustomer = params.get('customerId');
    });
    this.route.paramMap.subscribe( (params: ParamMap) => {
      this.typeClient = this.route.snapshot.queryParamMap.get('typeCustomer');
    });
  }

  
  suspendLine(){ 
    this.parcLigneService.suspendOrActiveLine(this.idCustomerParkItem,true).subscribe(
       data => {
        this.openConfirmationDialog('Ligne suspendue dans ADV.');
         
       },
       (error) => {
        this.activeModal.close(true);
        if (error.error.error !== '' && error.error.message !== this.transactionError) {
          this.openConfirmationDialog('Erreur Serveur : '+error.error.message); 
       } else {
          this.openConfirmationDialog(this.messageError);
       }
       
       
       
      }
       
       );
      
     }

    openConfirmationDialog(message: string): any {
       //r.rowData
       const title = 'Erreur';
       const btnOkText = 'OK';
       this.confirmationDialogService.confirm(title, message, btnOkText,null,'lg', false)
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
        { queryParams: { typeCustomer: this.typeClient, from: 'all'}
        });
      } else if (this.route.snapshot.queryParams['from'] === 'dashboard') {
        this.router.navigate(['/customer-dashboard',
           'particular', this.idCustomer],
        { queryParams: { typeCustomer: this.typeClient , from: 'dashboard'}
        });
      }

    }

}
