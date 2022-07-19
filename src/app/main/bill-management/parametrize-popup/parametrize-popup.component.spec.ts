import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrizePopupComponent } from './parametrize-popup.component';

describe('ParametrizePopupComponent', () => {
  let component: ParametrizePopupComponent;
  let fixture: ComponentFixture<ParametrizePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrizePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrizePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
