import { Component, Input, OnInit } from '@angular/core';
import { CustomerParcLigneDetailVO } from '../../../../_core/models/customer-parc-ligne-detail-vo';
import { UnlockParkItemPopUpComponent } from '../../pop-up/unlock-park-item-pop-up/unlock-park-item-pop-up.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuspendParkItemPopUpComponent } from '../../pop-up/suspend-park-item-pop-up/suspend-park-item-pop-up.component';
import { ActivateParkItemPopUpComponent } from '../../pop-up/activate-park-item-pop-up/activate-park-item-pop-up.component';
import { DeleteParkItemPopUpComponent } from '../../pop-up/delete-park-item-pop-up/delete-park-item-pop-up.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-park-item-general-informations',
  templateUrl: './park-item-general-informations.component.html',
  styleUrls: ['./park-item-general-informations.component.scss']
})
export class ParkItemGeneralInformationsComponent implements OnInit{
  

  @Input() parcItemLigneDetail:CustomerParcLigneDetailVO;
 

  constructor(readonly  modalService: NgbModal,
    private readonly route: ActivatedRoute,){
  }
  customerId : string;
  ngOnInit(): void{
    this.route.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
    });
  }
 
  unlockCustomerParkItem(idCustomerParkItem: number){
    const modalRef = this.modalService.open(UnlockParkItemPopUpComponent, { centered: true });
    modalRef.componentInstance.idCustomerParkItem = idCustomerParkItem;
  }
  suspendLigne(idCustomerParkItem: number){
    const modalRefSuspendLine = this.modalService.open(SuspendParkItemPopUpComponent, { centered: true });
    modalRefSuspendLine.componentInstance.idCustomerParkItem = idCustomerParkItem;
  }
  activateLigne(idCustomerParkItem: number){
    const modalRefSuspendLine = this.modalService.open(ActivateParkItemPopUpComponent, { centered: true });
    modalRefSuspendLine.componentInstance.idCustomerParkItem = idCustomerParkItem;
  }

  deleteCustomerParkItem(idCustomerParkItem: number){
    const modalRefDeleteCustomerParkItem = this.modalService.open(DeleteParkItemPopUpComponent, { centered: true });
    modalRefDeleteCustomerParkItem.componentInstance.idCustomerParkItem = idCustomerParkItem;
  }


  isCodeContratInListUnlockForfait(codeContract: string): boolean{
    const unlockAutorizeOffer: Array<string> = ['5HD16', '5HD17', '5HD18','5HD19','5HD20'];
    if(unlockAutorizeOffer.includes(codeContract)){
        return true;
      }
    return false;
  }
  
}
