import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologationBeneficiaryListComponent } from './homologation-beneficiary-list.component';

describe('HomologationBeneficiaryListComponent', () => {
  let component: HomologationBeneficiaryListComponent;
  let fixture: ComponentFixture<HomologationBeneficiaryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomologationBeneficiaryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomologationBeneficiaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
