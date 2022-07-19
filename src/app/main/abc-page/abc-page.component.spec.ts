import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbcPageComponent } from './abc-page.component';

describe('AbcPageComponent', () => {
  let component: AbcPageComponent;
  let fixture: ComponentFixture<AbcPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbcPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbcPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
