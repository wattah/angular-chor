import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthenaEditorComponent } from './athena-editor.component';

describe('AthenaEditorComponent', () => {
  let component: AthenaEditorComponent;
  let fixture: ComponentFixture<AthenaEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthenaEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthenaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
