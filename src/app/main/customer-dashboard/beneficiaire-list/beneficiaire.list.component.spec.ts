import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaireListComponent } from './beneficiaire.list.component';

describe('BeneficiairesComponent', () => {
  let component: BeneficiaireListComponent;
  let fixture: ComponentFixture<BeneficiaireListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiaireListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaireListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
