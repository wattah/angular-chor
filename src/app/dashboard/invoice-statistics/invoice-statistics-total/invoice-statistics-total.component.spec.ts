import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceStatisticsTotalComponent } from './invoice-statistics-total.component';

describe('InvoiceStatisticsTotalComponent', () => {
  let component: InvoiceStatisticsTotalComponent;
  let fixture: ComponentFixture<InvoiceStatisticsTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceStatisticsTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceStatisticsTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
