import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCreationConfirmationPopUpComponent } from './task-creation-confirmation-pop-up.component';

describe('TaskCreationConfirmationPopUpComponent', () => {
  let component: TaskCreationConfirmationPopUpComponent;
  let fixture: ComponentFixture<TaskCreationConfirmationPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCreationConfirmationPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCreationConfirmationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
