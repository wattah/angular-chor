import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAffectationListComponent } from './task-affectation-list.component';

describe('TaskAffectationListComponent', () => {
  let component: TaskAffectationListComponent;
  let fixture: ComponentFixture<TaskAffectationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskAffectationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAffectationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
