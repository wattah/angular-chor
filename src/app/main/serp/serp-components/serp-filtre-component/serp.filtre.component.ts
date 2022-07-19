import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Composant contenant le tableau de la recherche
 */
@Component({
  selector: 'app-serp-filtre',
  templateUrl: './serp.filtre.component.html',
  styleUrls: ['./serp.filtre.component.scss']
})
export class SerpFiltreComponent {

  expanded = false;

  showHelp = false;

  /**
   * la liste des personnes et des produits à afficher
   */
  @Input()
  persons = [];

  @Input()
  searchPattern = ''; 
  @Input() totalItems: Number = 0;

  @Input() totalMemberItems: Number = 0;

  @Input() totalNonMemberItems: Number = 0;

  @Input() totalContacts: Number = 0;

  @Input() totalInterlocutors: Number = 0;

  @Input() totalResilies: Number = 0;
  @Input() totalProducts: Number = 0;
  @Input() totalProscpects: Number = 0;

  type: String = 'all';
  
  @Output() clickMenuItem: EventEmitter<String> = new EventEmitter();

  clickItem(t: String): void {
    this.type = t;
    this.clickMenuItem.emit(this.type);
  }
  
  expandSousMenu(): void {
    this.expanded = !this.expanded; 
  }
}
