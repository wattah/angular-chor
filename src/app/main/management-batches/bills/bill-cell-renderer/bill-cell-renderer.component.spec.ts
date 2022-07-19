import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillCellRendererComponent } from './bill-cell-renderer.component';

describe('BillCellRendererComponent', () => {
  let component: BillCellRendererComponent;
  let fixture: ComponentFixture<BillCellRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
