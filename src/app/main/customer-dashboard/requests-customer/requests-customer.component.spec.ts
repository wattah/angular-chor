import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsCustomerComponent } from './requests-customer.component';

describe('RequestsCustomerComponent', () => {
  let component: RequestsCustomerComponent;
  let fixture: ComponentFixture<RequestsCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestsCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
