import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleApprovalConsultationComponent } from './sale-approval-consultation.component';

describe('SaleApprovalConsultationComponent', () => {
  let component: SaleApprovalConsultationComponent;
  let fixture: ComponentFixture<SaleApprovalConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleApprovalConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleApprovalConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
