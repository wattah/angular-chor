import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCatalogAgGridComponent } from './products-catalog-ag-grid.component';

describe('ProductsCatalogAgGridComponent', () => {
  let component: ProductsCatalogAgGridComponent;
  let fixture: ComponentFixture<ProductsCatalogAgGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsCatalogAgGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsCatalogAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
