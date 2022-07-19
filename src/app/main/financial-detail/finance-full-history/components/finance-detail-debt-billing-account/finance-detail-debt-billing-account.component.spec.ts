import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceDetailDebtBillingAccountComponent } from './finance-detail-debt-billing-account.component';

describe('FinanceDetailDebtBillingAccountComponent', () => {
  let component: FinanceDetailDebtBillingAccountComponent;
  let fixture: ComponentFixture<FinanceDetailDebtBillingAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceDetailDebtBillingAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceDetailDebtBillingAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
