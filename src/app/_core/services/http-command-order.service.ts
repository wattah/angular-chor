import { CommandOrderLineVO } from './../models/command-order-line-vo';
import { HttpClient } from '@angular/common/http';
import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { CommandOrderVo } from '../models/command-order-vo';
import { CommandOrderResultVO } from '../models/command-order-result-vo';



@Injectable({
    'providedIn': 'root'
})
export class HttpCommandOrderService extends HttpBaseService<CommandOrderVo>{
    constructor(httpClient: HttpClient){
        super(httpClient, 'commandOrder')
    }

    checkIfACommandOrderExists(cartId: number){
        return this.httpClient.get<boolean>(`${environment.baseUrl}/${this.endpoint}/checkIfACommandOrderExists?cartId=${cartId}`);
    }


    saveCommandOrder(requestId: number, userId: number,fromGenerateCoOBtn: boolean, checkIsBlocked: boolean){
        return this.httpClient.get<CommandOrderResultVO>(`${environment.baseUrl}/${this.endpoint}/saveCommandOrder?requestId=${requestId}&userId=${userId}&fromGenerateCoOBtn=${fromGenerateCoOBtn}&checkIsBlocked=${checkIsBlocked}`);
    }

    getCommandOrderLinesByCOId(commandOrderId : number){
        return this.httpClient.get<CommandOrderLineVO[]>(`${environment.baseUrl}/${this.endpoint}/getCommandOrderLinesByCOId?commandOrderId=${commandOrderId}`); 
    }

    findLastComandOrderByCartId(cartId : number){
        return this.httpClient.get<CommandOrderResultVO>(`${environment.baseUrl}/${this.endpoint}/findLastComandOrderByCartId?cartId=${cartId}`); 
    }
    


}
