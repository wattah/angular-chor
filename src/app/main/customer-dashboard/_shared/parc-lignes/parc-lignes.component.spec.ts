import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcLignesComponent } from './parc-lignes.component';

describe('ParcLignesComponent', () => {
  let component: ParcLignesComponent;
  let fixture: ComponentFixture<ParcLignesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcLignesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcLignesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
