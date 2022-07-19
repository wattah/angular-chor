import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticularCustomerDashboardComponent } from './particular-customer-dashboard.component';

describe('ParticularCustomerDashboardComponent', () => {
  let component: ParticularCustomerDashboardComponent;
  let fixture: ComponentFixture<ParticularCustomerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticularCustomerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticularCustomerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
