import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckingRequestCurrentlyOpenedPopUpComponent } from './checking-request-currently-opened-pop-up.component';

describe('CheckingRequestCurrentlyOpenedPopUpComponent', () => {
  let component: CheckingRequestCurrentlyOpenedPopUpComponent;
  let fixture: ComponentFixture<CheckingRequestCurrentlyOpenedPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckingRequestCurrentlyOpenedPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckingRequestCurrentlyOpenedPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
