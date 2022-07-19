import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoPopUpComponent } from './logo-pop-up.component';

describe('LogoPopUpComponent', () => {
  let component: LogoPopUpComponent;
  let fixture: ComponentFixture<LogoPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
