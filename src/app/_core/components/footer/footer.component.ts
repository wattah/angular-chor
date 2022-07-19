import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services';
import { NotificationService } from '../../services/notification.service';

/**
 * Composant contenant le pied de page
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  // la version de l'application 
  @Input()
  version: string;
  @Input() jiraUrl;
  // ajouter just pour fair fonctionner la html page de ABC
  opaqueId: string;

  constructor(readonly route: Router, readonly notificationService: NotificationService) { 
  }

  goToAbc(): void {
    this.notificationService.isLivePage(false);
  }

  ngOnInit(): void {
  }
}
