import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureWelcomeMailComponent } from './procedure-welcome-mail.component';

describe('ProcedureWelcomeMailComponent', () => {
  let component: ProcedureWelcomeMailComponent;
  let fixture: ComponentFixture<ProcedureWelcomeMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcedureWelcomeMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedureWelcomeMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
