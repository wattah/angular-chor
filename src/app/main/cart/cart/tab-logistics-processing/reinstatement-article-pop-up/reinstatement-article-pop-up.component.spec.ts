import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinstatementArticlePopUpComponent } from './reinstatement-article-pop-up.component';

describe('ReinstatementArticlePopUpComponent', () => {
  let component: ReinstatementArticlePopUpComponent;
  let fixture: ComponentFixture<ReinstatementArticlePopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReinstatementArticlePopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReinstatementArticlePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
