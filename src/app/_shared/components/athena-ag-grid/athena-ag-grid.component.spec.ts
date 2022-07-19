import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthenaAgGridComponent } from './athena-ag-grid.component';

describe('AthenaAgGridComponent', () => {
  let component: AthenaAgGridComponent;
  let fixture: ComponentFixture<AthenaAgGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthenaAgGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthenaAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
