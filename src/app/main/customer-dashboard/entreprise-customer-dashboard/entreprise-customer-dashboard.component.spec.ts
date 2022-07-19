import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepriseCustomerDashboardComponent } from './entreprise-customer-dashboard.component';

describe('EntrepriseCustomerDashboardComponent', () => {
  let component: EntrepriseCustomerDashboardComponent;
  let fixture: ComponentFixture<EntrepriseCustomerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrepriseCustomerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrepriseCustomerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
