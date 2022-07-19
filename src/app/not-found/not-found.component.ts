import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  /**
   * Constructeur
   * @param location localisation actuelle 
   */
  constructor( private location: Location) { }

  ngOnInit(): void {
  }

  /**
   * retour à la page précédente
   */
  navigateBack(): void {
    this.location.back();
  }

}
