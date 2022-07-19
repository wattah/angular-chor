import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAbsenceCancelPopUpComponent } from './add-absence-cancel-pop-up.component';

describe('AddAbsenceCancelPopUpComponent', () => {
  let component: AddAbsenceCancelPopUpComponent;
  let fixture: ComponentFixture<AddAbsenceCancelPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAbsenceCancelPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAbsenceCancelPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
