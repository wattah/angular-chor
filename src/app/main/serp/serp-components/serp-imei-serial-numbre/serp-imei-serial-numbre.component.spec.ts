/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SerpImeiSerialNumbreComponent } from './serp-imei-serial-numbre.component';

describe('SerpImeiSerialNumbreComponent', () => {
  let component: SerpImeiSerialNumbreComponent;
  let fixture: ComponentFixture<SerpImeiSerialNumbreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerpImeiSerialNumbreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerpImeiSerialNumbreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
