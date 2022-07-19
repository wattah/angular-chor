import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerpErrorComponent } from './serp-error.component';

describe('SerpErrorComponent', () => {
  let component: SerpErrorComponent;
  let fixture: ComponentFixture<SerpErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerpErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerpErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
