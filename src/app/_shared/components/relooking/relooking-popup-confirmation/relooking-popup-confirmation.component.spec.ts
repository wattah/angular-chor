import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelookingPopupConfirmationComponent } from './relooking-popup-confirmation.component';

describe('RelookingPopupConfirmationComponent', () => {
  let component: RelookingPopupConfirmationComponent;
  let fixture: ComponentFixture<RelookingPopupConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelookingPopupConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelookingPopupConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
