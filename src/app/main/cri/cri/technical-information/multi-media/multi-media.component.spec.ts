import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiMediaComponent } from './multi-media.component';

describe('MultiMediaComponent', () => {
  let component: MultiMediaComponent;
  let fixture: ComponentFixture<MultiMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
