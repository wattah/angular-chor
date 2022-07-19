import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateParkItemPopUpComponent } from './activate-park-item-pop-up.component';

describe('ActivateParkItemPopUpComponent', () => {
  let component: ActivateParkItemPopUpComponent;
  let fixture: ComponentFixture<ActivateParkItemPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateParkItemPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateParkItemPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
