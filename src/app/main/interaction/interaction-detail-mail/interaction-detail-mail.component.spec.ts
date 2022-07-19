import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionDetailMailComponent } from './interaction-detail-mail.component';

describe('InteractionDetailMailComponent', () => {
  let component: InteractionDetailMailComponent;
  let fixture: ComponentFixture<InteractionDetailMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionDetailMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionDetailMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
