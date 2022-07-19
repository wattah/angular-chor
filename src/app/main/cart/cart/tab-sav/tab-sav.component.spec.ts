import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSavComponent } from './tab-sav.component';

describe('TabSavComponent', () => {
  let component: TabSavComponent;
  let fixture: ComponentFixture<TabSavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabSavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabSavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
