import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PopAddMailComponent } from './pop-add-mail.component';


describe('PopAddAddressComponent', () => {
  let component: PopAddMailComponent;
  let fixture: ComponentFixture<PopAddMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopAddMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopAddMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
