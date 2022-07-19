import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskAnwsersHolderService {
  tasksAnwsers = new Map<number, string[]>(); 
  holdAnwsers(taskId: number , taskAnswers: string[]) {
    this.tasksAnwsers.set(taskId , taskAnswers);
  }

  constructor() { }
}
