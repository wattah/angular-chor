import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillManagementDetailCellRendererComponent } from './bill-management-detail-cell-renderer.component';

describe('BillManagementDetailCellRendererComponent', () => {
  let component: BillManagementDetailCellRendererComponent;
  let fixture: ComponentFixture<BillManagementDetailCellRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillManagementDetailCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillManagementDetailCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
