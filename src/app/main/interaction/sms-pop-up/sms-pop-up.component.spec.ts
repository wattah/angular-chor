import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsPopUpComponent } from './sms-pop-up.component';

describe('SmsPopUpComponent', () => {
  let component: SmsPopUpComponent;
  let fixture: ComponentFixture<SmsPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
