import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherCreditComponent } from './other-credit.component';

describe('OtherCreditComponent', () => {
  let component: OtherCreditComponent;
  let fixture: ComponentFixture<OtherCreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherCreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
