import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologationHolderBusinessControlComponent } from './homologation-holder-business-control.component';

describe('HomologationHolderBusinessControlComponent', () => {
  let component: HomologationHolderBusinessControlComponent;
  let fixture: ComponentFixture<HomologationHolderBusinessControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomologationHolderBusinessControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomologationHolderBusinessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
