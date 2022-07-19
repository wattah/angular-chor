import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillManagementDetailComponent } from './bill-management-detail.component';

describe('BillManagementDetailComponent', () => {
  let component: BillManagementDetailComponent;
  let fixture: ComponentFixture<BillManagementDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillManagementDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillManagementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
