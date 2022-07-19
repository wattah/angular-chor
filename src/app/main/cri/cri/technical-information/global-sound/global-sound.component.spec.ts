import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSoundComponent } from './global-sound.component';

describe('GlobalSoundComponent', () => {
  let component: GlobalSoundComponent;
  let fixture: ComponentFixture<GlobalSoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalSoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
