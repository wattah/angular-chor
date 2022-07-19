import { EntityBase } from './entity-base';

export interface TaskLight extends EntityBase {
    /**
     * nom du traiteur de la tache
     */
  name: string;
  id: number;
  firstName: string;
  lastName: string;
    
    /**
     * typology label
     */
  taskPending: string;
  /** */
  isPriority: boolean;

  remainingTime: number;
  /** */
  endDate: Date;
 
  createdDate: Date;

  currentTask: string;
  startDate: Date;  
  inChargeOfId: number;
  inChargeOfName: string;
  assignedToId: number;
  assignedToName: string;
  userIdToNotify: number;
  userNameToNotify: string;
  description: string;
  requestId: number;
  customerId: number;
  thetisTaskId: string;

  /**
   * New fields for TaskDetail
   */
  status: string;
  //description: string;
  resolutionComment: string;
  assignedToFirstName: string;
  assignedToLastName: string;
  userToNotifyFirstName: string;
  userToNotifyLastName: string;
  inChargeOfFirstName: string;
  inChargeOfLastName: string;

}
