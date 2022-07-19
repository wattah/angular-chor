import { TaskAnwsersHolderService } from './../task-anwsers-holder.service';
import { TaskAnswerVO } from 'src/app/_core/models';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from '@ag-grid-community/core';
import { Component} from '@angular/core';
import { TaskAnswersService } from 'src/app/_core/services';

@Component({
  selector: 'app-task-completed-anwser-cell-render',
  templateUrl: './task-completed-anwser-cell-render.component.html',
  styleUrls: ['./task-completed-anwser-cell-render.component.scss'],
})
export class TaskCompletedAnwserCellRenderComponent implements ICellRendererAngularComp {
  tasksAnwsers: string[];
  constructor(private readonly taskAnswerService: TaskAnswersService , private readonly taskAnwsersHolderService: TaskAnwsersHolderService) { }
  
  agInit(params: ICellRendererParams): void {
    const taskId = params.data.id;
    this.tasksAnwsers = this.taskAnwsersHolderService.tasksAnwsers.get(taskId);
    if(!this.tasksAnwsers){
      this.getTaskAnwsers(taskId);
    }
  }
  private getTaskAnwsers(taskId: any) {
    this.taskAnswerService.getTasksAnswers([taskId]).subscribe(
      (taskAnswers) => {
        if (taskAnswers) {
          this.tasksAnwsers = taskAnswers.map(answer => this.formatAnwser(answer));
          this.taskAnwsersHolderService.holdAnwsers(taskId , this.tasksAnwsers);
        }
      });
  }

  refresh(params: any): boolean {
    return true;
  }

  formatAnwser(anwser: TaskAnswerVO): string{
    const value = anwser.value;
    const allValue = anwser.label+ ' : ' + value;
    return anwser.type === 'string' ? `${allValue}`: value
  }


}
