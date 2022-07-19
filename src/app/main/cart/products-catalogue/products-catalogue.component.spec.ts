import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCatalogueDetailComponent } from './products-catalogue.component';

describe('ProductsCatalogueDetailComponent', () => {
  let component: ProductsCatalogueDetailComponent;
  let fixture: ComponentFixture<ProductsCatalogueDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsCatalogueDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsCatalogueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
