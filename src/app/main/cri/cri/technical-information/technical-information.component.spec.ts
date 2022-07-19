import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalInformationComponent } from './technical-information.component';

describe('TechnicalInformationComponent', () => {
  let component: TechnicalInformationComponent;
  let fixture: ComponentFixture<TechnicalInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
