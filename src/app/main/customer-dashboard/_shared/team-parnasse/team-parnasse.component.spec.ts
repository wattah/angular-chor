import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamParnasseComponent } from './team-parnasse.component';

describe('TeamParnasseComponent', () => {
  let component: TeamParnasseComponent;
  let fixture: ComponentFixture<TeamParnasseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamParnasseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamParnasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
