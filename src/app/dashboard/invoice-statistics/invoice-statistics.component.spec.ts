import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceStatisticsComponent } from './invoice-statistics.component';

describe('InvoiceStatisticsComponent', () => {
  let component: InvoiceStatisticsComponent;
  let fixture: ComponentFixture<InvoiceStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
