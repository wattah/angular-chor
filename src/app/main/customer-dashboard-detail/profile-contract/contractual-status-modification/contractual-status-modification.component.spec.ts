import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractualStatusModificationComponent } from './contractual-status-modification.component';

describe('ContractualStatusModificationComponent', () => {
  let component: ContractualStatusModificationComponent;
  let fixture: ComponentFixture<ContractualStatusModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractualStatusModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractualStatusModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
