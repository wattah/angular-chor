import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillManagementComponent } from './bill-management.component';

describe('BillManagementComponent', () => {
  let component: BillManagementComponent;
  let fixture: ComponentFixture<BillManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
