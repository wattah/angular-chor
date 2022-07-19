import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthenaPaginationComponent } from './athena-pagination.component';

describe('AthenaPaginationComponent', () => {
  let component: AthenaPaginationComponent;
  let fixture: ComponentFixture<AthenaPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthenaPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthenaPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
