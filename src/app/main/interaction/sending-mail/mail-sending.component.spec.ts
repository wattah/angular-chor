import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSendingComponent } from './mail-sending.component';

describe('MailSendingComponent', () => {
  let component: MailSendingComponent;
  let fixture: ComponentFixture<MailSendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailSendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
