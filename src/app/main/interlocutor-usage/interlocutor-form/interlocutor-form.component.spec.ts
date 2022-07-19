import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InterlocutorFormComponent } from './interlocutor-form.component';



describe('InterlocutorFormComponent', () => {
  let component: InterlocutorFormComponent;
  let fixture: ComponentFixture<InterlocutorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterlocutorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterlocutorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
