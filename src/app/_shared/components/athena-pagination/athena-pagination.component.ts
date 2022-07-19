import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-athena-pagination',
  templateUrl: './athena-pagination.component.html',
  styleUrls: ['./athena-pagination.component.scss']
})
export class AthenaPaginationComponent {

  @Input() totalPages: number;

  @Output() goToPage = new EventEmitter<number>();

  @Input() currentPage = 1;

  goToPageClick(page: number): void {
    this.goToPage.emit(page);
  }
}
