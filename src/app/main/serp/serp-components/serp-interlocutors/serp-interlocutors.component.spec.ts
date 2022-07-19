import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerpInterlocutorsComponent } from './serp-interlocutors.component';

describe('SerpInterlocutorsComponent', () => {
  let component: SerpInterlocutorsComponent;
  let fixture: ComponentFixture<SerpInterlocutorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerpInterlocutorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerpInterlocutorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
