import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodToKnowModificationComponent } from './good-to-know-modification.component';

describe('GoodToKnowModificationComponent', () => {
  let component: GoodToKnowModificationComponent;
  let fixture: ComponentFixture<GoodToKnowModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodToKnowModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodToKnowModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
