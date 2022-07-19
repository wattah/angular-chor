import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataParnasseModificationComponent } from './data-parnasse-modification.component';

describe('DataParnasseModificationComponent', () => {
  let component: DataParnasseModificationComponent;
  let fixture: ComponentFixture<DataParnasseModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataParnasseModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataParnasseModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
