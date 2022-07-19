import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDevisComponent } from './tab-devis.component';

describe('TabDevisComponent', () => {
  let component: TabDevisComponent;
  let fixture: ComponentFixture<TabDevisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabDevisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
