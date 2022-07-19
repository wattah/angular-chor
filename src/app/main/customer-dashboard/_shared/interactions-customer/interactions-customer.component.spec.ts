import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InteractionsCustomerComponent } from './interactions-customer.component';

describe('InteractionsCustomerComponent', () => {
  let component: InteractionsCustomerComponent;
  let fixture: ComponentFixture<InteractionsCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionsCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionsCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
