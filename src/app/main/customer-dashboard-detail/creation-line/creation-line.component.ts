import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
 

@Component({
  selector: 'app-creation-line',
  templateUrl: './creation-line.component.html',
  styleUrls: ['./creation-line.component.scss']
})
export class CreationLineComponent implements OnInit {

  customerId: string;
  isUpdate = false;

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) { }

  ngOnInit() {
    this.route.parent.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });  
    if(this.route.snapshot.queryParams['modificationLine'] === 'true'){
       this.isUpdate = true
      }
    if(this.route.snapshot.queryParams['modificationLine'] === 'false'){
      this.isUpdate = false
      }
  }


changeStepper(stepperName){
  const href =   this.router.url;
  return href.includes(stepperName);
}
 
}
