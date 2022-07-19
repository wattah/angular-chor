import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomologationAccessPopupComponent } from './homologation-access-popup.component';


describe('HomologationAccessPopupComponent', () => {
  let component: HomologationAccessPopupComponent;
  let fixture: ComponentFixture<HomologationAccessPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomologationAccessPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomologationAccessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
