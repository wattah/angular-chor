import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSendingPopUpComponent } from './mail-sending-pop-up.component';

describe('MailSendingPopUpComponent', () => {
  let component: MailSendingPopUpComponent;
  let fixture: ComponentFixture<MailSendingPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailSendingPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSendingPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
