import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPenicheComponent } from './customer-peniche.component';

describe('CustomerPenicheComponent', () => {
  let component: CustomerPenicheComponent;
  let fixture: ComponentFixture<CustomerPenicheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPenicheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPenicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
