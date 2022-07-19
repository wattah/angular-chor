import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcServicesDetailComponent } from './parc-services-detail.component';

describe('ParcServicesComponent', () => {
  let component: ParcServicesDetailComponent;
  let fixture: ComponentFixture<ParcServicesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcServicesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcServicesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
