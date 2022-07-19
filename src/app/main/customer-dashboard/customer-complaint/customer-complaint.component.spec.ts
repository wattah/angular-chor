import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerComplaintComponent } from './customer-complaint.component';

describe('CustomerComplaintComponent', () => {
  let component: CustomerComplaintComponent;
  let fixture: ComponentFixture<CustomerComplaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerComplaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
