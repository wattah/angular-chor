import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileNotFoundPopupComponent } from './file-not-found-popup.component';

describe('FileNotFoundPopupComponent', () => {
  let component: FileNotFoundPopupComponent;
  let fixture: ComponentFixture<FileNotFoundPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileNotFoundPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileNotFoundPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
