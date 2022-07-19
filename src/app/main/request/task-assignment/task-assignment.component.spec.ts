import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentTaskComponent } from './task-assignment.component';

describe('AssignmentTaskComponent', () => {
  let component: AssignmentTaskComponent;
  let fixture: ComponentFixture<AssignmentTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
