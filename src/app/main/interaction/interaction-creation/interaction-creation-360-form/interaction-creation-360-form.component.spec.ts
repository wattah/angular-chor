import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionCreation360FormComponent } from './interaction-creation-360-form.component';

describe('InteractionCreation360FormComponent', () => {
  let component: InteractionCreation360FormComponent;
  let fixture: ComponentFixture<InteractionCreation360FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionCreation360FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionCreation360FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
