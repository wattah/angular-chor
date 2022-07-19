import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterlocutorUsageComponent } from './interlocutor-usage.component';

describe('InterlocutorUsageComponent', () => {
  let component: InterlocutorUsageComponent;
  let fixture: ComponentFixture<InterlocutorUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterlocutorUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterlocutorUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
