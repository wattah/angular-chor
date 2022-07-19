/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TarifDeclinationComponent } from './tarif-declination.component';

describe('TarifDeclinationComponent', () => {
  let component: TarifDeclinationComponent;
  let fixture: ComponentFixture<TarifDeclinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarifDeclinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarifDeclinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
