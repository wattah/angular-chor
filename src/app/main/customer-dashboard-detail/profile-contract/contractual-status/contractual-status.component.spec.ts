import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractualStatusComponent } from './contractual-status.component';

describe('ContractualStatusComponent', () => {
  let component: ContractualStatusComponent;
  let fixture: ComponentFixture<ContractualStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractualStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractualStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
