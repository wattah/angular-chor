import { Component, OnInit, Input } from '@angular/core';
import { ParcLigneService } from '../../../../_core/services/parc-ligne.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ConfirmationDialogService } from '../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-delete-park-item-pop-up',
  templateUrl: './delete-park-item-pop-up.component.html',
  styleUrls: ['./delete-park-item-pop-up.component.scss']
})
export class DeleteParkItemPopUpComponent implements OnInit {

  @Input() idCustomerParkItem: number;
   
  idCustomer: number;
  typeClient: string;


  constructor(readonly parcLigneService: ParcLigneService, 
    readonly  modalService: NgbModal, 
    readonly activeModal: NgbActiveModal,
    readonly location: Location,
    readonly router: Router,
    readonly confirmationDialogService: ConfirmationDialogService,
    readonly route: ActivatedRoute
    
    ) { }

  ngOnInit() {
   
     this.route.root.firstChild.firstChild.paramMap.subscribe( (params: ParamMap) => {
      this.idCustomer = Number(params.get('customerId'));
    });
    this.route.paramMap.subscribe( (params: ParamMap) => {
      this.typeClient = this.route.snapshot.queryParamMap.get('typeCustomer');
    });
  }


      deleteLine(){ 
        this.parcLigneService.deleteCustomerParkItem(this.idCustomerParkItem).subscribe(
           data => {
            
              this.destroy();
             
           },
           (error) => {
    
            this.activeModal.close(true);
            const errorMsg = error.error.message;
            this.openConfirmationDialog(`Erreur Serveur : ${errorMsg}`);
           
           
          }
           
           );
          
         }
   
        openConfirmationDialog(message: string): any {
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
          { queryParams: { typeCustomer: this.typeClient,
          
             from: 'all'
            }
          });
        } else if (this.route.snapshot.queryParams['from'] === 'dashboard') {
          this.router.navigate(['/customer-dashboard',
             'particular', this.idCustomer],
          { queryParams: { typeCustomer: this.typeClient ,from: 'dashboard'}
          });
        }

      }
}
