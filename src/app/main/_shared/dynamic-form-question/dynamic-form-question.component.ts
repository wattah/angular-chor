import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { FormFieldVO } from '../../../_core/models/FormFieldVO';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowService } from '../../../_core/services/workflow.service';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { QuestionControlService } from '../../../_core/services/question-control.service';
import { FormVariableSubmittedVO } from '../../../_core/models/FormVariableSubmittedVO';

@Component({
  selector: 'app-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.scss']
})
export class DynamicFormQuestionComponent implements OnInit {

  answers: { [k: string]: any } = { "variables": {} }
  isBooleanSend: { [k: string]: any } = { "variables": {} }
  questionsBooleanOnly = [];
  @Input()
  questions: FormFieldVO[];
  @Input()
  taskId: string;
  @Input() requestInstanceId: string;
  @Input() idAthenaTask: number;
  @Output()
  getNextTasks: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  outputResponses: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();
  form: FormGroup;
  payLoad = '';
  formData = false;
  formSubmitDone = new EventEmitter();
  deleteAnswers: boolean;
  startDate: any;
  disableQuestion = false;
  reponses: string[] = [];
  responseOfquestion:any;
  objectKeys = Object.keys;
  SubmittedVaule: any ;

  constructor(private questionControlService: QuestionControlService, 
  private workflowService: WorkflowService,
  private route: ActivatedRoute,
  private router: Router) {
  }

  ngOnInit() {
    this.formData = true;
    this.onVariablesDone();
  }


  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    if (this.deleteAnswers === true) {
      this.answers = {};
    }
    if (this.questions !== null && this.questions.length !== 0 && this.deleteAnswers === false) {
      this.onVariablesDone();
    }
  }

    /**
   * teste si le champ question est vide, sinon on fait le submit et on grise
   * @param event 
   */
  onValidSubmit(event: any,question: FormFieldVO) {
    const variableSubmitted: FormVariableSubmittedVO = {} as FormVariableSubmittedVO;
    variableSubmitted.value = this.form.value[question.id];
    variableSubmitted.type = question.typeName;
    if (question.typeName != 'enum'){
      if(isNullOrUndefined(variableSubmitted.value) || variableSubmitted.value === ""){
        return;
      }
    }
    this.onSubmit(event, false);
  }
  
  /**
   * envoyer les reponses de l'utilisateur
   * @param event 
   */
  // le paramètre isFromBoolean est à true seulement donc le cas de changement d'un boolean 
 //  dans le  cas des userTasks qui contient des questions (FormField) boolean 
 //avec (autres types : enum, String, long);
  // dans ce cas de gestion les autres questions qui sont # de boolean qui jugent l'envoi de la question 
  // par exemple une userTask qui contient un boolean et deux enums
  // si l'utilisateur a répondu (une seule fois) aux questions de type enum dans ce cas là 
  // les réponses seront  envoyé à camunda  quelque soit le cas pour la question boolean (répondu ou non)
  // donc si par la suite l'utilisateur réponds ou bien change la réponse du boolean
  // on ne va pas renvoyer la réponse à camunda (dèja on avancé sur le parcours) mais on va 
  // mis à jour la réponse du boolean sur athena
  onSubmit(event: any, isFromBoolean) {
    // le paramètre isBooleanOnly pour checker si une userTask contient que des questions booleans (au moins une) 
    let isBooleanOnly = true;
    this.reponses = [];
     // pour desactiver le composant pour chaque reponse
     if(!isNullOrUndefined( event.target)){
      event.target.disabled = true;
     }
   
     //flag pour verifier est ce que l'utilisateur repond à toutes les questions 
    let isNotAllReplied = false;
     // on verifier si toutes les reponses sont remplir par l'utilisateur
    for (let question of this.questions) { 
      // puisque l'utilisateur peut répondre autant de fois pour le type boolean
      // et puisque on doit envoyer seulement une fois la réponse dans le cas d'un 
      // userTask qui contient que des booleans (la valeur de boolean ne décide pas le gatway du parcours )
      // camunda besoin d'une réponse pour avancer mais on peux pas envoyer plusieurs réponses pour la même 
      // userTask donc ce variable  this.isBooleanSend utilsé pour tracé les booleans qui sont dèja envoyés
      // et ne pas renvoyer la réponse lorsque l'utilisateur a changé la réponse (recocher le checkbox)
      this.isBooleanSend.variables[question.id] = true;
      const variableSubmitted: FormVariableSubmittedVO = {} as FormVariableSubmittedVO;
        this.SubmittedVaule = variableSubmitted;
        variableSubmitted.value = this.form.value[question.id];
        variableSubmitted.type = question.typeName;
        this.answers.variables[question.id] = variableSubmitted;
        // Si le type du quesion (FormFieldVO) 
        // est un enum (donc le user Task (TaskVo qui contient l'ensemble des FormFieldVOs ==> Question)
        // ne contient pas que les booleans)
        if (question.typeName === 'enum' ) {
            isBooleanOnly = false;
            this.isBooleanSend.variables[question.id] = false;
            variableSubmitted.type = 'String';
            // si la réponse de la question est null or undefined 
            // on met le flag isNotAllReplied à true pour ne pas envoyer les réponses à Thétis
            // si non on afiche la réponse 
            if(isNullOrUndefined(question.type.values[variableSubmitted.value])) {
              isNotAllReplied = true;
              continue;
            } else {
              question.displayResponse = question.type.values[variableSubmitted.value].split("--")[1];
            }
         }
         // si le type de la question est un  boolean 
         // on s'en fiche si l'utilisateur à répondu ou non 
         // car  les réponses aux questions de type « boolean »  seront utilisé 
         //qu’à des fins de traçage et en aucun cas à des fins d’avancement du jeton dans Thétis 
         //(à l'exception d'un userTask qui contient que des boolean on a besoin d'une réponse pour avancer mais
         // la réponse ne juge pas le gatway quelque soit la réponse )
         //c’est à dire d’orientation du parcours derrière une gateway.
         // donc on va pas bloquer l'envoi des réponses à Thétis ( isNotAllReplied)
         // si l'utilisateur n'as pas répondu 
         // on envoi le default value (la valeur paramétré sur le modeler)
         //la première fois si la task contient que les types booleans 
         //NB : pour les qts boolean l'utilisateur peut cocher et décocher autant de fois
         // (c'est pas bloqué comme le cas des autres types de qts )
         else if (question.typeName === 'boolean'){
          if(isNullOrUndefined(question.displayResponse) || variableSubmitted.value === "") {
            variableSubmitted.value = question.defaultValue;
           }
           question.displayResponse = variableSubmitted.value
         }
         else {
          if(isNullOrUndefined(variableSubmitted.value) || variableSubmitted.value === "") {
            isNotAllReplied = true;
            continue;
          } else {
            question.displayResponse = variableSubmitted.value;
          }
         }
      }

      //alimenter la liste des reponses (si l'utilisateur saiser toutes les questions)
      if(!isNotAllReplied) {
        for (let question of this.questions) {
          const variableSubmitted: FormVariableSubmittedVO = {} as FormVariableSubmittedVO;
            this.SubmittedVaule = variableSubmitted;
            variableSubmitted.value = this.form.value[question.id];
            variableSubmitted.type = question.typeName;
            this.answers.variables[question.id] = variableSubmitted;
            if (question.typeName === 'enum') {
                variableSubmitted.type = 'String';
                question.displayResponse = question.type.values[variableSubmitted.value].split("--")[1];
                this.reponses.push(question.type.values[variableSubmitted.value].split("--")[1]);
                
             } 
             else {
              if (question.typeName === 'boolean'){
                if(isNullOrUndefined(question.displayResponse) || variableSubmitted.value === "") {
                  variableSubmitted.value = question.defaultValue;
                 }
              } 
              this.reponses.push(variableSubmitted.value);
              question.displayResponse = variableSubmitted.value;
             
            }
          }
      }

        // envoyer les reponses vers camunda  
      if(!isNotAllReplied) {
          this.disableQuestion = true;
          //   if(!isFromBoolean ||  (isBooleanOnly && !isSent ))
          // true dans le cas ou on a que des booleans dans le userTask -isBooleanOnly =true )
          //et que c'est la première qu'on va envoyer une réponse isSent = false
          // ou dans le cas que on a plusieurs types de questions mais on essaye pas de changer la 
          // valeur d'un boolean isFromBoolean = false
          const isSent = this.questionsBooleanOnly.find(id => id === this.isBooleanSend.variables);
          if(!isFromBoolean ||  (isBooleanOnly && !isSent )) {
            this.questionsBooleanOnly.push(this.isBooleanSend.variables);
            this.workflowService.submitCamundaForm(this.taskId, this.idAthenaTask, this.requestInstanceId, this.answers).subscribe(data => {
              this.getNextTasks.emit(true);
              this.outputResponses.emit(this.reponses);
            });
            isBooleanOnly = false;
          }
          else{
            this.outputResponses.emit(this.reponses);
          }
         
    }
  }

  onVariablesDone(): void {
    if (!isNullOrUndefined(this.questions)) {
      this.form = this.questionControlService.toFormGroup(this.questions);
      this.formData = true;
    }
  }

  getLabelQuestion(question: FormFieldVO): string {
    return question.label ? question.label : '';
  }

} 