import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationInterlocutorComponent } from './creation-interlocutor.component';

describe('CreationInterlocutorComponent', () => {
  let component: CreationInterlocutorComponent;
  let fixture: ComponentFixture<CreationInterlocutorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationInterlocutorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationInterlocutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
