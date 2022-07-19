import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredInformationComponent } from './required-information.component';

describe('RequiredInformationComponent', () => {
  let component: RequiredInformationComponent;
  let fixture: ComponentFixture<RequiredInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequiredInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
