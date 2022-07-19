import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators'
import { Router, ActivatedRoute } from '@angular/router';

export interface Products {
  nameProduct: string;
}

@Component({
  selector: 'app-products-catalogue',
  templateUrl: './products-catalogue.component.html',
  styleUrls: ['./products-catalogue.component.scss']
})
export class ProductsCatalogueComponent implements OnInit {

  customerId: string;
  textSearchControl = new FormControl();
  nomenclature1 = new FormControl();
  options: Products[] = [
    {nameProduct: 'Iphone 56g'},
    {nameProduct: 'Iphone 120g'}
  ];
  filteredOptions: Observable<Products[]>;
  totalPages = 5;
  currentPage = 1;
  constructor (
    private readonly router: Router,
    private readonly route: ActivatedRoute  ) { }

  ngOnInit() {
    this.filteredOptions = this.textSearchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nameProduct),
        map(nameProduct => nameProduct ? this._filter(nameProduct) : this.options.slice())
      );
  }
  displayFn(products: Products): string {
    return products && products.nameProduct ? products.nameProduct : '';
  }

  private _filter(nameProduct: string): Products[] {
    const filterValue = nameProduct.toLowerCase();

    return this.options.filter(option => option.nameProduct.toLowerCase().indexOf(filterValue) === 0);
  }
  goToPage(page: number): void {
    this.currentPage = page;
  }

  loadImageProduct(){
      return "assets/images/panier/picto-no-photo.png";
    }
}


