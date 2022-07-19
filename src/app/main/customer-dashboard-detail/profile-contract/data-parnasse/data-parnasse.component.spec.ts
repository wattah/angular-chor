import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataParnasseComponent } from './data-parnasse.component';

describe('DataParnasseComponent', () => {
  let component: DataParnasseComponent;
  let fixture: ComponentFixture<DataParnasseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataParnasseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataParnasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
