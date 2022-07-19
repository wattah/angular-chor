import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractualStatusConsultationComponent } from './contractual-status-consultation.component';

describe('ContractualStatusConsultationComponent', () => {
  let component: ContractualStatusConsultationComponent;
  let fixture: ComponentFixture<ContractualStatusConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractualStatusConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractualStatusConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
