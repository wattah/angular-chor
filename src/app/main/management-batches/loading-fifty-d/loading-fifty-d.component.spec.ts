import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingFiftyDComponent } from './loading-fifty-d.component';

describe('LoadingFiftydComponent', () => {
  let component: LoadingFiftyDComponent;
  let fixture: ComponentFixture<LoadingFiftyDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingFiftyDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingFiftyDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
