import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationLineComponent } from './creation-line.component';

describe('CreationLineComponent', () => {
  let component: CreationLineComponent;
  let fixture: ComponentFixture<CreationLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
