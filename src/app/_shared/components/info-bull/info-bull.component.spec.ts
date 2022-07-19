import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBullComponent } from './info-bull.component';

describe('InfoBullComponent', () => {
  let component: InfoBullComponent;
  let fixture: ComponentFixture<InfoBullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoBullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
