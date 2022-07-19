import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAccountComponent } from './billing-account.component';

describe('BillingAccountComponent', () => {
  let component: BillingAccountComponent;
  let fixture: ComponentFixture<BillingAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
