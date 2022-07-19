import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from './../../_core/services/notification.service';

@Component({
  selector: 'app-pop-up-messages-epcb',
  templateUrl: './pop-up-messages-epcb.component.html',
  styleUrls: ['./pop-up-messages-epcb.component.scss']
})
export class PopUpMessagesEpcbComponent implements OnInit, AfterViewInit {

  url;
  constructor(readonly notificationService: NotificationService, private readonly route: ActivatedRoute) {
    this.notificationService.notifyIsLivePage().subscribe(data => console.log('epbcb page', data));
  }

  ngOnInit() {
    this.route.paramMap.subscribe( params => {
      this.url = params.get('url');
    });
  }

  ngAfterViewInit(): void {
    this.notificationService.isLivePage(true);
  }

}
