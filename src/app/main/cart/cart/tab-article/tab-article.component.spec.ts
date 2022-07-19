import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabArticleComponent } from './tab-article.component';

describe('TabArticleComponent', () => {
  let component: TabArticleComponent;
  let fixture: ComponentFixture<TabArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
