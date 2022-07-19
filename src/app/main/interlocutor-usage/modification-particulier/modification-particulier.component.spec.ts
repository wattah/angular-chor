import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationParticulierComponent } from './modification-particulier.component';

describe('ModificationParticulierComponent', () => {
  let component: ModificationParticulierComponent;
  let fixture: ComponentFixture<ModificationParticulierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationParticulierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationParticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
