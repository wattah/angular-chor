import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InteractionCreationComponent } from './interaction-creation.component';


describe('InteractionCreationComponent', () => {
  let component: InteractionCreationComponent;
  let fixture: ComponentFixture<InteractionCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
