import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriCreationComponent } from './cri-creation.component';

describe('CriCreationComponent', () => {
  let component: CriCreationComponent;
  let fixture: ComponentFixture<CriCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
