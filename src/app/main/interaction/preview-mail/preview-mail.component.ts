import { Component, OnInit, Input, AfterViewInit, AfterViewChecked, AfterContentChecked, AfterContentInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CONSTANTS } from '../../../_core/constants/constants';
import { MessageVO } from '../../../_core/models/message-vo';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';

@Component({
  selector: 'app-preview-mail',
  templateUrl: './preview-mail.component.html',
  styleUrls: ['./preview-mail.component.scss']
})
export class PreviewMailComponent implements OnInit, AfterViewInit {

  elRef: ElementRef;
  
  @Input() request: RequestCustomerVO;
  
  @Input() customerId: number;
  isEntreprise = false;
  typeCustomer: string;
  sentMail: MessageVO;

  docUrl: MediaStream;
  doc: any = document.implementation.createHTMLDocument('preview_mail');

  constructor(private route: ActivatedRoute, elRef: ElementRef) {
    this.elRef = elRef;
    this.sentMail = JSON.parse(localStorage.getItem('sentMail'));
  }

  ngOnInit(): void { 
    this.route.data.subscribe(resolversData => {
      this.request = resolversData['request'];
    });
    this.route.parent.paramMap.subscribe(params => {
      this.customerId = Number(params.get('customerId')); 
    });
    this.route.parent.queryParamMap.subscribe(params => {
      this.isEntreprise = (params.get('typeCustomer') === CONSTANTS.TYPE_COMPANY); 
    });
  }

  getDom(): void {
    this.doc.write(this.elRef.nativeElement.innerHTML);
    return this.doc;
  }

  printDom(filename, text): void {
   /* var printContents = document.getElementById('printDiv').innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;*/
  
    this.getDom();
   
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  ngAfterViewInit(): void {
    
    document.getElementById('link').click();

  }
}
