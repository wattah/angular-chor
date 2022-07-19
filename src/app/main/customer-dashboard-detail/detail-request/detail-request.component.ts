import { isNullOrUndefined } from 'src/app/_core/utils/string-utils';
import { CartService } from './../../../_core/services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concat } from 'rxjs';
import { WorkflowService } from '../../../_core/services/workflow.service';
import { CONSTANTS, COLOR_TYPE_CUSTOMER } from '../../../_core/constants/constants';
import { InteractionLight } from '../../../_core/models/interaction-vo';
import { RequestAnswersVO } from '../../../_core/models/request-answers-vo';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { RequestDetailsService } from '../../../_core/services/request-details.service';
import { stringToBoolean } from '../../../_core/utils/string-utils';
import { DocumentVO } from '../../../_core/models/models';
import { CartCreationService } from '../../cart/cart/cart-creation.service';
import { TaskLight } from '../../../_core/models/task-customer-vo';
@Component({
  selector: 'app-detail-request',
  templateUrl: './detail-request.component.html',
  styleUrls: ['./detail-request.component.scss']
})
export class DetailRequestComponent implements OnInit {

  detailRequest: RequestCustomerVO;
  requestAnswers: RequestAnswersVO[];
  interactions: InteractionLight[];
  idRequest: Number;
  firstId: Number;
  lastId: Number;
  customerId: string;
  idRequestNavigated: Number;
  isEntreprise: boolean;
  typeCustomer: string;
  isDetailRecovery: boolean

  idRequestsList: Number[];
  selectedStatusList: string[];
  selectedTypesList: Number[];
  isDetailRequestReady: boolean = false;
  
  //isClosedRequest : verifie si la demande est cloture
  isClosedRequest : boolean;
  
  //isClosed : verifie si tous les taches de la demande sont clotures
  isClosed : boolean ;

  cartHasBlockedItem : boolean;
  documents: DocumentVO;
  inProgressTasks: TaskLight[];
  completedTasks: TaskLight[];

  homologationsIds: number[];

  idsRequestsOfCustomer : Number[];
  customerDashboard =  '/customer-dashboard';

  constructor(private route: ActivatedRoute,
    private requestDetailsService: RequestDetailsService, private readonly workflowService: WorkflowService,
    private readonly router: Router,
    private readonly cartCreationService:CartCreationService,
    private readonly cartService: CartService
    ) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
     }

  ngOnInit(): void {
    this.isDetailRecovery = stringToBoolean(this.route.snapshot.queryParamMap.get('isDetailRecovery'));
    this.route.data.subscribe(resolversData => {


      this.detailRequest = resolversData['detailRequest'];
      this.inProgressTasks = this.getInProgressTasks();
      this.completedTasks = this.getCompletedTasks();
      this.cartCreationService.restoreDetailRequest(this.detailRequest);
      if (this.detailRequest !== null && this.detailRequest.interactions !== null) {
        this.interactions = this.detailRequest.interactions;
      }

      this.requestAnswers = resolversData['requestAnswers'];

      this.documents = resolversData['documents'];
      this.homologationsIds = resolversData['homologationsIds'];

      this.route.parent.paramMap.subscribe(params => {
        this.customerId = params.get('customerId');
        this.isDetailRequestReady = true;
      });
    });

    this.route.queryParamMap.subscribe(params => this.typeCustomer = params.get('typeCustomer'));
    this.isEntreprise = (this.typeCustomer === CONSTANTS.TYPE_COMPANY);
    this.route.parent.queryParams.subscribe((params) => {
      this.idRequestsList = params['requestList'];
    });
    
    if (this.idRequestsList != null && this.idRequestsList.length > 0) {
      this.lastId = Number(this.idRequestsList[this.idRequestsList.length - 1]);
      this.firstId = Number(this.idRequestsList[0]);
    } else {
      concat(this.route.parent.paramMap, this.route.parent.queryParams).subscribe((params) => {
        this.selectedStatusList = params['selectedStatusList'];
        this.selectedTypesList = params['selectedTypesList'];
        this.customerId = params.get('customerId');
        this.requestDetailsService.getIdsRequestByIdCustomer(this.customerId, this.selectedStatusList, this.selectedTypesList
          , this.isEntreprise).subscribe(data => {
            if (data !== null) {
              this.idsRequestsOfCustomer = data;
              this.lastId = data[data.length - 1];
              this.firstId = data[0];
            }
          });
      }); 
    }
    
    this.cartService.getIfCartHasBlockedItemByRequestId(this.detailRequest.idRequest).subscribe(data => {
      this.cartHasBlockedItem = data;
    });
  }
  getCompletedTasks() {
    if(this.detailRequest && this.detailRequest.tasks ){
      return this.detailRequest.tasks.slice().filter(task=> task.status !== 'ASSIGNED');
    }
    return [];
  }
  getInProgressTasks() {
    if(this.detailRequest && this.detailRequest.tasks ){
      return this.detailRequest.tasks.slice().filter(task=> task.status === 'ASSIGNED');
    }
    return [];
  }

  ngDoCheck() {
    this.isDetailRecovery = stringToBoolean(this.route.snapshot.queryParamMap.get('isDetailRecovery'));
  }

  getArrowLeftClass(): string {
    return (this.firstId === this.detailRequest.idRequest) ? 'arrow-left-grey' : 'arrow-left-blue';
  }

  getArrowRightClass(): string {
    return (this.lastId === this.detailRequest.idRequest) ? 'arrow-right-grey' : 'arrow-right-blue';
  }

  getPreviousOrNextRequestId(next: Boolean): void {
    //Si on vient de la fiche 360
    if (this.idRequestsList != null && this.idRequestsList.length > 0) {
      let currentPosition = this.idRequestsList.findIndex(idRequestCurrent => idRequestCurrent == this.detailRequest.idRequest);
      if (next) {       //si on va a la page suivante
        this.idRequestNavigated = this.idRequestsList[currentPosition + 1];
      } else {      //si on va a la page précédente
        this.idRequestNavigated = this.idRequestsList[currentPosition - 1];
      }
        this.router.navigate(
        [
          this.customerDashboard,
          this.customerId,
          'detail',
          'request',
          this.idRequestNavigated
        ],
        {
          queryParams: { requestList: this.idRequestsList, isDetailRecovery: false },
          queryParamsHandling: 'merge'
        }
      );
    } else {
      let currentPosition = this.idsRequestsOfCustomer.findIndex(idRequestCurrent => idRequestCurrent == this.detailRequest.idRequest);
      if (next) {       //si on va a la page suivante
        this.idRequestNavigated = this.idsRequestsOfCustomer[currentPosition + 1];
      } else {      //si on va a la page précédente
        this.idRequestNavigated = this.idsRequestsOfCustomer[currentPosition - 1];
      }
      
      this.router.navigate(
        [
          this.customerDashboard,
          this.customerId,
          'detail',
          'request',
          this.idRequestNavigated
        ],
        {
          queryParamsHandling: 'merge'
        }
      );      
    }
  }

//permet de recevoir le isClosedRequest du detail-request-summary
  getIsClosedRequestResume(isClosedRequest){
 this.isClosedRequest = isClosedRequest
  }
//permet de recevoir le isClosedRequest du detail-request-summary
  getIsClosedResume(isClosed){
    this.isClosed = isClosed ;
  }

  getClassEnvByTypeCustomer(): string {
    return `env-${COLOR_TYPE_CUSTOMER[this.typeCustomer]}`;
  }
}
