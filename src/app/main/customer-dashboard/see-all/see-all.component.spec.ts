import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeAllComponent } from './see-all.component';

describe('SeeAllComponent', () => {
  let component: SeeAllComponent;
  let fixture: ComponentFixture<SeeAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
