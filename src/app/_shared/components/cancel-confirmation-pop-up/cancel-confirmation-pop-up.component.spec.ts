import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelConfirmationPopUpComponent } from './cancel-confirmation-pop-up.component';

describe('CancelConfirmationPopUpComponent', () => {
  let component: CancelConfirmationPopUpComponent;
  let fixture: ComponentFixture<CancelConfirmationPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelConfirmationPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelConfirmationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
