import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NasComponent } from './nas.component';

describe('NasComponent', () => {
  let component: NasComponent;
  let fixture: ComponentFixture<NasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
