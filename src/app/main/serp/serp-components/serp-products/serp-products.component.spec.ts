import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerpProductsComponent } from './serp-products.component';

describe('SerpProductsComponent', () => {
  let component: SerpProductsComponent;
  let fixture: ComponentFixture<SerpProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerpProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerpProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
