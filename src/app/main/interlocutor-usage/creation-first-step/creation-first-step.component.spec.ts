import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationFirstStepComponent } from './creation-first-step.component';

describe('CreationFirstStepComponent', () => {
  let component: CreationFirstStepComponent;
  let fixture: ComponentFixture<CreationFirstStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationFirstStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationFirstStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
