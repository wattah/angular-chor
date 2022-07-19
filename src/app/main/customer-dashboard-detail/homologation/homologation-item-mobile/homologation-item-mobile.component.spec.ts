import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologationItemMobileComponent } from './homologation-item-mobile.component';

describe('HomologationItemMobileComponent', () => {
  let component: HomologationItemMobileComponent;
  let fixture: ComponentFixture<HomologationItemMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomologationItemMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomologationItemMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
