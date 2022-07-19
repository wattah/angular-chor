import { CommandOrderVo } from './command-order-vo';

export interface CommandOrderResultVO {
    
  commandOrder: CommandOrderVo;
  errorOrInfosMessage: string;

}