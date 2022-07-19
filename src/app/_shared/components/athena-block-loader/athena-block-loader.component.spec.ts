import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthenaBlockLoaderComponent } from './athena-block-loader.component';

describe('AthenaBlockLoaderComponent', () => {
  let component: AthenaBlockLoaderComponent;
  let fixture: ComponentFixture<AthenaBlockLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthenaBlockLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthenaBlockLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
