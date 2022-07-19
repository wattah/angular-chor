import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LangageComponent } from './language.component';

describe('LangageComponent', () => {
  let component: LangageComponent;
  let fixture: ComponentFixture<LangageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LangageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LangageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
