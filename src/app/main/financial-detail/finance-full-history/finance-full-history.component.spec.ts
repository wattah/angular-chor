import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceFullHistoryComponent } from './finance-full-history.component';

describe('FinanceFullHistoryComponent', () => {
  let component: FinanceFullHistoryComponent;
  let fixture: ComponentFixture<FinanceFullHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceFullHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceFullHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
