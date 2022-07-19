import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMailComponent } from './preview-mail.component';

describe('PreviewMailComponent', () => {
  let component: PreviewMailComponent;
  let fixture: ComponentFixture<PreviewMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
