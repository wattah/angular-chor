import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcServicesComponent } from './parc-services.component';

describe('ParcServicesComponent', () => {
  let component: ParcServicesComponent;
  let fixture: ComponentFixture<ParcServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
