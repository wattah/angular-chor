import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDashboardDetailComponent } from './customer-dashboard-detail.component';

describe('CustomerDashboardDetailComponent', () => {
  let component: CustomerDashboardDetailComponent;
  let fixture: ComponentFixture<CustomerDashboardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDashboardDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDashboardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
