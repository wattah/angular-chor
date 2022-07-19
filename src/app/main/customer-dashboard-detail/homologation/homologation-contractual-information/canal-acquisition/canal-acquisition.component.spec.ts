import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanalAcquisitionComponent } from './canal-acquisition.component';

describe('CanalAcquisitionComponent', () => {
  let component: CanalAcquisitionComponent;
  let fixture: ComponentFixture<CanalAcquisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanalAcquisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanalAcquisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
