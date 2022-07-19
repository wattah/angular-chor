import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleApprovalComponent } from './sale-approval.component';

describe('SaleApprovalComponent', () => {
  let component: SaleApprovalComponent;
  let fixture: ComponentFixture<SaleApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
