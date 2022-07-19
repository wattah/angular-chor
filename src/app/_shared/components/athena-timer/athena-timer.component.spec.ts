import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthenaTimerComponent } from './athena-timer.component';

describe('AthenaTimerComponent', () => {
  let component: AthenaTimerComponent;
  let fixture: ComponentFixture<AthenaTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthenaTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthenaTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
