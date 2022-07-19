import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockParkItemPopUpComponent } from './unlock-park-item-pop-up.component';

describe('UnlockParkItemPopUpComponent', () => {
  let component: UnlockParkItemPopUpComponent;
  let fixture: ComponentFixture<UnlockParkItemPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlockParkItemPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockParkItemPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
