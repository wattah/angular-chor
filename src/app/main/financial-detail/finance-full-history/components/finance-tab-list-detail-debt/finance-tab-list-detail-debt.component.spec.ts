import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceTabDetailsComponent } from './finance-tab-details.component';

describe('FinanceTabDetailsComponent', () => {
  let component: FinanceTabDetailsComponent;
  let fixture: ComponentFixture<FinanceTabDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceTabDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceTabDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
