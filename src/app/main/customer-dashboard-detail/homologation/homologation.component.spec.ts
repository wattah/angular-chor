import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologationComponent } from './homologation.component';

describe('HomologationComponent', () => {
  let component: HomologationComponent;
  let fixture: ComponentFixture<HomologationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomologationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomologationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
