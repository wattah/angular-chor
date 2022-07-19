import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareParkItemComponent } from './hardware-park-item.component';

describe('HardwareParkItemComponent', () => {
  let component: HardwareParkItemComponent;
  let fixture: ComponentFixture<HardwareParkItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareParkItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareParkItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
