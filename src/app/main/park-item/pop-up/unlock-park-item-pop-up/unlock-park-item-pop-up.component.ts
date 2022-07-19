import { Component, OnInit, Input } from '@angular/core';
import { ParcLigneService } from '../../../../_core/services/parc-ligne.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ConfirmationDialogService } from '../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-unlock-park-item-pop-up',
  templateUrl: './unlock-park-item-pop-up.component.html',
  styleUrls: ['./unlock-park-item-pop-up.component.scss']
})
export class UnlockParkItemPopUpComponent implements OnInit {
  
  @Input() idCustomerParkItem: number;

  idCustomer: number;
  typeClient: string;
 
  constructor(readonly parcLigneService: 
    ParcLigneService, 
    readonly  modalService: NgbModal,
     readonly activeModal: NgbActiveModal,
     readonly router: Router,
    readonly location: Location,
    readonly confirmationDialogService: ConfirmationDialogService,
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

  unlockParkItem(){ 
     this.parcLigneService.unlockCustomerParkItem(this.idCustomerParkItem).subscribe(
        data => {
          this.destroy();
        },
        (error) => {
    
          this.activeModal.close(true);
          this.openConfirmationDialog('Erreur Serveur : Une erreur technique inattendue est surevenue.');
          
           
          
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
          { queryParams: { typeCustomer: this.typeClient, from: 'all'}
          });
        } else if (this.route.snapshot.queryParams['from'] === 'dashboard') {
          this.router.navigate(['/customer-dashboard',
             'particular', this.idCustomer],
          { queryParams: { typeCustomer: this.typeClient, from: 'dashboard' }
          });
        }

      }
}
