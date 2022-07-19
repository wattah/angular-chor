import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillInformationComponent } from './bill-information.component';

describe('BillInformationComponent', () => {
  let component: BillInformationComponent;
  let fixture: ComponentFixture<BillInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
