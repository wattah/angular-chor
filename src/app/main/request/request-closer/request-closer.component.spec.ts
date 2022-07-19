import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCloserComponent } from './request-closer.component';

describe('AssignmentTaskFormComponent', () => {
  let component: RequestCloserComponent;
  let fixture: ComponentFixture<RequestCloserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestCloserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCloserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
