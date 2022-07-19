import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingStateComponent } from './accounting-state.component';

describe('AccountingStateComponent', () => {
  let component: AccountingStateComponent;
  let fixture: ComponentFixture<AccountingStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
