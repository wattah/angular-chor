import { Component} from '@angular/core';

@Component({
  selector: 'app-toggle-link-task-completed-renderer',
  templateUrl: './toggle-link-task-completed-renderer.component.html',
  
})
export class ToggleLinkTaskCompletedRendererComponent{

  buttontext ="Voir les réponses de la clôture";
  toggleClosingResponse;
  private params: any;

  agInit(params: any): void {
    this.params = params;
  }

  LinkToggleClicked() {
    this.params.clicked(this.params.value);
    this.toggleClosingResponse=!this.toggleClosingResponse;
  }

}
