import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCardChangeComponent } from './customer-card-change.component';

describe('CustomerCardChangeComponent', () => {
  let component: CustomerCardChangeComponent;
  let fixture: ComponentFixture<CustomerCardChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCardChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCardChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
