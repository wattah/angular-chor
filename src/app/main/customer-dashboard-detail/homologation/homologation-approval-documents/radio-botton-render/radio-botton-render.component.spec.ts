import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioBottonRenderComponent } from './radio-botton-render.component';

describe('RadioBottonRenderComponent', () => {
  let component: RadioBottonRenderComponent;
  let fixture: ComponentFixture<RadioBottonRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioBottonRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioBottonRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
