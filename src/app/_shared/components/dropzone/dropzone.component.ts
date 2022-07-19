import { Component} from '@angular/core';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent{
  files: File[] = [];
  onSelectFile(event: any): void {
    this.files = [];
    this.files.push(...event.addedFiles);
  }
  onRemoveFile(event: any): void {
    this.files.splice(this.files.indexOf(event), 1);
 
  }


}
