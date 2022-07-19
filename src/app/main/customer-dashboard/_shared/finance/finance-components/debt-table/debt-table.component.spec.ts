import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtTableComponent } from './debt-table.component';

describe('DebtTableComponent', () => {
  let component: DebtTableComponent;
  let fixture: ComponentFixture<DebtTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebtTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
