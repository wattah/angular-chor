import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDeleteArticleComponent } from './popup-delete-article.component';

describe('PopupDeleteArticleComponent', () => {
  let component: PopupDeleteArticleComponent;
  let fixture: ComponentFixture<PopupDeleteArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupDeleteArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupDeleteArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
