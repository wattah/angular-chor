import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaBannerComponent } from './ada-banner.component';

describe('AdaBannerComponent', () => {
  let component: AdaBannerComponent;
  let fixture: ComponentFixture<AdaBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdaBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
