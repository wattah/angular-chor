import { Component , Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-progressbar-modal-comp ',
  template: `
    <div id="ac90819em1" class="modal-header">
      <h5 id="ac90819h41" class="modal-title"> Expiration de la session </h5>
    </div>
    <div id="ac90819di1" class="modal-body">
      Il vous reste  {{ (countMinutes !== 0 ? + countMinutes+' Minute'+(countMinutes > 1 ? 's ' : ' ') : '') 
                      + countSeconds+' secondes, ' }} 
      et vous serez déconnecté automatiquement
      <p>
        <ngb-progressbar type="danger" [value]="progressCount" [max]="300" animate="false" id="ac90819ou1"
                         class="progress-striped active">
        </ngb-progressbar>
      </p>
    </div>
    <div id="ac90819di2" class="modal-footer">
      <a [routerLink]=""  (click)="logout()">Se déconnecter</a> &nbsp;
      <button type="button" id="ac90819bu1" class="btn btn-primary" (click)="continue()">Annuler</button>
    </div>
  `
})
export class ProgressBarModalComponent {

  @Input() countMinutes: number;
  @Input() countSeconds: number;
  @Input() progressCount: number;

  constructor(public activeModal: NgbActiveModal) {
  }
  continue() {
    this.activeModal.close(null);
  }
  logout() {
    this.activeModal.close('logout');
  }
}

