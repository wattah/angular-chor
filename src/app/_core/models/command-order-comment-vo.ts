import { UserVo } from './user-vo';
import { CommandOrderVo } from './command-order-vo';

export interface CommandOrderCommentVO {
    id: number;
    createdDate: Date;
    modifiedAt: Date;
    user: UserVo;
    commandOrder: CommandOrderVo;
    commentType: number;
    comment: string;
  }
