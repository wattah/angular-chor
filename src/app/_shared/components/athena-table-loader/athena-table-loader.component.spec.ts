import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthenaTableLoaderComponent } from './athena-table-loader.component';

describe('AthenaTableLoaderComponent', () => {
  let component: AthenaTableLoaderComponent;
  let fixture: ComponentFixture<AthenaTableLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthenaTableLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthenaTableLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
