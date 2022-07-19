import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareParkItemUpdateComponent } from './hardware-park-item-update.component';

describe('HardwareParkItemUpdateComponent', () => {
  let component: HardwareParkItemUpdateComponent;
  let fixture: ComponentFixture<HardwareParkItemUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareParkItemUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareParkItemUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
