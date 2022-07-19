import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificationEntrepriseComponent } from './modification-entreprise.component';


describe('ModificationEntrepriseComponent', () => {
  let component: ModificationEntrepriseComponent;
  let fixture: ComponentFixture<ModificationEntrepriseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationEntrepriseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
