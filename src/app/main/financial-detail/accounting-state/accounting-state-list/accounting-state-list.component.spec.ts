import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingStateListComponent } from './accounting-state-list.component';

describe('AccountingStateListComponent', () => {
  let component: AccountingStateListComponent;
  let fixture: ComponentFixture<AccountingStateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingStateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingStateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
