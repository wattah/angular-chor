import { UserVo } from './user-vo';
import { Status } from './status';
import { CommandOrderVo } from './command-order-vo';


export interface CommandOrderLineVO {
    id: number;
    commandOrder: CommandOrderVo;
    status: Status;
    createdDate: Date;
    modifiedAt: Date;
    user: UserVo;
    cartItemId: number;
    articleOrangeReference: string;
    articleOrderedQuantity: number;
  }
