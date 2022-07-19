import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthenaPaginatedAgGridComponent } from './athena-paginated-ag-grid.component';

describe('AthenaPaginatedAgGridComponent', () => {
  let component: AthenaPaginatedAgGridComponent;
  let fixture: ComponentFixture<AthenaPaginatedAgGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthenaPaginatedAgGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthenaPaginatedAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
