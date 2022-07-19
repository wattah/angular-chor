import { GassiMockLoginService } from './../../../_core/services';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found-document',
  templateUrl: './not-found-document.component.html',
  styleUrls: ['./not-found-document.component.scss']
})

export class NotFoundDocumentComponent implements OnInit {
  fileName: string;
  jiraUrl: string;

  /**
   * Constructeur
   * @param location localisation actuelle 
   * @param route ActivatedRoute
   */
  constructor(private readonly route: ActivatedRoute, 
              private readonly location: Location ,
              private readonly mockLoginService: GassiMockLoginService) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.fileName = queryParams.get('fileName');
    });
    this.mockLoginService.getJiraUrl().subscribe(
      (url)=> this.jiraUrl = url
    );
  }

  /**
   * retour à la page précédente
   */
  navigateBack(): void {
    this.location.back();
  }

}
