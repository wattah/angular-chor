import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreHomologationHolderBusinessControlComponent } from './pre-homologation-holder-business-control.component';

describe('PreHomologationHolderBusinessControlComponent', () => {
  let component: PreHomologationHolderBusinessControlComponent;
  let fixture: ComponentFixture<PreHomologationHolderBusinessControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreHomologationHolderBusinessControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreHomologationHolderBusinessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
