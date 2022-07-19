import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtMobileServiceComponent } from './debt-mobile-service.component';

describe('DebtMobileServiceComponent', () => {
  let component: DebtMobileServiceComponent;
  let fixture: ComponentFixture<DebtMobileServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebtMobileServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtMobileServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
