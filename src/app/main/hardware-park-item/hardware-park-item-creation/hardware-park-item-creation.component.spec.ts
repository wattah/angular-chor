import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareParkItemCreationComponent } from './hardware-park-item-creation.component';

describe('HardwareParkItemCreationComponent', () => {
  let component: HardwareParkItemCreationComponent;
  let fixture: ComponentFixture<HardwareParkItemCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareParkItemCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareParkItemCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
