import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixLineComponent } from './fix-line.component';

describe('FixLineComponent', () => {
  let component: FixLineComponent;
  let fixture: ComponentFixture<FixLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
