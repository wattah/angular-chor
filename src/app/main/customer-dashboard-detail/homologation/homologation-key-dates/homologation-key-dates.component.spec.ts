import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologationKeyDatesComponent } from './homologation-key-dates.component';

describe('HomologationKeyDatesComponent', () => {
  let component: HomologationKeyDatesComponent;
  let fixture: ComponentFixture<HomologationKeyDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomologationKeyDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomologationKeyDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
