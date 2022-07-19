import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPenicheModificationComponent } from './customer-peniche-modification.component';

describe('CustomerPenicheModificationComponent', () => {
  let component: CustomerPenicheModificationComponent;
  let fixture: ComponentFixture<CustomerPenicheModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPenicheModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPenicheModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
