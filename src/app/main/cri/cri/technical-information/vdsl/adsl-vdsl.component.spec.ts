import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdslVdslComponent } from './adsl-vdsl.component';

describe('AdslVdslComponent', () => {
  let component: AdslVdslComponent;
  let fixture: ComponentFixture<AdslVdslComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdslVdslComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdslVdslComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
