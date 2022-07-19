

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommandOrderVo } from 'src/app/_core/models/command-order-vo';
import { ConfirmationDialogService } from 'src/app/_shared/components/confirmation-dialog/confirmation-dialog.service';
import { CartService } from 'src/app/_core/services/cart.service';
import { HttpCommandOrderService } from 'src/app/_core/services/http-command-order.service';
import { CatalogeService } from 'src/app/_core/services/http-catalog.service';

@Injectable({
    providedIn: 'root'
  })
  export class TabLogisticsProcessingService { 

    constructor( private readonly _snackBar: MatSnackBar, private readonly router: Router, 
        private readonly confirmationDialogService: ConfirmationDialogService,
        private readonly catalogService: CatalogeService,) {}

        //, successCallBack: Function
    showPopUpDeleteCommandOrder(co: CommandOrderVo, successCallBack: Function): void {
        const btnOkText = 'Oui, je le veux';
        const btnCancelText = 'Non, je ne veux pas';
        const comment = 'Êtes-vous sûr de vouloir supprimer l\'ordre de commande ? ';
        
        this.confirmationDialogService.confirm('', comment, btnOkText, btnCancelText)
        .then(
            (confirmed) => {
                if (confirmed) {
                    this.deleteCommandOrder(co.id, co.status,(newData) => successCallBack(newData)); //, () => successCallBack()
                   
                }
            }              
        );
    }

    deleteCommandOrder(coId: number, coStatus : string, successCallBack: Function): void { //, successCallBack: Function
        this.catalogService.deactivateCommandOrder(coId,coStatus).subscribe(
          _data => {
            console.log(" deleteCommandOrder    _data ====>> " , _data );
            this.openSnackBar('L\'ordre de commande a été supprimé');
            successCallBack(_data); 
          },
          _error => this.confirmationDialogService
            .confirm('', 'Erreur Technique : La suppression n\'est pas éffectuée. Veuillez réessayer ultérieurement', 'Ok', null, 'lg', false)
        );
    }

    openSnackBar(text: string): void {
        this._snackBar.open(
          text, undefined, 
          { duration: 3000, panelClass: ['center-snackbar', 'snack-bar-container'] });
    }

    showPopUpDeliverCommandOrder(coId: number, successCallBack: Function): void {
      const btnOkText = 'Oui, je le veux';
      const btnCancelText = 'Non, je ne veux pas';
      const comment = 'Êtes-vous sûr de vouloir livrer l\'ordre de commande ? ';
      
      this.confirmationDialogService.confirm('', comment, btnOkText, btnCancelText)
      .then(
          (confirmed) => {
              if (confirmed) {
                  this.deliverCommandOrder(coId, (data) => successCallBack(data)); //, () => successCallBack()
                 
              }
          }              
      );
    }

    deliverCommandOrder(coId: number, successCallBack: Function): void {
      this.catalogService.deliverCommandOrder(coId).subscribe(
        _data => {
          console.log(" deliverCommandOrder     _data =========>>> " , _data);
          this.openSnackBar('L\'ordre de commande a été livré');
          successCallBack(_data); 
        },
        _error => this.confirmationDialogService
          .confirm('', 'Erreur Technique : La livraison n\'est pas éffectuée. Veuillez réessayer ultérieurement', 'Ok', null, 'lg', false)
      );
  }

  }