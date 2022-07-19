import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerpMultipleTablesComponent } from './serp-multiple-tables.component';

describe('SerpMultipleTablesComponent', () => {
  let component: SerpMultipleTablesComponent;
  let fixture: ComponentFixture<SerpMultipleTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerpMultipleTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerpMultipleTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
