import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationalModificationComponent } from './relational-modification.component';

describe('RelationalModificationComponent', () => {
  let component: RelationalModificationComponent;
  let fixture: ComponentFixture<RelationalModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationalModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationalModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
