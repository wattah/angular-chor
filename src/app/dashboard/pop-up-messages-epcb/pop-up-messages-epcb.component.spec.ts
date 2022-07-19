import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpMessagesEpcbComponent } from './pop-up-messages-epcb.component';

describe('PopUpMessagesEpcbComponent', () => {
  let component: PopUpMessagesEpcbComponent;
  let fixture: ComponentFixture<PopUpMessagesEpcbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopUpMessagesEpcbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpMessagesEpcbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
