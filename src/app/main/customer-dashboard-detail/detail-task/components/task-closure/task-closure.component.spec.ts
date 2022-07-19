import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskClosureComponent } from './task-closure.component';

describe('TaskClosureComponent', () => {
  let component: TaskClosureComponent;
  let fixture: ComponentFixture<TaskClosureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskClosureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
