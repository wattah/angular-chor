import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceDetailInternetAccountComponent } from './finance-detail-internet-account.component';

describe('FinanceDetailInternetAccountComponent', () => {
  let component: FinanceDetailInternetAccountComponent;
  let fixture: ComponentFixture<FinanceDetailInternetAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceDetailInternetAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceDetailInternetAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
