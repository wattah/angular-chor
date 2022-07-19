import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavMobileComponent } from './sav-mobile.component';

describe('SavMobileComponent', () => {
  let component: SavMobileComponent;
  let fixture: ComponentFixture<SavMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
