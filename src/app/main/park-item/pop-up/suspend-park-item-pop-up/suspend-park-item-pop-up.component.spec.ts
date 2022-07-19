import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendParkItemPopUpComponent } from './suspend-park-item-pop-up.component';

describe('SuspendParkItemPopUpComponent', () => {
  let component: SuspendParkItemPopUpComponent;
  let fixture: ComponentFixture<SuspendParkItemPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuspendParkItemPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspendParkItemPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
