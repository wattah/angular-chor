import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologationItemServiceComponent } from './homologation-item-service.component';

describe('HomologationItemServiceComponent', () => {
  let component: HomologationItemServiceComponent;
  let fixture: ComponentFixture<HomologationItemServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomologationItemServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomologationItemServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
