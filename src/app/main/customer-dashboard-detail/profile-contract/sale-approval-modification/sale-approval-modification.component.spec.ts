import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleApprovalModificationComponent } from './sale-approval-modification.component';

describe('SaleApprovalModificationComponent', () => {
  let component: SaleApprovalModificationComponent;
  let fixture: ComponentFixture<SaleApprovalModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleApprovalModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleApprovalModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
