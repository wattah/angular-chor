import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillRequiredInfoComponent } from './bill-required-info.component';

describe('BillRequiredInfoComponent', () => {
  let component: BillRequiredInfoComponent;
  let fixture: ComponentFixture<BillRequiredInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillRequiredInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillRequiredInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
