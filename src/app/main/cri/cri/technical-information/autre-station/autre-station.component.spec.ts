import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutreStationComponent } from './autre-station.component';

describe('AutreStationComponent', () => {
  let component: AutreStationComponent;
  let fixture: ComponentFixture<AutreStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutreStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutreStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
