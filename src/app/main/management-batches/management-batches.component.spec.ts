import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementBatchesComponent } from './management-batches.component';

describe('ManagementBatchesComponent', () => {
  let component: ManagementBatchesComponent;
  let fixture: ComponentFixture<ManagementBatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementBatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
