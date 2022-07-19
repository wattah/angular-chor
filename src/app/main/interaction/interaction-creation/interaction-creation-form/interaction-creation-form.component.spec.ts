import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionCreationFormComponent } from './interaction-creation-form.component';

describe('InteractionCreationFormComponent', () => {
  let component: InteractionCreationFormComponent;
  let fixture: ComponentFixture<InteractionCreationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionCreationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
