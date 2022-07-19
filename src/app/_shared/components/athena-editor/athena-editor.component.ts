import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-athena-editor',
  templateUrl: './athena-editor.component.html',
  styleUrls: ['./athena-editor.component.scss']
})
export class AthenaEditorComponent {
  
  @Input() editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '15rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: '',
    defaultParagraphSeparator: '',
    defaultFontName: 'Georgia',
    defaultFontSize: '2',
    uploadUrl: 'v1/image',
    uploadWithCredentials: true,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['strikeThrough', 'subscript', 
        'superscript', 'heading', 'fontName'],
      [
        'fontSize',
        'backgroundColor',
        'heading',
        'fontName',
        'customClasses',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'toggleEditorMode'
      ]
    ]
  };

  @Output() changeTextHtml = new EventEmitter();

  @Input() model;

  getText(textHtml: any): void {
    this.changeTextHtml.emit(textHtml);
  }
}
