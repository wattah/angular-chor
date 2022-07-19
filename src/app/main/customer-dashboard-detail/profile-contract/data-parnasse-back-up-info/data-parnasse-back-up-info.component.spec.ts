import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataParnasseBackUpInfoComponent } from './data-parnasse-back-up-info.component';

describe('DataParnasseBackUpInfoComponent', () => {
  let component: DataParnasseBackUpInfoComponent;
  let fixture: ComponentFixture<DataParnasseBackUpInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataParnasseBackUpInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataParnasseBackUpInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
