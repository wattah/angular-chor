import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpDeleteAbsenceComponent } from './pop-up-delete-absence.component';

describe('PopUpDeleteAbsenceComponent', () => {
  let component: PopUpDeleteAbsenceComponent;
  let fixture: ComponentFixture<PopUpDeleteAbsenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopUpDeleteAbsenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpDeleteAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
