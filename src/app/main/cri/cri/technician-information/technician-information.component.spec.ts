import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianInformationComponent } from './technician-information.component';

describe('TechnicianInformationComponent', () => {
  let component: TechnicianInformationComponent;
  let fixture: ComponentFixture<TechnicianInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
