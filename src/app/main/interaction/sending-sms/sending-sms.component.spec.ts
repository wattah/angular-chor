import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendingSmsComponent } from './sending-sms.component';

describe('SendingSmsComponent', () => {
  let component: SendingSmsComponent;
  let fixture: ComponentFixture<SendingSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendingSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendingSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
