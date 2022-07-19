import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologationBeneficiariesBusinessControlComponent } from './homologation-beneficiaries-business-control.component';

describe('HomologationBeneficiariesBusinessControlComponent', () => {
  let component: HomologationBeneficiariesBusinessControlComponent;
  let fixture: ComponentFixture<HomologationBeneficiariesBusinessControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomologationBeneficiariesBusinessControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomologationBeneficiariesBusinessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
