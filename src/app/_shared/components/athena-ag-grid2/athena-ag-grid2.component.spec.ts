import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthenaAgGrid2Component } from './athena-ag-grid2.component';

describe('AthenaAgGrid2Component', () => {
  let component: AthenaAgGrid2Component;
  let fixture: ComponentFixture<AthenaAgGrid2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthenaAgGrid2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthenaAgGrid2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
