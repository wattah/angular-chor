import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRecoveredComponent } from './material-recovered.component';

describe('MaterialRecoveredComponent', () => {
  let component: MaterialRecoveredComponent;
  let fixture: ComponentFixture<MaterialRecoveredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialRecoveredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRecoveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
