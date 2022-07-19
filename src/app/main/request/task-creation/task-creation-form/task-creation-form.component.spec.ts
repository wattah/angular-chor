import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCreationFormComponent } from './task-creation-form.component';

describe('TaskCreationFormComponent', () => {
  let component: TaskCreationFormComponent;
  let fixture: ComponentFixture<TaskCreationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCreationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
