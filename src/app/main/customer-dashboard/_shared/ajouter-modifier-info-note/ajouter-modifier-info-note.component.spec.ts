import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterModifierInfoNoteComponent } from './ajouter-modifier-info-note.component';

describe('AjouterModifierInfoNoteComponent', () => {
  let component: AjouterModifierInfoNoteComponent;
  let fixture: ComponentFixture<AjouterModifierInfoNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjouterModifierInfoNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterModifierInfoNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
