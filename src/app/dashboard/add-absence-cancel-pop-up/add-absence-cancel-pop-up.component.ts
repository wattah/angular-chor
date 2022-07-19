import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-absence-cancel-pop-up',
  templateUrl: './add-absence-cancel-pop-up.component.html',
  styleUrls: ['./add-absence-cancel-pop-up.component.scss']
})

export class AddAbsenceCancelPopUpComponent implements OnInit {

  constructor(readonly activeModal: NgbActiveModal, private readonly route: Router, readonly location: Location) {
  }

  ngOnInit() {
  }

  goBack(): void {
    this.route.navigateByUrl('/absence-monitoring');
    this.activeModal.close();
  }

  destroy(): void {
    this.activeModal.close(true);
    this.route.navigateByUrl('/add-absence');
  }

}
