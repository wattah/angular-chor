import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FemtocellComponent } from './femtocell.component';

describe('FemtocellComponent', () => {
  let component: FemtocellComponent;
  let fixture: ComponentFixture<FemtocellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FemtocellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FemtocellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
