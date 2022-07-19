import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriComponent } from './cri.component';

describe('CriComponent', () => {
  let component: CriComponent;
  let fixture: ComponentFixture<CriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
