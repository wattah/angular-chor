import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TaskVo } from '../../../_core/models';
import { DateFormatPipeFrench } from '../../../_shared/pipes';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { Router } from '@angular/router';

const FORMAT_HEURE_H_MIN = "HH'h'mm";

@Component({
  selector: 'app-task-summary',
  templateUrl: './task-summary.component.html',
  styleUrls: ['./task-summary.component.scss']
})
export class TaskSummaryComponent {

  @Input() task: TaskVo;
  @Input() customerId: number;
  @Input() idRequest: number;
  @Input() toNextTasks : boolean;
  @Input() isFromCri = false;
  @Output() saveCri: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private readonly dateFormatPipeFrench: DateFormatPipeFrench,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly router: Router, private readonly datePipe: DatePipe) {

  }

  dateFormatter(dateIn) :string{
    {
      if (dateIn === 'null' || dateIn == null) {
        return '-';
      }
      const createHourAndMin = this.datePipe.transform(dateIn , FORMAT_HEURE_H_MIN);
      const date = this.dateFormatPipeFrench.transform(dateIn,'dd MMM yyyy');
      return `${date} - ${createHourAndMin}`;
    }
  }
 
  /**
   * @author fsmail
   * Cette methode est ajouté 
   * pour conditionner le retour vers la tâche 
   * depuis un CRI
   */
  navigateTask(){
    if(this.isFromCri){
         const title = 'Reour';
          const comment = 'Vous avez effectué des modifications. Voulez-vous les enregistrer ?';
          const btnOkText = 'Oui';
          const btnCancelText = 'Non';
          this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText, 'lg',true)
          .then((confirmed) => {
              if(confirmed) {
                this.saveCri.emit(true);
              }
              else{
                this.forwardToTaskDetail();}
           })
          .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));}
    else{
       this.forwardToTaskDetail();
    }
  }
  forwardToTaskDetail(){
    this.router.navigate(
      ['/customer-dashboard', this.customerId,'request', this.idRequest, 'task-details',this.task.id],
   {
      queryParamsHandling: 'merge'
    }
  );
  }
}
  

