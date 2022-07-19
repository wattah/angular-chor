import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPenicheConsultationComponent } from './customer-peniche-consultation.component';

describe('CustomerPenicheConsultationComponent', () => {
  let component: CustomerPenicheConsultationComponent;
  let fixture: ComponentFixture<CustomerPenicheConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPenicheConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPenicheConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
