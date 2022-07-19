import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthenaProfilLoaderComponent } from './athena-profil-loader.component';

describe('AthenaProfilLoaderComponent', () => {
  let component: AthenaProfilLoaderComponent;
  let fixture: ComponentFixture<AthenaProfilLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthenaProfilLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthenaProfilLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
