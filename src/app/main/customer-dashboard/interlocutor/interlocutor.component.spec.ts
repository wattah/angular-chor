import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterlocutorComponent } from './interlocutor.component';

describe('InterlocutorComponent', () => {
  let component: InterlocutorComponent;
  let fixture: ComponentFixture<InterlocutorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterlocutorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterlocutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
