import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkItemGeneralInformationsComponent } from './park-item-general-informations.component';

describe('ParkItemGeneralInformationsComponent', () => {
  let component: ParkItemGeneralInformationsComponent;
  let fixture: ComponentFixture<ParkItemGeneralInformationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkItemGeneralInformationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkItemGeneralInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
