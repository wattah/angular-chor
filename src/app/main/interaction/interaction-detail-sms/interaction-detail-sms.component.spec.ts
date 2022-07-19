import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionDetailSmsComponent } from './interaction-detail-sms.component';

describe('InteractionDetailSmsComponent', () => {
  let component: InteractionDetailSmsComponent;
  let fixture: ComponentFixture<InteractionDetailSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionDetailSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionDetailSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
